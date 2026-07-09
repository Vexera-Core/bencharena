use serde::{Deserialize, Serialize};
use thiserror::Error;

use crate::{AgentPassport, VerificationStatus};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct CreditBalance {
    pub available_cents: u64,
    pub starter_deposit_cents: u64,
}

impl CreditBalance {
    pub fn charge(self, cost_cents: u64) -> Result<Self, ComputeError> {
        let available_cents = self
            .available_cents
            .checked_sub(cost_cents)
            .ok_or(ComputeError::InsufficientCredits)?;

        Ok(Self {
            available_cents,
            ..self
        })
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct BenchmarkPrice {
    pub compute_cents: u64,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub struct StarterCreditPolicy {
    pub required_deposit_cents: u64,
    pub first_benchmark_covered: bool,
}

impl Default for StarterCreditPolicy {
    fn default() -> Self {
        Self {
            required_deposit_cents: 100,
            first_benchmark_covered: true,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ComputeGrant {
    pub passport_id: String,
    pub compute_cents: u64,
    pub reason: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ComputeEligibility {
    StarterCovered,
    CreditCovered { cost_cents: u64 },
    VerifiedGrant { granted_cents: u64 },
    BlockedInsufficientCredits,
}

pub fn calculate_benchmark_cost(price: BenchmarkPrice) -> u64 {
    price.compute_cents
}

pub fn can_run_starter_benchmark(
    balance: CreditBalance,
    price: BenchmarkPrice,
    policy: StarterCreditPolicy,
    starter_benchmark_already_used: bool,
) -> ComputeEligibility {
    if !starter_benchmark_already_used
        && policy.first_benchmark_covered
        && balance.starter_deposit_cents >= policy.required_deposit_cents
    {
        return ComputeEligibility::StarterCovered;
    }

    credit_eligibility(balance, price)
}

pub fn can_access_extra_compute(
    balance: CreditBalance,
    price: BenchmarkPrice,
    grant: Option<&ComputeGrant>,
) -> ComputeEligibility {
    let cost_cents = calculate_benchmark_cost(price);
    if let Some(grant) = grant.filter(|grant| grant.compute_cents >= cost_cents) {
        return ComputeEligibility::VerifiedGrant {
            granted_cents: grant.compute_cents,
        };
    }

    credit_eligibility(balance, price)
}

pub fn grant_verified_agent_compute(
    passport: &AgentPassport,
    compute_cents: u64,
) -> Result<ComputeGrant, ComputeError> {
    if !matches!(
        passport.verification_status,
        VerificationStatus::MockVerified | VerificationStatus::Verified
    ) {
        return Err(ComputeError::AgentNotVerified);
    }
    if compute_cents == 0 {
        return Err(ComputeError::EmptyGrant);
    }

    Ok(ComputeGrant {
        passport_id: passport.passport_id.clone(),
        compute_cents,
        reason: "verified-agent local compute grant".to_owned(),
    })
}

fn credit_eligibility(balance: CreditBalance, price: BenchmarkPrice) -> ComputeEligibility {
    let cost_cents = calculate_benchmark_cost(price);
    if balance.available_cents >= cost_cents {
        ComputeEligibility::CreditCovered { cost_cents }
    } else {
        ComputeEligibility::BlockedInsufficientCredits
    }
}

#[derive(Debug, Error, PartialEq, Eq)]
pub enum ComputeError {
    #[error("credit balance is insufficient")]
    InsufficientCredits,
    #[error("verified compute grants require a verified agent")]
    AgentNotVerified,
    #[error("compute grant must be greater than zero")]
    EmptyGrant,
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::*;
    use crate::generate_passport;

    fn declared_passport() -> AgentPassport {
        generate_passport(
            &json!({
                "name": "Compute Demo",
                "version": "0.1.0",
                "author": "BenchArena",
                "source_type": "identity_json",
                "declared_capabilities": ["local benchmark"],
                "declared_tools": [],
                "declared_limits": ["no network"],
                "safety_declarations": ["No credential access"],
                "repository_url": null,
                "endpoint_url": null,
                "created_at": "2026-07-09T00:00:00Z"
            }),
            "2026-07-09T00:01:00Z",
        )
        .unwrap()
    }

    #[test]
    fn one_dollar_deposit_unlocks_the_covered_starter_benchmark() {
        let eligibility = can_run_starter_benchmark(
            CreditBalance {
                available_cents: 0,
                starter_deposit_cents: 100,
            },
            BenchmarkPrice { compute_cents: 25 },
            StarterCreditPolicy::default(),
            false,
        );

        assert_eq!(eligibility, ComputeEligibility::StarterCovered);
    }

    #[test]
    fn used_starter_benchmark_requires_available_credits() {
        let eligibility = can_run_starter_benchmark(
            CreditBalance {
                available_cents: 0,
                starter_deposit_cents: 100,
            },
            BenchmarkPrice { compute_cents: 25 },
            StarterCreditPolicy::default(),
            true,
        );

        assert_eq!(eligibility, ComputeEligibility::BlockedInsufficientCredits);
    }

    #[test]
    fn balance_cannot_go_negative() {
        let balance = CreditBalance {
            available_cents: 10,
            starter_deposit_cents: 0,
        };

        assert_eq!(
            balance.charge(11).unwrap_err(),
            ComputeError::InsufficientCredits
        );
    }

    #[test]
    fn unverified_agent_cannot_receive_verified_compute_grant() {
        let passport = declared_passport();

        assert_eq!(
            grant_verified_agent_compute(&passport, 100).unwrap_err(),
            ComputeError::AgentNotVerified
        );
    }

    #[test]
    fn mock_verified_agent_can_receive_local_compute_grant() {
        let mut passport = declared_passport();
        passport.verification_status = VerificationStatus::MockVerified;

        let grant = grant_verified_agent_compute(&passport, 100).unwrap();
        let eligibility = can_access_extra_compute(
            CreditBalance {
                available_cents: 0,
                starter_deposit_cents: 0,
            },
            BenchmarkPrice { compute_cents: 50 },
            Some(&grant),
        );

        assert_eq!(
            eligibility,
            ComputeEligibility::VerifiedGrant { granted_cents: 100 }
        );
    }
}
