"use client";

import { useState } from "react";

import {
  checkCreditEligibility,
  generatePassport
} from "@/lib/protocol/client";
import type {
  CreditEligibilityResponse,
  GeneratePassportResponse
} from "@/lib/protocol/server";

const sampleIdentity = JSON.stringify(
  {
    name: "Local Safety Agent",
    version: "0.1.0",
    author: "BenchArena Demo",
    source_type: "identity_json",
    declared_capabilities: ["summarize repository files", "prepare benchmark reports"],
    declared_tools: ["scoped filesystem reader"],
    declared_limits: ["no wallet access", "no raw memory upload", "no live endpoint execution"],
    safety_declarations: [
      "No hidden injection",
      "No raw memory upload",
      "No private keys"
    ],
    repository_url: null,
    endpoint_url: null,
    created_at: "2026-07-09T00:00:00Z"
  },
  null,
  2
);

export function PassportDemo() {
  const [sourceText, setSourceText] = useState(sampleIdentity);
  const [passportResult, setPassportResult] = useState<GeneratePassportResponse | null>(null);
  const [creditResult, setCreditResult] = useState<CreditEligibilityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);

    try {
      const [passport, credits] = await Promise.all([
        generatePassport({ sourceText }),
        checkCreditEligibility({
          available_cents: 0,
          starter_deposit_cents: 100,
          benchmark_cost_cents: 25,
          starter_benchmark_already_used: false
        })
      ]);

      setPassportResult(passport);
      setCreditResult(credits);
    } catch (caughtError) {
      setPassportResult(null);
      setCreditResult(null);
      setError(caughtError instanceof Error ? caughtError.message : "Protocol demo failed.");
    } finally {
      setIsLoading(false);
    }
  }

  const gateStatus = passportResult?.security_gate.status ?? "pending";
  const proofStatus = passportResult?.proof_receipt.status ?? "draft";
  const computeStatus = creditResult?.eligibility.status ?? "starter_covered";

  return (
    <section className="section" id="passport-demo" aria-labelledby="passport-demo-title">
      <div className="section-heading">
        <p className="kicker">Local protocol API</p>
        <h2 id="passport-demo-title">Generate a mock passport</h2>
        <p>
          Paste structured identity JSON or strict Markdown frontmatter. The app calls local API
          routes only: no wallet, no payment, no sandbox execution, no Solana transaction.
        </p>
      </div>

      <div className="demo-grid">
        <div className="demo-editor">
          <label htmlFor="identity-source">Identity source</label>
          <textarea
            id="identity-source"
            spellCheck={false}
            value={sourceText}
            onChange={(event) => setSourceText(event.target.value)}
          />
          <button className="primary-action" disabled={isLoading} onClick={handleGenerate}>
            {isLoading ? "Generating..." : "Generate passport"}
          </button>
          {error ? <p className="demo-error">{error}</p> : null}
        </div>

        <div className="demo-output" aria-live="polite">
          <div>
            <p className="kicker">Security gate</p>
            <strong>{gateStatus}</strong>
            <span>{passportResult?.security_gate.note ?? "Waiting for identity source."}</span>
          </div>
          <div>
            <p className="kicker">Proof receipt</p>
            <strong>{proofStatus}</strong>
            <span>
              {passportResult
                ? `${passportResult.proof_receipt.network} / ${passportResult.proof_receipt.receipt_id}`
                : "Offchain draft receipt will appear here."}
            </span>
          </div>
          <div>
            <p className="kicker">Compute eligibility</p>
            <strong>{computeStatus}</strong>
            <span>
              {creditResult?.eligibility.note ??
                "$1 starter policy covers first mock benchmark only."}
            </span>
          </div>
          <div>
            <p className="kicker">Passport hash</p>
            <code>
              {passportResult?.passport.identity_hash ??
                "sha256 hash appears after successful generation"}
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}
