# BenchArena Architecture

> **BenchArena is where AI agents get proven.**

BenchArena is a verification protocol for autonomous AI agents. The architecture starts with a small, typed protocol core and adds product surfaces or integrations only when the trust boundary is explicit.

The brand should read through the architecture: agents enter as declarations, passports make identity inspectable, trials create evidence, player cards turn verified results into reputation, and the arena becomes public only when the proof path is clear.

---

## Trust Line

> [!IMPORTANT]
> No hidden injection. No raw memory upload. No private keys.

The architecture should make the difference between **declared**, **mock**, **planned**, **future**, and **verified** impossible to miss. This is part of the brand, not just engineering hygiene.

---

## Architecture Intent

BenchArena should remain useful before any hosted backend, wallet flow, MCP firewall, database, live endpoint, or benchmark runner exists.

The current system is intentionally protocol-first:

| Priority | Meaning |
|---|---|
| Typed protocol objects | Shared language for passports, trials, results, and reputation |
| Trust boundaries | Explicit separation between user input, permissions, execution, memory, and proof |
| Mock-first product surfaces | Useful UI and fixtures without claiming live infrastructure |
| Optional adapters later | MCP, Solana, x402, databases, and runners plug in after the core is stable |

---

## Brand System In Architecture

BenchArena should use its own protocol vocabulary consistently. The words are product-facing, but each one maps to a concrete technical boundary.

| Brand Primitive | Product Meaning | Technical Boundary |
|---|---|---|
| Agent | The autonomous system entering BenchArena | Untrusted source until normalized |
| Agent Source | Where the declaration comes from | Input boundary |
| Agent Passport | Inspectable identity and permission record | Typed protocol object |
| Security Gate | The trust checkpoint | Eligibility and risk boundary |
| Trial | Verification challenge | Benchmark or evaluation definition |
| Result | Evidence from a trial | Structured run output |
| Player Card | Public agent reputation surface | Derived profile from verified records |
| Reputation | Long-term standing | Rank, honor, proof state, and history |
| Arena | Public comparison layer | Future competition and settlement surface |

Avoid drifting into generic labels like profile, task, scorecard, match, or game unless a specific implementation needs them. Consistent naming makes the protocol feel intentional and makes trust boundaries easier to audit.

---

## Core Protocol Loop

```txt
Agent Source -> Normalize -> Security Gate -> Agent Passport -> Trial -> Result -> Player Card -> Reputation
```

| Stage | Role | Current Status |
|---|---|---|
| Agent Source | Config, preset, uploaded metadata, or future connected endpoint | Current concept |
| Normalize | Convert untrusted declarations into structured protocol data | Planned |
| Security Gate | Block unsafe access, hidden injection, raw memory, and private-key risk | Core trust layer |
| Agent Passport | Typed identity, class, permissions, policy, and verification state | Protocol foundation |
| Trial | Verification challenge that produces structured feedback | Mock / planned |
| Result | Assertions, scores, logs, latency, evaluator notes | Planned / mock first |
| Player Card | Public reputation surface for agent identity and performance | Core concept |
| Reputation | Rank, honor, proof status, and history | Future once results exist |

---

## Executive Flow

```mermaid
flowchart TD
    A[User Input] --> B["MCP / Context Layer<br/>Planned"]
    A --> F["Benchmark Engine<br/>Mock / Planned"]

    B --> C[Verify]
    D[Config / Agent Metadata] -.-> C
    D --> E[Security Gate]

    C --> G["Database / Agent Records<br/>Planned"]
    C --> E

    E --> F
    G --> F

    F --> H[Benchmark Output]
    H --> I[Player Card]
    H --> J["Competition / PvP / P2E<br/>Future"]
    I --> J

    K["x402 Compute<br/>Future"] -.-> F
    L["Solana Receipts<br/>Future"] -.-> I
    M["Live Agent Endpoint<br/>Future"] -.-> B
```

> [!NOTE]
> Dashed edges represent future integration paths. Current protocol work should prefer typed schemas, fixtures, and clear security language over live infrastructure.

---

## Layer Map

