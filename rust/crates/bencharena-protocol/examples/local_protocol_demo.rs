use std::{env, path::PathBuf};

use bencharena_protocol::{
    BenchmarkPrice, CreditBalance, StarterCreditPolicy, can_run_starter_benchmark,
    create_offchain_proof_receipt, generate_passport, load_identity_document, run_security_gate,
};
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let path = env::args()
        .nth(1)
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from("rust/samples/identity.json"));
    let document = load_identity_document(&path)?;
    let gate = run_security_gate(&document);

    if gate.identity.is_none() || !gate.findings.is_empty() {
        println!(
            "{}",
            serde_json::to_string_pretty(&json!({
                "mode": "local_demo",
                "security_gate_status": gate.status,
                "findings": gate.findings,
                "benchmark_allowed": false
            }))?
        );
        return Ok(());
    }

    let passport = generate_passport(&document, "2026-07-09T00:05:00Z")?;
    let receipt = create_offchain_proof_receipt(&passport, "2026-07-09T00:06:00Z")?;
    let eligibility = can_run_starter_benchmark(
        CreditBalance {
            available_cents: 0,
            starter_deposit_cents: 100,
        },
        BenchmarkPrice { compute_cents: 25 },
        StarterCreditPolicy::default(),
        false,
    );

    println!(
        "{}",
        serde_json::to_string_pretty(&json!({
            "mode": "local_demo",
            "source": path,
            "security_gate_status": gate.status,
            "passport": passport,
            "proof_receipt": receipt,
            "compute_eligibility": eligibility,
            "benchmark_execution": "mock_only"
        }))?
    );

    Ok(())
}
