use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SourceType {
    IdentityJson,
    IdentityMarkdown,
    Repository,
    EndpointPlanned,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct AgentIdentity {
    pub name: String,
    pub version: String,
    pub author: String,
    pub source_type: SourceType,
    pub declared_capabilities: Vec<String>,
    pub declared_tools: Vec<String>,
    pub declared_limits: Vec<String>,
    pub safety_declarations: Vec<String>,
    pub repository_url: Option<String>,
    pub endpoint_url: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SecurityGateStatus {
    Pending,
    Passed,
    Blocked,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum VerificationStatus {
    Declared,
    MockVerified,
    Verified,
    Failed,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct AgentPassport {
    pub passport_id: String,
    pub identity_hash: String,
    pub normalized_identity: AgentIdentity,
    pub security_gate_status: SecurityGateStatus,
    pub verification_status: VerificationStatus,
    pub generated_at: String,
    pub schema_version: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ProofNetwork {
    Offchain,
    SolanaDevnetPlanned,
    SolanaMainnetFuture,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ProofStatus {
    Draft,
    Ready,
    Anchored,
    Failed,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ProofReceipt {
    pub receipt_id: String,
    pub identity_hash: String,
    pub passport_hash: String,
    pub network: ProofNetwork,
    pub status: ProofStatus,
    pub created_at: String,
}