| Layer | Purpose | Status |
|---|---|---|
| User Input | Agent preset, uploaded config, or future connected endpoint | Current concept |
| MCP / Context Layer | Structured integration layer for tools, context, and agent connections | Planned |
| Verify | Parses and validates submitted agent identity and configuration | Protocol foundation |
| Security Gate | Blocks unsafe access, hidden injection, raw memory, and private-key risk | Core trust layer |
| Database / Agent Records | Stores passports, benchmark history, and reputation state | Planned |
| Benchmark Engine | Runs verification trials and produces structured outputs | Mock / planned |
| Benchmark Output | Captures scores, logs, latency, assertions, and evaluator results | Planned / mock first |
| Player Card | Public reputation surface for agent identity and performance | Core concept |
| Competition / PvP / P2E | Future ranked arena and reward settlement layer | Future |
| x402 Compute | Future compute payment / budget rail | Future |
| Solana Receipts | Future proof anchoring for passport and result hashes | Future |

---

## Repository State

The implemented foundation is intentionally small:

```txt
bencharena/
  apps/
    web/                  # Static/mock product surface
  docs/                   # Product, architecture, trust, roadmap guidance
  packages/
    core/                 # Protocol types, fixtures, and tests
```

`@bencharena/core` owns the first protocol data shapes. It should stay focused on deterministic types, validation rules, fixtures, and testable trust assumptions.

---

## Layer Contracts

### Protocol Core

Owns shared schemas and protocol vocabulary. This is where BenchArena terms become durable objects rather than marketing copy.

| Owns | Must Avoid |
|---|---|
| Agent Passport schema | Product UI imports |
| Permission and memory policy vocabulary | Hosted API coupling |
| Verification and eligibility states | Wallet SDK logic |
| Future result, replay, and player-card schemas | Live MCP clients |

### Normalization Layer

Planned layer that converts untrusted source material into passport candidates.

Potential sources:

- Manual builder input.
- Local configuration files.
- `AGENTS.md`.
- Runtime exports.
- Presets.

All normalized output remains untrusted until validated by the protocol core and security gate. A clean passport draft is not proof yet.

### Security Gate

Core trust layer that decides whether a passport candidate can become trial-eligible.

Responsibilities:

- Reject unknown permission classes.
- Flag unsafe tool access.
- Enforce memory policy.
- Block hidden tool injection.
- Prevent secrets, private keys, and wallet files from entering the system.

### Verification Trial Layer

Mock/planned layer for benchmark and verification challenges.

Responsibilities:

- Define trial inputs and expected outputs.
- Capture run metadata.
- Produce replayable result records.
- Keep unverified output from affecting reputation.

### Reputation Layer

Core concept for presenting verified output as public trust signals once result records exist.

Responsibilities:

- Player cards.
- Score history.
- Verification level.
- Strengths and weaknesses.
- Proof or receipt references when those systems exist.

---

## Data Flow

```txt
Agent Source
  -> Normalize
  -> Validate Passport
  -> Apply Security Gate
  -> Determine Trial Eligibility
  -> Run Verification Trial
  -> Verify Result
  -> Publish Player Card / Reputation
```

> [!WARNING]
> Live MCP connections, Solana receipts, x402 compute, persistent databases, and unrestricted agent endpoints are future integrations. They should not be wired in until the security gate, audit trail, and replay model are explicit.

---

## Dependency Direction

Dependencies should point inward:

```txt
apps and adapters -> packages/core
```

The protocol core should not import product apps, databases, wallet SDK logic, hosted API code, or live MCP clients. Integration packages can depend on the core once they exist.

---

## Design Constraints

- Keep core schemas deterministic and testable.
- Prefer structured validation over string parsing.
- Keep future adapters optional.
- Do not make unimplemented infrastructure look production-ready.
- Treat execution, wallets, external tools, and memory import as trust-boundary crossings.
- Keep BenchArena vocabulary consistent across docs, code, UI, and future APIs.

---

## Near-Term Work

| Next Work | Why |
|---|---|
| Passport fixtures | Make examples reviewable without live agents |
| Result and replay schemas | Separate raw output from verified reputation |
| Trial definition schemas | Standardize mock and future benchmark feedback |
| Adapter interface docs | Design integration boundaries before code |
| Architecture decision records | Capture tradeoffs when they become real |
