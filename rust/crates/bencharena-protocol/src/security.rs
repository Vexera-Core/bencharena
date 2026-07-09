use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::{AgentIdentity, SecurityGateStatus};

const SECRET_FIELD_MARKERS: &[&str] = &[
    "api_key",
    "mnemonic",
    "private_key",
    "secret_key",
    "seed_phrase",
    "wallet_file",
];
const PRIVATE_KEY_LANGUAGE: &[&str] = &[
    "begin private key",
    "mnemonic:",
    "private_key",
    "provide private key",
    "seed phrase:",
    "secret_key",
    "upload private key",
];
const RAW_MEMORY_LANGUAGE: &[&str] = &[
    "memory_dump",
    "raw_memory",
    "upload memory dump",
    "upload raw memory",
];

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct SecurityGateFinding {
    pub code: String,
    pub message: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct SecurityGateResult {
    pub status: SecurityGateStatus,
    pub findings: Vec<SecurityGateFinding>,
    pub identity: Option<AgentIdentity>,
}

pub fn validate_identity(identity: &AgentIdentity) -> Result<(), SecurityGateFinding> {
    let required = [
        ("name", identity.name.as_str()),
        ("version", identity.version.as_str()),
        ("author", identity.author.as_str()),
        ("created_at", identity.created_at.as_str()),
    ];

    if let Some((field, _)) = required.iter().find(|(_, value)| value.trim().is_empty()) {
        return Err(finding(
            "identity.required_field",
            format!("{field} must not be empty"),
        ));
    }

    Ok(())
}

pub fn reject_secret_fields(document: &Value) -> Result<(), SecurityGateFinding> {
    let mut path = Vec::new();
    inspect_secret_fields(document, &mut path)
}

pub fn reject_private_key_language(identity: &AgentIdentity) -> Result<(), SecurityGateFinding> {
    reject_language(
        identity,
        PRIVATE_KEY_LANGUAGE,
        "identity.private_key_language",
        "private keys, seed phrases, and wallet files are never accepted",
    )
}

pub fn reject_raw_memory_upload(identity: &AgentIdentity) -> Result<(), SecurityGateFinding> {
    reject_language(
        identity,
        RAW_MEMORY_LANGUAGE,
        "identity.raw_memory_upload",
        "raw memory and memory dumps are never accepted",
    )
}

pub fn run_security_gate(document: &Value) -> SecurityGateResult {
    let mut findings = Vec::new();

    if let Err(error) = reject_secret_fields(document) {
        findings.push(error);
    }

    let identity = match serde_json::from_value::<AgentIdentity>(document.clone()) {
        Ok(identity) => Some(identity),
        Err(error) => {
            findings.push(finding(
                "identity.invalid_document",
                format!("identity document does not match the schema: {error}"),
            ));
            None
        }
    };

    if let Some(identity) = identity.as_ref() {
        for result in [
            validate_identity(identity),
            reject_private_key_language(identity),
            reject_raw_memory_upload(identity),
        ] {
            if let Err(error) = result {
                findings.push(error);
            }
        }
    }

    SecurityGateResult {
        status: if findings.is_empty() {
            SecurityGateStatus::Passed
        } else {
            SecurityGateStatus::Blocked
        },
        findings,
        identity,
    }
}

fn inspect_secret_fields(value: &Value, path: &mut Vec<String>) -> Result<(), SecurityGateFinding> {
    match value {
        Value::Object(object) => {
            for (key, child) in object {
                path.push(key.clone());
                let normalized_key = key.trim().to_ascii_lowercase().replace(['-', ' '], "_");
                if SECRET_FIELD_MARKERS
                    .iter()
                    .any(|marker| normalized_key.contains(marker))
                {
                    return Err(finding(
                        "identity.secret_field",
                        format!("secret-like field is not accepted: {}", path.join(".")),
                    ));
                }
                inspect_secret_fields(child, path)?;
                path.pop();
            }
        }
        Value::Array(items) => {
            for child in items {
                inspect_secret_fields(child, path)?;
            }
        }
        _ => {}
    }
    Ok(())
}

fn reject_language(
    identity: &AgentIdentity,
    markers: &[&str],
    code: &str,
    message: &str,
) -> Result<(), SecurityGateFinding> {
    let text = identity_text(identity).to_ascii_lowercase();
    if markers.iter().any(|marker| text.contains(marker)) {
        return Err(finding(code, message));
    }
    Ok(())
}

fn identity_text(identity: &AgentIdentity) -> String {
    [
        identity.declared_capabilities.as_slice(),
        identity.declared_tools.as_slice(),
        identity.declared_limits.as_slice(),
        identity.safety_declarations.as_slice(),
    ]
    .concat()
    .join("\n")
}

fn finding(code: impl Into<String>, message: impl Into<String>) -> SecurityGateFinding {
    SecurityGateFinding {
        code: code.into(),
        message: message.into(),
    }
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::*;

    fn valid_document() -> Value {
        json!({
            "name": "Local Review Agent",
            "version": "0.1.0",
            "author": "BenchArena Demo",
            "source_type": "identity_json",
            "declared_capabilities": ["review source code"],
            "declared_tools": ["read-only filesystem"],
            "declared_limits": ["no network access"],
            "safety_declarations": ["No credential access"],
            "repository_url": null,
            "endpoint_url": null,
            "created_at": "2026-07-09T00:00:00Z"
        })
    }

    #[test]
    fn passes_a_valid_declaration_without_treating_it_as_proof() {
        let result = run_security_gate(&valid_document());

        assert_eq!(result.status, SecurityGateStatus::Passed);
        assert!(result.findings.is_empty());
        assert!(result.identity.is_some());
    }

    #[test]
    fn rejects_secret_fields_before_deserialization() {
        let mut document = valid_document();
        document["private_key"] = json!("do-not-accept");

        let result = run_security_gate(&document);

        assert_eq!(result.status, SecurityGateStatus::Blocked);
        assert!(
            result
                .findings
                .iter()
                .any(|finding| finding.code == "identity.secret_field")
        );
    }

    #[test]
    fn rejects_private_key_requests_in_declarations() {
        let mut document = valid_document();
        document["declared_tools"] = json!(["upload private key"]);

        assert_eq!(
            run_security_gate(&document).status,
            SecurityGateStatus::Blocked
        );
    }

    #[test]
    fn rejects_raw_memory_upload_requests() {
        let mut document = valid_document();
        document["declared_capabilities"] = json!(["upload raw memory"]);

        assert_eq!(
            run_security_gate(&document).status,
            SecurityGateStatus::Blocked
        );
    }

    #[test]
    fn rejects_missing_required_identity_fields() {
        let mut document = valid_document();
        document["name"] = json!(" ");

        assert_eq!(
            run_security_gate(&document).status,
            SecurityGateStatus::Blocked
        );
    }
}
