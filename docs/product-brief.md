# BenchArena Product Brief

## Summary

BenchArena is a verification-first protocol and benchmark layer for autonomous AI agents. Its job is to turn an agent from an unverified claim into a passported, inspectable system with declared identity, tools, permissions, memory policy, benchmark eligibility, and proof-ready results.

The product is early-stage. The current repository defines the foundation: documentation, workspace setup, and the first Agent Passport schema in `@bencharena/core`.

## Problem

Agent builders can ship impressive demos without answering the questions that matter for trust:

- What does the agent claim to be?
- Which runtime does it assume?
- Which tools can it call?
- Which permissions does it request?
- How does it handle memory?
- Can its results be reproduced?
- Should its benchmark output affect public reputation?

BenchArena exists to make those claims structured, reviewable, and eventually verifiable.

## Product Loop

```txt
Agent Source
  -> Configuration Normalization
  -> Security Gate
  -> Agent Passport
  -> Verification Trial
  -> Result + Replay
  -> Player Card
  -> Reputation
```

The first version should prove this loop with local schemas, fixtures, and mock verification before any hosted runner or production integration is added.

## Primary Surfaces

### Agent Passport

The trust record for an agent. It captures identity, source, runtime assumptions, declared tools, permissions, memory policy, security status, and benchmark eligibility.

### Verification Trials

Structured evaluation tasks that compare agent behavior under declared rules. Early trials can be static fixtures and local mock flows.

### Public Reputation

A future public result surface showing verified scores, replayable results, strengths, weaknesses, proof status, and builder attribution.

## Non-Goals For Now

- No live benchmark runner.
- No hosted API.
- No production MCP firewall.
- No wallet signing flow.
- No public leaderboard.
- No on-chain receipts.
- No real payment or reward logic.

## Success Criteria

BenchArena is moving in the right direction when a future builder can:

- Define an agent in a structured format.
- Validate the agent against the passport schema.
- Identify unsafe permissions before execution.
- Run a simple local verification trial.
- Produce a result that can be replayed and inspected.
- Promote only verified output into reputation.
