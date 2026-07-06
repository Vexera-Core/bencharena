import { describe, expect, it } from "vitest";

import { mockAgentPassports } from "./passport.fixtures.js";
import { agentPassportSchema } from "./passport.js";

describe("agentPassportSchema", () => {
  it("accepts a minimal passport-ready agent record", () => {
    const passport = agentPassportSchema.parse({
      id: "agent_demo",
      displayName: "Demo Agent",
      source: "agents-md",
      runtime: {
        runtime: "codex",
        environment: "local"
      },
      tools: [
        {
          name: "filesystem-reader",
          permissions: ["read-only-filesystem"]
        }
      ],
      permissions: ["read-only-filesystem"],
      createdAt: "2026-07-05T00:00:00.000Z",
      updatedAt: "2026-07-05T00:00:00.000Z"
    });

    expect(passport.memoryPolicy).toBe("raw-upload-blocked");
    expect(passport.securityStatus).toBe("draft");
    expect(passport.securityFindings).toEqual([]);
    expect(passport.benchmarkEligibility).toBe("not-eligible");
  });

  it("rejects unrestricted host access as an undeclared permission class", () => {
    const result = agentPassportSchema.safeParse({
      id: "agent_unsafe",
      displayName: "Unsafe Agent",
      source: "manual",
      runtime: {
        runtime: "unknown"
      },
      permissions: ["unrestricted-host"],
      createdAt: "2026-07-05T00:00:00.000Z",
      updatedAt: "2026-07-05T00:00:00.000Z"
    });

    expect(result.success).toBe(false);
  });

  it("captures source references and security findings without changing eligibility", () => {
    const passport = agentPassportSchema.parse({
      id: "agent_review",
      displayName: "Review Agent",
      source: "local-config",
      sourceReference: {
        type: "local-config",
        label: "local agent config",
        uri: "file://agent.json"
      },
      runtime: {
        runtime: "node",
        version: "20"
      },
      securityStatus: "needs-review",
      securityFindings: [
        {
          id: "finding_tool_network",
          boundary: "tool",
          severity: "warning",
          title: "Network tool requires review"
        }
      ],
      createdAt: "2026-07-05T00:00:00.000Z",
      updatedAt: "2026-07-05T00:00:00.000Z"
    });

    expect(passport.sourceReference?.type).toBe("local-config");
    expect(passport.securityFindings[0]?.boundary).toBe("tool");
    expect(passport.benchmarkEligibility).toBe("not-eligible");
  });

  it("keeps mock passports valid against the protocol schema", () => {
    const parsed = mockAgentPassports.map((passport) => agentPassportSchema.parse(passport));

    expect(parsed).toHaveLength(3);
    expect(parsed.map((passport) => passport.securityStatus)).toEqual([
      "verified",
      "needs-review",
      "blocked"
    ]);
  });
});
