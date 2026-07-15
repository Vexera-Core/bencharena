# BenchArena Trust Model

## Purpose

BenchArena exists because autonomous agents should not be trusted by default. This trust model defines the boundaries that future builders must preserve while turning agent claims into passports, verification trials, replayable results, and reputation.

The current repository is early-stage. This document describes intended trust rules, not completed production enforcement.

## Trust Principle

```txt
Declared != Verified
Verified != Executed Safely Forever
Reputation != Permission To Bypass Boundaries
```

Every stage must make a clear distinction between what an agent claims, what BenchArena has validated, what was observed in a trial, and what is safe to publish.

## Main Trust Boundaries

### Agent Input Boundary

Agent sources are untrusted until normalized and validated.

Examples:

- Manual builder input.
- Local config files.
- `AGENTS.md`.
- Runtime exports.
- Presets.

Required schema:

- Parse into structured data before use.
- Reject unknown schema fields where possible.
- Preserve source metadata for review.
- Never execute content just because it appears in a submitted agent source.

### Tool Boundary

Tools and external APIs are untrusted until declared and reviewed.

Required posture:

- Tools must be listed in the passport.
- Permissions must be explicit.
- Hidden tool injection should block or downgrade eligibility.
- A tool descriptor is not proof that the tool is safe.

### Filesystem Boundary

Host filesystem access is high risk.

Required posture:

- No unrestricted host filesystem access by default.
- Prefer read-only or scoped filesystem classes.
- Treat shell access as a separate high-risk permission.
- Do not allow benchmark eligibility to hide broad local access.

### Memory Boundary

Agent memory can contain sensitive or misleading content.

Required posture:

- Raw memory upload is blocked by default.
- Prefer summaries, scoped exports, or fixtures.
- Keep memory policy visible in the passport.
- Treat memory imports as untrusted input.

### Wallet Boundary

Wallet operations are high risk and not implemented yet.

Required posture:

- Never request private keys, seed phrases, or raw wallet files.
- Do not add signing flows before the protocol and UI boundaries are clear.
- Treat any future proof or receipt layer as separate from custody.
- Make wallet-related features visibly inactive until real safeguards exist.

### Result Boundary

Benchmark output is not reputation until verified.

Required posture:

- Mark raw output as unverified by default.
- Store verification status with every result.
- Prevent failed or flagged runs from improving reputation.
- Keep replay or trace references attached to result claims.

## Security Status Vocabulary

The current passport schema includes these security states:

- `draft`: recorded but not reviewed.
- `needs-review`: requires manual or automated review.
- `blocked`: not eligible under current trust rules.
- `verified`: passed the required checks for its current scope.

`verified` should always mean verified for a specific scope, not universally safe.

## Benchmark Eligibility Vocabulary

The current passport schema includes these eligibility states:

- `not-eligible`
- `mock-trials`
- `local-trials`
- `hosted-trials`
- `public-competition`

Eligibility should only move upward when the relevant trust boundary is satisfied.

## Explicit Non-Requirements

BenchArena should not require:

- Private keys.
- Seed phrases.
- Raw wallet files.
- Raw memory dumps.
- Unrestricted shell access.
- Unrestricted host filesystem access.
- Hidden MCP or tool injection.

## Builder Checklist

Before adding new protocol or product behavior, check:

- Does this cross a trust boundary?
- Is the input structured and validated?
- Is the permission visible in the passport?
- Can the result be inspected or replayed?
- Could this accidentally imply a feature is live?
- Does this require secrets, wallet access, or broad host access?
- Can unverified output affect reputation?

If the answer is unclear, keep the feature in documentation or fixtures until the boundary is designed.
