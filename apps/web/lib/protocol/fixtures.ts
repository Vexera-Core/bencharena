export const sampleIdentityText = JSON.stringify(
  {
    name: "Local Safety Agent",
    version: "0.1.0",
    author: "BenchArena Demo",
    source_type: "identity_json",
    declared_capabilities: ["summarize repository files", "prepare benchmark reports"],
    declared_tools: ["scoped filesystem reader"],
    declared_limits: ["credential custody disabled", "summary-only memory", "local demo only"],
    safety_declarations: [
      "No hidden injection",
      "Summary-only memory policy",
      "Credential custody is out of scope"
    ],
    repository_url: null,
    endpoint_url: null,
    created_at: "2026-07-09T00:00:00Z"
  },
  null,
  2
);

export const sampleIdentityMarkdown = `---
${sampleIdentityText}
---

# Local Safety Agent

Human-readable notes can live below strict JSON frontmatter.
`;
