import { createHash } from "node:crypto";

export type IdentitySourceFormat = "identity-json" | "identity-md";

export type AgentIdentity = {
  name: string;
  version: string;
  author: string;
  source_type: "identity_json" | "identity_markdown" | "repository" | "endpoint_planned";
  declared_capabilities: string[];
  declared_tools: string[];
  declared_limits: string[];
  safety_declarations: string[];
  repository_url: string | null;
  endpoint_url: string | null;
  created_at: string;
};

export type SecurityGateFinding = {
  code: string;
  severity: "warning" | "critical";
  message: string;
};

export type SecurityGateResult = {
  status: "pending" | "passed" | "blocked";
  findings: SecurityGateFinding[];
  note: string;
};

export type AgentPassport = {
  passport_id: string;
  identity_hash: string;
  normalized_identity: AgentIdentity;
  security_gate_status: SecurityGateResult["status"];
  verification_status: "declared" | "mock_verified" | "verified" | "failed";
  generated_at: string;
  schema_version: "2026-07-09";
};

export type ProofReceipt = {
  receipt_id: string;
  identity_hash: string;
  passport_hash: string;
  network: "offchain" | "solana_devnet_planned" | "solana_mainnet_future";
  status: "draft" | "ready" | "anchored" | "failed";
  created_at: string;
};

export type ComputeEligibility = {
  status: "starter_covered" | "credit_covered" | "verified_grant" | "blocked_insufficient_credits";
  cost_cents: number;
  starter_deposit_cents: number;
  available_cents: number;
  note: string;
};

export type ParseIdentityResponse = {
  identity: AgentIdentity;
  security_gate: SecurityGateResult;
  mock: true;
};

export type GeneratePassportResponse = ParseIdentityResponse & {
  passport: AgentPassport;
  proof_receipt: ProofReceipt;
};

export type CreditEligibilityResponse = {
  eligibility: ComputeEligibility;
  mock: true;
};

type RawIdentityRequest = {
  sourceText?: unknown;
  sourceFormat?: unknown;
};

type RawEligibilityRequest = {
  available_cents?: unknown;
  starter_deposit_cents?: unknown;
  benchmark_cost_cents?: unknown;
  starter_benchmark_already_used?: unknown;
};

const secretFieldPattern = /(secret|private.?key|seed.?phrase|mnemonic|keypair|wallet.?file)/i;
const privateKeyLanguagePattern = /(private key|seed phrase|mnemonic|keypair\.json|wallet file)/i;
const rawMemoryPattern = /(raw memory|memory dump|upload .*memory|vector store dump)/i;

export function parseIdentityPayload(payload: unknown): ParseIdentityResponse {
  const request = payload as RawIdentityRequest;
  const sourceText = requireString(request.sourceText, "sourceText");
  const sourceFormat = normalizeSourceFormat(request.sourceFormat, sourceText);
  const rawIdentity = parseIdentitySource(sourceText, sourceFormat);
  const identity = normalizeIdentity(rawIdentity, sourceFormat);
  const securityGate = runSecurityGate(rawIdentity, sourceText, identity);

  return {
    identity,
    security_gate: securityGate,
    mock: true
  };
}

export function generatePassportPayload(payload: unknown, now = new Date()): GeneratePassportResponse {
  const parsed = parseIdentityPayload(payload);

  if (parsed.security_gate.status === "blocked") {
    throw new ProtocolRequestError(
      "Security gate blocked passport generation.",
      422,
      parsed.security_gate.findings
    );
  }

  const generatedAt = now.toISOString();
  const identityHash = stableHash(parsed.identity);
  const passport: AgentPassport = {
    passport_id: `passport_${identityHash.slice(0, 16)}`,
    identity_hash: identityHash,
    normalized_identity: parsed.identity,
    security_gate_status: parsed.security_gate.status,
    verification_status: "declared",
    generated_at: generatedAt,
    schema_version: "2026-07-09"
  };
  const passportHash = stableHash(passport);

  return {
    ...parsed,
    passport,
    proof_receipt: {
      receipt_id: `receipt_${passportHash.slice(0, 16)}`,
      identity_hash: identityHash,
      passport_hash: passportHash,
      network: "offchain",
      status: "draft",
      created_at: generatedAt
    }
  };
}

export function creditEligibilityPayload(payload: unknown): CreditEligibilityResponse {
  const request = payload as RawEligibilityRequest;
  const availableCents = numberOrDefault(request.available_cents, 0);
  const starterDepositCents = numberOrDefault(request.starter_deposit_cents, 100);
  const benchmarkCostCents = numberOrDefault(request.benchmark_cost_cents, 25);
  const starterUsed = Boolean(request.starter_benchmark_already_used);

  if (!starterUsed && starterDepositCents >= 100) {
    return {
      eligibility: {
        status: "starter_covered",
        cost_cents: benchmarkCostCents,
        starter_deposit_cents: starterDepositCents,
        available_cents: availableCents,
        note: "$1 starter deposit covers the first mock benchmark. No real payment is charged."
      },
      mock: true
    };
  }

  if (availableCents >= benchmarkCostCents) {
    return {
      eligibility: {
        status: "credit_covered",
        cost_cents: benchmarkCostCents,
        starter_deposit_cents: starterDepositCents,
        available_cents: availableCents,
        note: "Mock local credits cover this benchmark request."
      },
      mock: true
    };
  }

  return {
    eligibility: {
      status: "blocked_insufficient_credits",
      cost_cents: benchmarkCostCents,
      starter_deposit_cents: starterDepositCents,
      available_cents: availableCents,
      note: "Extra compute stays blocked without mock credits or a future verified-agent grant."
    },
    mock: true
  };
}

