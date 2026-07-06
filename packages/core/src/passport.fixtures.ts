import type { AgentPassport } from "./passport.js";

export const safeMockAgentPassport = {
  id: "agent_safe_reader",
  displayName: "Safe Reader Agent",
  source: "agents-md",
  sourceReference: {
    type: "agents-md",
    label: "Example AGENTS.md"
  },
  summary: "A read-only local agent used to validate the passport shape.",
  runtime: {
    runtime: "codex",
    environment: "local"
  },
  tools: [
    {
      name: "filesystem-reader",
      description: "Reads scoped project files for review.",
      permissions: ["read-only-filesystem"]
    }
  ],
  permissions: ["read-only-filesystem"],
  memoryPolicy: "summary-only",
  securityStatus: "verified",
  securityFindings: [],
  benchmarkEligibility: "mock-trials",
  createdAt: "2026-07-05T00:00:00.000Z",
  updatedAt: "2026-07-05T00:00:00.000Z"
} satisfies AgentPassport;

export const needsReviewMockAgentPassport = {
  id: "agent_tool_operator",
  displayName: "Tool Operator Agent",
  source: "local-config",
  sourceReference: {
    type: "local-config",
    label: "Example local config"
  },
  summary: "A mock agent that declares network and external API access.",
  runtime: {
    runtime: "node",
    version: "20",
    environment: "local"
  },
  tools: [
    {
      name: "external-api-client",
      description: "Calls a declared external API during planned trials.",
      permissions: ["network", "external-api"]
    }
  ],
  permissions: ["network", "external-api"],
  memoryPolicy: "scoped-export",
  securityStatus: "needs-review",
  securityFindings: [
    {
      id: "finding_external_api_review",
      boundary: "tool",
      severity: "warning",
      title: "External API access requires policy review"
    }
  ],
  benchmarkEligibility: "not-eligible",
  createdAt: "2026-07-05T00:00:00.000Z",
  updatedAt: "2026-07-05T00:00:00.000Z"
} satisfies AgentPassport;

export const blockedMockAgentPassport = {
  id: "agent_wallet_requester",
  displayName: "Wallet Requester Agent",
  source: "manual",
  sourceReference: {
    type: "manual",
    label: "Manual mock entry"
  },
  summary: "A mock blocked agent that requests wallet access before wallet boundaries exist.",
  runtime: {
    runtime: "unknown",
    environment: "local"
  },
  tools: [
    {
      name: "wallet-signer",
      description: "Requests wallet signing access.",
      permissions: ["wallet"]
    }
  ],
  permissions: ["wallet"],
  memoryPolicy: "raw-upload-blocked",
  securityStatus: "blocked",
  securityFindings: [
    {
      id: "finding_wallet_not_supported",
      boundary: "wallet",
      severity: "critical",
      title: "Wallet signing is not implemented"
    }
  ],
  benchmarkEligibility: "not-eligible",
  createdAt: "2026-07-05T00:00:00.000Z",
  updatedAt: "2026-07-05T00:00:00.000Z"
} satisfies AgentPassport;

export const mockAgentPassports = [
  safeMockAgentPassport,
  needsReviewMockAgentPassport,
  blockedMockAgentPassport
] satisfies AgentPassport[];
