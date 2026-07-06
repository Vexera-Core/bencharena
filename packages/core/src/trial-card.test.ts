import { describe, expect, it } from "vitest";

import { safeMockAgentPassport } from "./passport.fixtures.js";
import { trialCardSchema } from "./trial-card.js";

describe("trialCardSchema", () => {
  it("accepts a mock trial card without enabling reputation impact", () => {
    const card = trialCardSchema.parse({
      id: "trial_readonly_review",
      title: "Read-only Project Review",
      category: "tool-use",
      passportId: safeMockAgentPassport.id,
      status: "mocked",
      verificationStatus: "unverified",
      summary: "Mock trial card for future UI work.",
      scores: [
        {
          label: "Permission clarity",
          score: 90
        }
      ],
      replayAvailable: false,
      createdAt: "2026-07-05T00:00:00.000Z",
      updatedAt: "2026-07-05T00:00:00.000Z"
    });

    expect(card.reputationImpactAllowed).toBe(false);
    expect(card.verificationStatus).toBe("unverified");
  });

  it("rejects out-of-range trial scores", () => {
    const result = trialCardSchema.safeParse({
      id: "trial_invalid_score",
      title: "Invalid Score",
      category: "reasoning",
      passportId: "agent_demo",
      scores: [
        {
          label: "Reasoning",
          score: 120
        }
      ],
      createdAt: "2026-07-05T00:00:00.000Z",
      updatedAt: "2026-07-05T00:00:00.000Z"
    });

    expect(result.success).toBe(false);
  });
});
