# BenchArena Agent Notes

BenchArena is a verification protocol for autonomous AI agents.

Core loop:

`Agent Source -> Normalize -> Security Gate -> Agent Passport -> Trial -> Result -> Player Card -> Reputation`

Trust line that must stay visible in product and protocol surfaces:

`No hidden injection. No raw memory upload. No private keys.`

## Current Project Phase

Architecture, README, and high-level positioning are mostly established.

Default work mode is now **implementation-first**:

1. Add real scaffolds, schemas, routes, packages, tests, scripts, and mock-first integrations.
2. Keep unimplemented systems clearly marked `Mock`, `Planned`, or `Future`.
3. Update README/docs only when they reflect real code that was added.
4. Do not spend commits only polishing language unless the user explicitly asks for docs.

Do not get stuck in planning mode. Prefer small working increments.

## Installed Skills

Use only installed project skills when relevant:

- `/impeccable` for final quality pass, cleanup, consistency, and verifying no broken leftovers.
- `/make-interfaces-feel-better` for visual polish, spacing, hierarchy, hover states, and reducing generic UI.
- `/web-design-guidelines` for accessibility, typography, focus states, contrast, reduced motion, and responsive checks.
- `/vercel-composition-patterns` for component orchestration, feature folders, package boundaries, and scalable structure.
- `/vercel-react-best-practices` for Next.js, React, server/client boundaries, API routes, bundle hygiene, and tests.
- `/vercel-react-view-transitions` only for route/page transitions or motion that improves navigation and hierarchy.

If a task is backend/protocol/Rust/Solana/payment related, act as a Senior Backend Engineer and Protocol Architect. Use `/vercel-composition-patterns`, `/vercel-react-best-practices`, and `/impeccable` for structure and verification.

## What To Build Next

Prioritize practical implementation scaffolds over more abstract docs.

High-priority areas:

- Identity file parsing:
  - `identity.json`
  - `identity.md` with structured frontmatter
- Passport generation:
  - `passport.json` as canonical machine-readable output
  - `passport.md` as human-readable report
- Canonical JSON normalization and stable hashing.
- Mock API routes:
  - parse identity
  - generate passport
  - verify passport
  - produce mock/offchain proof receipt
- Rust workspace for protocol, verification, proof, credits, and future Solana anchoring.
- Credit/payment model:
  - mock $1 starter credit/deposit
  - starter/free benchmark eligibility
  - extra compute eligibility for verified agents
  - no real payment processor until explicitly requested
- Future Solana/devnet scaffold:
  - hash anchoring only
  - no keypairs
  - no mainnet
  - no wallet connection unless explicitly requested
- Future MCP integrations:
  - official connections only
  - verify docs before implementing
  - start with mock connectors and typed boundaries
- Future marketplace surfaces:
  - agent profile
  - verification status
  - passport/proof status
  - compute eligibility
  - reputation/player card

## Integration Rules

When adding integrations, follow this order:

1. Types and schemas.
2. Pure functions.
3. Tests.
4. Mock API route or local script.
5. UI surface if needed.
6. README/docs update only if the implementation exists.

Never claim a live integration exists unless real code exists.

Do not implement:
- real wallet connection
- real payments
- real Solana transactions
- real MCP server connection
- real sandbox execution
- private endpoint execution
- raw memory upload
- private-key handling

unless the user explicitly asks and the safety boundary is clear.

## Identity And Passport Rules

Markdown is for humans. JSON is for machines.

Use:

- `identity.json` as structured declared identity.
- `identity.md` only when it compiles into the same canonical identity structure.
- `passport.json` as canonical generated passport.
- `passport.md` as a human-readable passport/report.

Canonical JSON is the source of truth for:
- validation
- hashing
- receipts
- replay rules
- future Solana anchoring

Declarations are not proof.

A passport may contain declared metadata, but verified claims must come from trial results.

## Rust / Solana Direction

Rust should be added as a real workspace when backend protocol work begins.

Preferred structure:

