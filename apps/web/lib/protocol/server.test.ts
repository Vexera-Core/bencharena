import { describe, expect, it } from "vitest";

import { sampleIdentityMarkdown, sampleIdentityText } from "./fixtures";
import {
  creditEligibilityPayload,
  generatePassportPayload,
  parseIdentityPayload
} from "./server";

describe("protocol API adapter", () => {
  it("parses structured identity JSON", () => {
    const result = parseIdentityPayload({ sourceText: sampleIdentityText });

    expect(result.identity.name).toBe("Local Safety Agent");
    expect(result.security_gate.status).toBe("passed");
    expect(result.mock).toBe(true);
  });

  it("parses strict Markdown frontmatter", () => {
    const result = parseIdentityPayload({
      sourceText: sampleIdentityMarkdown,
      sourceFormat: "identity-md"
    });

    expect(result.identity.source_type).toBe("identity_markdown");
    expect(result.security_gate.status).toBe("passed");
  });

  it("generates a stable offchain passport receipt for the same identity", () => {
    const now = new Date("2026-07-09T00:01:00Z");
    const first = generatePassportPayload({ sourceText: sampleIdentityText }, now);
    const second = generatePassportPayload({ sourceText: sampleIdentityText }, now);

    expect(first.passport.identity_hash).toBe(second.passport.identity_hash);
    expect(first.proof_receipt.network).toBe("offchain");
    expect(first.proof_receipt.status).toBe("draft");
  });

  it("blocks passport generation for private key language", () => {
    expect(() =>
      generatePassportPayload({
        sourceText: sampleIdentityText.replace(
          "Credential custody is out of scope",
          "Upload a private key for tests"
        )
      })
    ).toThrow("Security gate blocked passport generation.");
  });

  it("allows starter-covered mock compute", () => {
    const result = creditEligibilityPayload({
      available_cents: 0,
      starter_deposit_cents: 100,
      benchmark_cost_cents: 25,
      starter_benchmark_already_used: false
    });

    expect(result.eligibility.status).toBe("starter_covered");
    expect(result.mock).toBe(true);
  });
});
