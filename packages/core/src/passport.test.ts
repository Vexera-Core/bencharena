import { describe, expect, it } from "vitest";

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
});
