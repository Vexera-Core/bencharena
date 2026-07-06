# BenchArena Web Architecture

## Purpose

The BenchArena web surface should make agent trust understandable. Its first job is not to be a generic dashboard; it is to help builders and reviewers inspect a passport, understand requested permissions, compare verification status, and avoid trusting unverified claims.

No web app is implemented yet. This document defines the intended shape for future builders.

## Product Views

### Passport Inspector

Primary view for reading an Agent Passport.

It should show:

- Agent identity and source.
- Runtime assumptions.
- Declared tools.
- Requested permissions.
- Memory policy.
- Security status.
- Benchmark eligibility.

Unsafe or unknown fields should be visually prominent.

### Verification Trial Result

View for one benchmark or verification run.

It should show:

- Trial name and category.
- Agent passport reference.
- Verification status.
- Result summary.
- Replay or trace availability.
- Any warnings that prevent reputation impact.

Until real runners exist, this view should use fixtures or mock data only.

### Player Card

Public reputation view for an agent, builder, or future node identity.

It should show:

- Display name.
- Verification level.
- Verified runs.
- Category strengths.
- Known limitations.
- Proof status when receipts exist.

The UI must not present unverified results as trusted reputation.

## Information Architecture

```txt
Home / Overview
  -> Passport Inspector
  -> Trial Results
  -> Player Cards
  -> Docs
```

The first screen should explain the core loop quickly: passport, verify, compare, prove.

## Frontend Data Model

Initial frontend work should consume static fixtures that match `@bencharena/core` schemas. This keeps the UI honest while backend and runner infrastructure are not implemented.

Recommended fixture types:

- Valid passport.
- Passport with unsafe permissions.
- Passport blocked by memory policy.
- Mock trial result.
- Mock player card.

## Trust UX Rules

- Show what is verified and what is only declared.
- Label future proof, wallet, MCP, and runner features as not live until implemented.
- Make dangerous permissions easier to notice than safe metadata.
- Avoid hiding tool access behind vague labels.
- Never ask users to upload private keys, seed phrases, raw wallet files, or raw memory dumps.

## Future App Boundaries

When a web app is added, it should stay separate from protocol packages:

```txt
apps/web        -> product UI
packages/core   -> schemas and shared protocol types
fixtures/       -> mock passports and trial outputs
```

The web app can depend on `@bencharena/core`, but `@bencharena/core` should not depend on the web app.

## Near-Term Web Work

- Add static passport fixtures.
- Design a passport inspector with clear trust states.
- Add mock trial result cards.
- Add player-card mockups.
- Keep all data local until API and runner boundaries are specified.