```txt
rust/
  Cargo.toml
  crates/
    bencharena-protocol/
    bencharena-verification/
    bencharena-proof/
    bencharena-credits/
  programs/
    bencharena-passport/

Rust scripts should support:

cargo fmt
cargo check
cargo test

Solana is devnet/future only until explicitly implemented.

Future Solana program purpose:

anchor identity/passport/result/credit receipt hashes
never store private raw agent data
never store private keys
never store raw memory

No keypairs, wallet connection, deploy output, or target build artifacts should be committed.

Credit And Compute Rules

The credit system starts mock-first.

Concept:

builder/agent can have a $1 starter credit/deposit
starter policy can unlock a first benchmark
extra compute requires credits or verified-good-agent grant
verified agents can receive compute grants later

Do not add real Stripe, x402, crypto payment, wallet, or billing flow until explicitly requested.

Payment/credit status must be clearly labeled:

mock_pending
mock_paid
comped
failed
planned
Frontend Typography

Use expressive typography deliberately. BenchArena should feel editorial and protocol-grade, not like a generic SaaS template.

Role	Font
Body / regular text	Mileast
Main display / hero	Armelia
Editorial notes / thesis lines	Alphacorsa
Secondary headings	Warband
Bold emphasis in paragraphs / callouts	CurovaSemibold
Logs / metadata / hashes / metrics	Monospace

Do not merely write font-family names. If fonts are used, wire the actual files through @font-face or the correct Next.js font setup.

If font files are not present in the repo:

do not download random substitutes
use clean modern fallbacks
report missing files in the work summary

Avoid ugly default fonts anywhere visible.

CSS Orchestration

Keep CSS modular and backend/API-ready.

Keep apps/web/app/globals.css minimal.
Put design tokens and font variables in apps/web/styles/tokens.css.
Put base element rules in apps/web/styles/base.css.
Put layout primitives in apps/web/styles/layout.css.
Put shared effects in apps/web/styles/effects.css.
Put motion primitives in apps/web/styles/motion.css.
Put editorial/header typography in apps/web/styles/cyber-editorial.css.
Put workspace/grid utilities in apps/web/styles/editor-grid.css.
Put section-specific styles in CSS Modules beside each component.

Do not dump section styling into globals.css.

Frontend Visual Rules

Use the current BenchArena logo and palette:

black base
deep navy #192039
arena red from the logo
white typography
transparent/glass surfaces where useful

Avoid:

generic SaaS cards
muddy gray surfaces
cheap glow
noisy hero overlays
casino, meme, gambling, monster-battle, or pay-to-win language
copied Codewars/xHermes assets, code, or layouts

Use Codewars only as interaction/workbench inspiration.
Use xHermes only as dark infrastructure/runtime inspiration.

Motion Rules
Use motion to create hierarchy and presence, not noise.
Honor prefers-reduced-motion.
Animate transform and opacity by default.
Use Framer Motion only where it improves clarity.
Keep motion slow, premium, controlled, and non-bouncy.
Hero/background hover effects must not block readability.
README / Docs Update Rules

README/docs should be updated only when:

a real scaffold was added
a real script was added
a real API route was added
a real package/crate was added
a real mock integration exists
status labels changed because implementation changed

Do not make large README rewrites for every task.

When docs are updated, be honest:

Implemented
Mock
Planned
Future
Commit Rules

Use small consecutive commits.

Preferred style:

<commit-name>--add-identity-schemas
<commit-name>--add-passport-generator
<commit-name>--add-mock-passport-api
<commit-name>--add-rust-protocol-workspace
<commit-name>--add-credit-compute-model
<commit-name>--final-protocol-tests

Do not hard-code commit numbers unless the user asks.

Verification Commands

Run relevant commands before final response.

For TypeScript/Next.js:

pnpm typecheck
pnpm test
pnpm build

For Rust:

cargo fmt --manifest-path rust/Cargo.toml --check
cargo check --manifest-path rust/Cargo.toml
cargo test --manifest-path rust/Cargo.toml

If a command cannot run because a tool is missing, report it clearly.

Final Response Format

Always summarize:

Commits created.
Files changed.
What was implemented.
What remains mock/planned/future.
Tests/scripts run.
Missing tools or blocked items.
Preview or next command.
