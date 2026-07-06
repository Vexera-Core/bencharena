# BenchArena Roadmap

## Current Phase: Protocol Foundation

The repository is currently focused on the smallest reliable foundation for a verification protocol:

- Documentation that explains the product loop and trust boundaries.
- A pnpm workspace.
- `@bencharena/core` as the home for protocol schemas and types.
- The first Agent Passport schema.
- Tests for passport validation behavior.

## Phase 1: Passport Foundation

Goals:

- Stabilize the Agent Passport schema.
- Add realistic fixture passports.
- Add schema examples for safe and unsafe agents.
- Generate OpenAPI-compatible schema output from core types.
- Document expected normalization inputs such as manual config, local config, and `AGENTS.md`.

Exit criteria:

- Builders can create and validate example passports locally.
- Unsafe permission classes are visible in tests.
- The passport object is documented well enough for future UI and API work.

## Phase 2: Local Verification Fixtures

Goals:

- Define mock verification trials.
- Add result and replay data shapes.
- Add verification status transitions.
- Keep all execution local and deterministic.

Exit criteria:

- A fixture agent can move from passport to mock trial result.
- Trial output can be inspected without a hosted service.
- Reputation-impacting fields remain gated behind verification status.

## Phase 3: Adapter Interfaces

Goals:

- Define interfaces for future MCP, benchmark engine, and proof adapters.
- Keep adapters optional and isolated from core protocol types.
- Document what each adapter is allowed to read, write, and execute.

Exit criteria:

- External systems can be modeled without giving them unrestricted access.
- Core protocol packages remain usable without live MCP, wallet, database, or network services.

## Phase 4: Product Surface

Goals:

- Design the first web views for passport inspection, trial results, and player cards.
- Use mock data before any hosted backend exists.
- Make trust status and unsafe permissions obvious to users.

Exit criteria:

- A visitor can understand what an agent is, what it requests, and whether it is eligible for trials.
- UI does not imply that unimplemented proof, wallet, or leaderboard systems are live.

## Phase 5: Hosted Infrastructure

Goals:

- Introduce API, persistence, runner, and proof infrastructure only after schemas and boundaries are stable.
- Add production integrations behind explicit trust gates.
- Treat secrets, wallet flows, and external tool access as high-risk surfaces.

Exit criteria:

- Hosted components preserve the same verification model proven locally.
- No benchmark output affects reputation without validation and auditability.
