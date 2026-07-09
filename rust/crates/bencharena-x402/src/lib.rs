use serde::{Deserialize, Serialize};
use thiserror::Error;

#[cfg(unix)]
pub use x402_rs::proto as x402_protocol;

pub const PAYMENT_REQUIRED_STATUS: u16 = 402;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PaymentRequirement {
    pub requirement_id: String,
    pub network: String,
    pub asset: String,
    pub amount_atomic: u64,
    pub pay_to: String,
    pub resource: String,
    pub description: String,
    pub expires_at_unix: u64,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct VerifiedPayment {
    pub requirement_id: String,
    pub network: String,
    pub asset: String,
    pub amount_atomic: u64,
    pub pay_to: String,
    pub resource: String,
    pub payer: String,
    pub transaction_reference: String,
    pub verified_at_unix: u64,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum GateDecision {
    Authorized(VerifiedPayment),
    PaymentRequired(PaymentRequirement),
}

#[derive(Debug, Clone)]
pub struct PaymentGate {
    requirement: PaymentRequirement,
}

impl PaymentGate {
    pub fn new(requirement: PaymentRequirement) -> Result<Self, PaymentGateError> {
        if requirement.amount_atomic == 0 {
            return Err(PaymentGateError::ZeroAmount);
        }
        if requirement.pay_to.trim().is_empty() {
            return Err(PaymentGateError::MissingRecipient);
        }
        if requirement.requirement_id.trim().is_empty() {
            return Err(PaymentGateError::MissingRequirementId);
        }
        Ok(Self { requirement })
    }

    pub fn authorize(
        &self,
        verified_payment: Option<VerifiedPayment>,
        unix_time: u64,
    ) -> Result<GateDecision, PaymentGateError> {
        let Some(payment) = verified_payment else {
            return Ok(GateDecision::PaymentRequired(self.requirement.clone()));
        };

        if unix_time >= self.requirement.expires_at_unix {
            return Err(PaymentGateError::ExpiredRequirement);
        }
        if payment.verified_at_unix > unix_time
            || payment.requirement_id != self.requirement.requirement_id
            || payment.network != self.requirement.network
            || payment.asset != self.requirement.asset
            || payment.amount_atomic < self.requirement.amount_atomic
            || payment.pay_to != self.requirement.pay_to
            || payment.resource != self.requirement.resource
            || payment.transaction_reference.trim().is_empty()
        {
            return Err(PaymentGateError::PaymentMismatch);
        }

        Ok(GateDecision::Authorized(payment))
    }
}

#[derive(Debug, Error, PartialEq, Eq)]
pub enum PaymentGateError {
    #[error("payment amount must be greater than zero")]
    ZeroAmount,
    #[error("payment recipient is required")]
    MissingRecipient,
    #[error("payment requirement identifier is required")]
    MissingRequirementId,
    #[error("payment requirement has expired")]
    ExpiredRequirement,
    #[error("verified payment does not satisfy the requirement")]
    PaymentMismatch,
}

#[cfg(test)]
mod tests {
    use super::*;

    fn requirement() -> PaymentRequirement {
        PaymentRequirement {
            requirement_id: "payment-requirement-001".to_owned(),
            network: "solana:devnet".to_owned(),
            asset: "USDC".to_owned(),
            amount_atomic: 10_000,
            pay_to: "demo-public-wallet".to_owned(),
            resource: "/v1/trials/security-review".to_owned(),
            description: "BenchArena verification compute".to_owned(),
            expires_at_unix: 200,
        }
    }

    #[test]
    fn returns_payment_required_when_proof_is_absent() {
        let gate = PaymentGate::new(requirement()).unwrap();
        let decision = gate.authorize(None, 100).unwrap();

        assert!(matches!(decision, GateDecision::PaymentRequired(_)));
        assert_eq!(PAYMENT_REQUIRED_STATUS, 402);
    }

    #[test]
    fn accepts_matching_facilitator_verified_payment() {
        let gate = PaymentGate::new(requirement()).unwrap();
        let payment = VerifiedPayment {
            requirement_id: "payment-requirement-001".to_owned(),
            network: "solana:devnet".to_owned(),
            asset: "USDC".to_owned(),
            amount_atomic: 10_000,
            pay_to: "demo-public-wallet".to_owned(),
            resource: "/v1/trials/security-review".to_owned(),
            payer: "demo-payer".to_owned(),
            transaction_reference: "demo-signature".to_owned(),
            verified_at_unix: 100,
        };

        let decision = gate.authorize(Some(payment), 100).unwrap();
        assert!(matches!(decision, GateDecision::Authorized(_)));
    }

    #[test]
    fn rejects_payment_proof_for_another_resource() {
        let gate = PaymentGate::new(requirement()).unwrap();
        let payment = VerifiedPayment {
            requirement_id: "payment-requirement-001".to_owned(),
            network: "solana:devnet".to_owned(),
            asset: "USDC".to_owned(),
            amount_atomic: 10_000,
            pay_to: "demo-public-wallet".to_owned(),
            resource: "/v1/trials/another-trial".to_owned(),
            payer: "demo-payer".to_owned(),
            transaction_reference: "demo-signature".to_owned(),
            verified_at_unix: 100,
        };

        assert_eq!(
            gate.authorize(Some(payment), 100).unwrap_err(),
            PaymentGateError::PaymentMismatch
        );
    }
}
