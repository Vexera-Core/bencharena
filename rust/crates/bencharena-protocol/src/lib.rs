mod security;
mod types;

pub use security::{
    SecurityGateFinding, SecurityGateResult, reject_private_key_language, reject_raw_memory_upload,
    reject_secret_fields, run_security_gate, validate_identity,
};
pub use types::{
    AgentIdentity, AgentPassport, ProofNetwork, ProofReceipt, ProofStatus, SecurityGateStatus,
    SourceType, VerificationStatus,
};

use ed25519_dalek::{Signature, Verifier, VerifyingKey};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use thiserror::Error;

const RECEIPT_DOMAIN: &[u8] = b"bencharena:verification-receipt:v1";
const WALLET_CHALLENGE_DOMAIN: &str = "bencharena:wallet-challenge:v1";

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ReceiptInput {
    pub passport_hash: [u8; 32],
    pub trial_definition_hash: [u8; 32],
    pub result_hash: [u8; 32],
    pub agent_wallet: Option<String>,
    pub created_at_unix: u64,
    pub nonce: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct VerificationReceipt {
    pub version: u8,
    pub receipt_hash: [u8; 32],
    pub input: ReceiptInput,
}

impl VerificationReceipt {
    pub fn create(input: ReceiptInput) -> Result<Self, ProtocolError> {
        let encoded = serde_json::to_vec(&input)?;
        let mut hasher = Sha256::new();
        hasher.update(RECEIPT_DOMAIN);
        hasher.update([0]);
        hasher.update(encoded);

        Ok(Self {
            version: 1,
            receipt_hash: hasher.finalize().into(),
            input,
        })
    }

    pub fn receipt_hash_hex(&self) -> String {
        hex::encode(self.receipt_hash)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct WalletChallenge {
    pub domain: String,
    pub wallet_address: String,
    pub passport_id: String,
    pub action: String,
    pub resource: String,
    pub statement: String,
    pub issued_at_unix: u64,
    pub expires_at_unix: u64,
    pub nonce: String,
}

impl WalletChallenge {
    pub fn new(
        wallet_address: String,
        passport_id: String,
        action: String,
        resource: String,
        issued_at_unix: u64,
        expires_at_unix: u64,
        nonce: String,
    ) -> Result<Self, ProtocolError> {
        if expires_at_unix <= issued_at_unix {
            return Err(ProtocolError::InvalidChallengeWindow);
        }

        Ok(Self {
            domain: WALLET_CHALLENGE_DOMAIN.to_owned(),
            wallet_address,
            passport_id,
            action,
            resource,
            statement:
                "Authorize this BenchArena action. This request never asks for a private key."
                    .to_owned(),
            issued_at_unix,
            expires_at_unix,
            nonce,
        })
    }

    pub fn signing_bytes(&self) -> Result<Vec<u8>, ProtocolError> {
        Ok(serde_json::to_vec(self)?)
    }

    pub fn is_active_at(&self, unix_time: u64) -> bool {
        self.issued_at_unix <= unix_time && unix_time < self.expires_at_unix
    }
}

pub fn verify_wallet_signature(
    challenge: &WalletChallenge,
    signature_base58: &str,
    unix_time: u64,
) -> Result<(), ProtocolError> {
    if challenge.domain != WALLET_CHALLENGE_DOMAIN {
        return Err(ProtocolError::InvalidChallengeDomain);
    }
    if !challenge.is_active_at(unix_time) {
        return Err(ProtocolError::ExpiredChallenge);
    }

    let public_key_bytes = decode_fixed::<32>(&challenge.wallet_address)?;
    let signature_bytes = decode_fixed::<64>(signature_base58)?;
    let public_key = VerifyingKey::from_bytes(&public_key_bytes)?;
    let signature = Signature::from_bytes(&signature_bytes);

    public_key.verify(&challenge.signing_bytes()?, &signature)?;
    Ok(())
}

fn decode_fixed<const N: usize>(value: &str) -> Result<[u8; N], ProtocolError> {
    let decoded = bs58::decode(value).into_vec()?;
    decoded
        .try_into()
        .map_err(|_| ProtocolError::InvalidEncodedLength { expected: N })
}

#[derive(Debug, Error)]
pub enum ProtocolError {
    #[error("challenge expiration must be later than its issue time")]
    InvalidChallengeWindow,
    #[error("challenge domain is not recognized")]
    InvalidChallengeDomain,
    #[error("challenge is not active")]
    ExpiredChallenge,
    #[error("decoded value must be exactly {expected} bytes")]
    InvalidEncodedLength { expected: usize },
    #[error("base58 value is invalid")]
    InvalidBase58(#[from] bs58::decode::Error),
    #[error("public key is invalid")]
    InvalidPublicKey(#[from] ed25519_dalek::SignatureError),
    #[error("canonical JSON serialization failed")]
    Serialization(#[from] serde_json::Error),
}

#[cfg(test)]
mod tests {
    use super::*;
    use ed25519_dalek::{Signer, SigningKey};

    fn receipt_input() -> ReceiptInput {
        ReceiptInput {
            passport_hash: [1; 32],
            trial_definition_hash: [2; 32],
            result_hash: [3; 32],
            agent_wallet: None,
            created_at_unix: 1_750_000_000,
            nonce: "receipt-001".to_owned(),
        }
    }

    #[test]
    fn receipt_hash_is_deterministic_and_domain_separated() {
        let first = VerificationReceipt::create(receipt_input()).unwrap();
        let second = VerificationReceipt::create(receipt_input()).unwrap();

        assert_eq!(first.receipt_hash, second.receipt_hash);
        assert_eq!(first.receipt_hash_hex().len(), 64);
    }

    #[test]
    fn verifies_a_public_wallet_signature_without_private_key_custody() {
        let signing_key = SigningKey::from_bytes(&[7; 32]);
        let wallet_address = bs58::encode(signing_key.verifying_key().to_bytes()).into_string();
        let challenge = WalletChallenge::new(
            wallet_address,
            "passport-demo".to_owned(),
            "submit-trial".to_owned(),
            "/trials/security-review".to_owned(),
            100,
            200,
            "challenge-001".to_owned(),
        )
        .unwrap();
        let signature = signing_key.sign(&challenge.signing_bytes().unwrap());

        verify_wallet_signature(
            &challenge,
            &bs58::encode(signature.to_bytes()).into_string(),
            150,
        )
        .unwrap();
    }

    #[test]
    fn rejects_expired_wallet_challenges() {
        let challenge = WalletChallenge::new(
            bs58::encode([1; 32]).into_string(),
            "passport-demo".to_owned(),
            "submit-trial".to_owned(),
            "/trials/security-review".to_owned(),
            100,
            200,
            "challenge-001".to_owned(),
        )
        .unwrap();

        let error = verify_wallet_signature(&challenge, &bs58::encode([0; 64]).into_string(), 200)
            .unwrap_err();
        assert!(matches!(error, ProtocolError::ExpiredChallenge));
    }
}
