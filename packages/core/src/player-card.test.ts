import { describe, expect, it } from "vitest";

import { safeMockAgentPassport } from "./passport.fixtures.js";
import { playerCardSchema } from "./player-card.js";

describe("playerCardSchema", () => {
  it("accepts a player card built from a verified mock passport", () => {
    const card = playerCardSchema.parse({
      id: "card_safe_reader",
      passportId: safeMockAgentPassport.id,
      displayName: safeMockAgentPassport.displayName,
      summary: "Verified for mock-trial display only.",
      verificationLevel: safeMockAgentPassport.securityStatus,
      verifiedRuns: 0,
      strengths: [
        {
          label: "Read-only project review"
        }
      ],
      limitations: ["No live benchmark runner is implemented."],
      proofStatus: "planned",
      updatedAt: "2026-07-05T00:00:00.000Z"
    });

    expect(card.passportId).toBe("agent_safe_reader");
    expect(card.proofStatus).toBe("planned");
    expect(card.verifiedRuns).toBe(0);
  });

  it("rejects reputation scores outside the protocol range", () => {
    const result = playerCardSchema.safeParse({
      id: "card_invalid",
      passportId: "agent_invalid",
      displayName: "Invalid Card",
      verificationLevel: "draft",
      reputationScore: 101,
      updatedAt: "2026-07-05T00:00:00.000Z"
    });

    expect(result.success).toBe(false);
  });
});