export function jsonError(error: unknown) {
  if (error instanceof ProtocolRequestError) {
    return Response.json(
      { error: error.message, findings: error.findings, mock: true },
      { status: error.status }
    );
  }

  return Response.json(
    {
      error: error instanceof Error ? error.message : "Unknown protocol error.",
      mock: true
    },
    { status: 400 }
  );
}

function parseIdentitySource(sourceText: string, sourceFormat: IdentitySourceFormat): unknown {
  const jsonText = sourceFormat === "identity-md" ? extractJsonFrontmatter(sourceText) : sourceText;

  try {
    return JSON.parse(jsonText);
  } catch {
    throw new ProtocolRequestError("Identity source must contain valid JSON.", 400);
  }
}

function extractJsonFrontmatter(sourceText: string): string {
  const match = /^---\s*\r?\n([\s\S]*?)\r?\n---/.exec(sourceText.trim());

  if (!match?.[1]) {
    throw new ProtocolRequestError(
      "identity.md must use strict JSON frontmatter between --- markers.",
      400
    );
  }

  return match[1];
}

function normalizeIdentity(rawIdentity: unknown, sourceFormat: IdentitySourceFormat): AgentIdentity {
  if (!isRecord(rawIdentity)) {
    throw new ProtocolRequestError("Identity must be a JSON object.", 400);
  }

  const name = requireString(rawIdentity.name, "name").trim();
  const version = requireString(rawIdentity.version, "version").trim();
  const author = requireString(rawIdentity.author, "author").trim();

  return {
    name,
    version,
    author,
    source_type:
      sourceFormat === "identity-md"
        ? "identity_markdown"
        : normalizeSourceType(rawIdentity.source_type),
    declared_capabilities: normalizeStringList(rawIdentity.declared_capabilities),
    declared_tools: normalizeStringList(rawIdentity.declared_tools),
    declared_limits: normalizeStringList(rawIdentity.declared_limits),
    safety_declarations: normalizeStringList(rawIdentity.safety_declarations),
    repository_url: nullableString(rawIdentity.repository_url),
    endpoint_url: nullableString(rawIdentity.endpoint_url),
    created_at: requireString(rawIdentity.created_at, "created_at")
  };
}

function runSecurityGate(
  rawIdentity: unknown,
  sourceText: string,
  identity: AgentIdentity
): SecurityGateResult {
  const findings: SecurityGateFinding[] = [];
  const rawJson = JSON.stringify(rawIdentity);

  if (secretFieldPattern.test(rawJson)) {
    findings.push({
      code: "secret-field",
      severity: "critical",
      message: "Private keys, seed phrases, wallet files, and secret fields are never accepted."
    });
  }

  if (privateKeyLanguagePattern.test(sourceText)) {
    findings.push({
      code: "private-key-language",
      severity: "critical",
      message: "Private key or seed phrase language blocks passport generation."
    });
  }

  if (rawMemoryPattern.test(sourceText)) {
    findings.push({
      code: "raw-memory-upload",
      severity: "critical",
      message: "Raw memory upload is blocked by default."
    });
  }

  if (identity.endpoint_url) {
    findings.push({
      code: "endpoint-planned",
      severity: "warning",
      message: "Live endpoint execution is planned only and remains disabled."
    });
  }

  const blocked = findings.some((finding) => finding.severity === "critical");

  return {
    status: blocked ? "blocked" : "passed",
    findings,
    note: blocked
      ? "Declarations are not proof. Security remediation required before passport generation."
      : "Static gate passed. This is mock/offchain and not trusted verification."
  };
}

function stableHash(value: unknown): string {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(",")}]`;
  }

  if (isRecord(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function normalizeSourceFormat(value: unknown, sourceText: string): IdentitySourceFormat {
  if (value === "identity-json" || value === "identity-md") {
    return value;
  }

  return sourceText.trim().startsWith("---") ? "identity-md" : "identity-json";
}

function normalizeSourceType(value: unknown): AgentIdentity["source_type"] {
  if (
    value === "identity_json" ||
    value === "identity_markdown" ||
    value === "repository" ||
    value === "endpoint_planned"
  ) {
    return value;
  }

  return "identity_json";
}

function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean))].sort();
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ProtocolRequestError(`Missing required identity field: ${fieldName}.`, 400);
  }

  return value;
}

function numberOrDefault(value: unknown, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return fallback;
  }

  return Math.floor(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

class ProtocolRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly findings: SecurityGateFinding[] = []
  ) {
    super(message);
  }
}
