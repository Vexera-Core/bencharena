use serde::Serialize;
use serde_json::Value;
use sha2::{Digest, Sha256};
use thiserror::Error;

use crate::{
    AgentIdentity, AgentPassport, ProofNetwork, ProofReceipt, ProofStatus, SecurityGateFinding,
    SecurityGateStatus, VerificationStatus, run_security_gate,
};

const IDENTITY_HASH_DOMAIN: &[u8] = b"bencharena:agent-identity:v1";
const PASSPORT_HASH_DOMAIN: &[u8] = b"bencharena:agent-passport:v1";

pub fn normalize_identity(mut identity: AgentIdentity) -> AgentIdentity {
    identity.name = identity.name.trim().to_owned();
    identity.version = identity.version.trim().to_owned();
    identity.author = identity.author.trim().to_owned();
    identity.created_at = identity.created_at.trim().to_owned();
    identity.repository_url = normalize_optional(identity.repository_url);
    identity.endpoint_url = normalize_optional(identity.endpoint_url);
    normalize_list(&mut identity.declared_capabilities);
    normalize_list(&mut identity.declared_tools);
    normalize_list(&mut identity.declared_limits);
    normalize_list(&mut identity.safety_declarations);
    identity
}

pub fn stable_identity_hash(identity: &AgentIdentity) -> Result<String, PassportError> {
    hash_serializable(IDENTITY_HASH_DOMAIN, &normalize_identity(identity.clone()))
}

pub fn generate_passport(
    document: &Value,
    generated_at: impl Into<String>,
) -> Result<AgentPassport, PassportError> {
    let gate = run_security_gate(document);
    if gate.status != SecurityGateStatus::Passed {
        return Err(PassportError::SecurityBlocked(gate.findings));
    }

    let normalized_identity = normalize_identity(
        gate.identity
            .ok_or(PassportError::MissingNormalizedIdentity)?,
    );
    let identity_hash = stable_identity_hash(&normalized_identity)?;

    Ok(AgentPassport {
        passport_id: format!("passport_{}", &identity_hash[..24]),
        identity_hash,
        normalized_identity,
        security_gate_status: SecurityGateStatus::Passed,
        verification_status: VerificationStatus::Declared,
        generated_at: generated_at.into(),
        schema_version: "1.0.0".to_owned(),
    })
}

pub fn passport_hash(passport: &AgentPassport) -> Result<String, PassportError> {
    hash_serializable(PASSPORT_HASH_DOMAIN, passport)
}

pub fn create_offchain_proof_receipt(
    passport: &AgentPassport,
    created_at: impl Into<String>,
) -> Result<ProofReceipt, PassportError> {
    let passport_hash = passport_hash(passport)?;

    Ok(ProofReceipt {
        receipt_id: format!("receipt_{}", &passport_hash[..24]),
        identity_hash: passport.identity_hash.clone(),
        passport_hash,
        network: ProofNetwork::Offchain,
        status: ProofStatus::Ready,
        created_at: created_at.into(),
    })
}

fn normalize_optional(value: Option<String>) -> Option<String> {
    value
        .map(|item| item.trim().to_owned())
        .filter(|item| !item.is_empty())
}

fn normalize_list(items: &mut Vec<String>) {
    for item in items.iter_mut() {
        *item = item.trim().to_owned();
    }
    items.retain(|item| !item.is_empty());
    items.sort();
    items.dedup();
}

fn hash_serializable(domain: &[u8], value: &impl Serialize) -> Result<String, PassportError> {
    let encoded = serde_json::to_vec(value)?;
    let mut hasher = Sha256::new();
    hasher.update(domain);
    hasher.update([0]);
    hasher.update(encoded);
    Ok(hex::encode(hasher.finalize()))
}

#[derive(Debug, Error)]
pub enum PassportError {
    #[error("security gate blocked identity")]
    SecurityBlocked(Vec<SecurityGateFinding>),
    #[error("security gate passed without a normalized identity")]
    MissingNormalizedIdentity,
    #[error("protocol serialization failed")]
    Serialization(#[from] serde_json::Error),
}

#[cfg(test)]
mod tests {
    use serde_json::{Value, json};

    use super::*;

    fn valid_document() -> Value {
        json!({
            "name": "  Local Review Agent  ",
            "version": "0.1.0",
            "author": "BenchArena Demo",
            "source_type": "identity_json",
            "declared_capabilities": ["review source code", "review source code"],
            "declared_tools": ["read-only filesystem"],
            "declared_limits": ["no network access"],
            "safety_declarations": ["No credential access"],
            "repository_url": null,
            "endpoint_url": null,
            "created_at": "2026-07-09T00:00:00Z"
        })
    }

    #[test]
    fn same_normalized_identity_creates_a_stable_hash() {
        let first = generate_passport(&valid_document(), "2026-07-09T00:10:00Z").unwrap();
        let mut reordered = valid_document();
        reordered["declared_capabilities"] = json!(["review source code", "review source code"]);
        let second = generate_passport(&reordered, "2026-07-09T00:20:00Z").unwrap();

        assert_eq!(first.identity_hash, second.identity_hash);
    }

    #[test]
    fn missing_name_fails_generation() {
        let mut document = valid_document();
        document["name"] = json!("");

        assert!(matches!(
            generate_passport(&document, "2026-07-09T00:10:00Z"),
            Err(PassportError::SecurityBlocked(_))
        ));
    }

    #[test]
    fn private_key_field_fails_generation() {
        let mut document = valid_document();
        document["private_key"] = json!("never accepted");

        assert!(matches!(
            generate_passport(&document, "2026-07-09T00:10:00Z"),
            Err(PassportError::SecurityBlocked(_))
        ));
    }

    #[test]
    fn valid_identity_creates_a_declared_passport() {
        let passport = generate_passport(&valid_document(), "2026-07-09T00:10:00Z").unwrap();

        assert!(passport.passport_id.starts_with("passport_"));
        assert_eq!(passport.normalized_identity.name, "Local Review Agent");
        assert_eq!(passport.security_gate_status, SecurityGateStatus::Passed);
        assert_eq!(passport.verification_status, VerificationStatus::Declared);
    }

    #[test]
    fn proof_receipt_is_offchain_by_default() {
        let passport = generate_passport(&valid_document(), "2026-07-09T00:10:00Z").unwrap();
        let receipt = create_offchain_proof_receipt(&passport, "2026-07-09T00:11:00Z").unwrap();

        assert_eq!(receipt.network, ProofNetwork::Offchain);
        assert_eq!(receipt.status, ProofStatus::Ready);
    }
}
