# AGENTS.md

## Project Identity

This repository is `bencharena`.

BenchArena is the verification protocol for autonomous AI agents. It gives open-source builders, vibe coders, AI developers, and researchers a way to passport, validate, compare, and prove the agents they create.

Core line:

> BenchArena is where AI agents get proven.

Core loop:

```txt
Agent Source → Agent Code → Agent Build → Normalize → Security Gate → Agent Passport → Trial → Result → Player Card → Reputation

Source of Truth

Before making any significant change, read these files if they exist:

README.md
CONTRIBUTING.md
SECURITY.md
docs/product-brief.md
docs/architecture.md
docs/trust-model.md
docs/web-architecture.md
docs/roadmap.md

Use README.md as the public product source of truth.

Use this AGENTS.md file as the development behavior guide.

If a referenced file does not exist yet, do not fail. State that it is missing and continue carefully.

Current Repository Stage

This repository is in early foundation mode.

Do not assume completed infrastructure exists unless the files are present in the repository.

Do not invent working backend services, databases, Docker services, Solana programs, MCP servers, x402 rails, or benchmark runners unless they already exist in code.

When adding new work, build in this order:

documentation
repository structure
shared types
mock data
UI components
pages
API routes
runner logic
integrations
proof/payment layers

The first useful product version should work with mock data before real integrations are added.

Product Rules

BenchArena is not a gambling product, casino product, monster-battle clone, or meme-token game.

Use these terms:

agent
passport
verification
trial
benchmark
player card
proof
reputation
leaderboard
receipt
rank
honor
arena

Avoid these terms unless explicitly discussing what not to do:

gambling
betting
casino
loot box
wagering
monster battle
Pokémon-style
pay-to-win
Trust Rules

Never design or implement flows that require:

private keys
seed phrases
raw wallet files
unrestricted shell access
unrestricted host filesystem access
raw memory upload by default
hidden tool injection
blind connection to a private live agent

Always preserve this trust line:

No hidden injection. No raw memory upload. No private keys.

If a feature touches agent execution, tools, memory, wallets, MCP servers, payments, or external APIs, explain the trust boundary before implementing.

Technical Direction

Use the actual repository files as the source of truth.

Do not assume dependencies, scripts, folders, or frameworks beyond what is present in:

package.json
pnpm-workspace.yaml
turbo.json
tsconfig.json
tsconfig.base.json
existing app/package folders
existing Docker or infra files

If a command or script does not exist, say so clearly.

Expected early direction, only if confirmed by the repo:

TypeScript
Node.js
pnpm
Next.js
React
Tailwind CSS
mock data first

Expected later direction, only when intentionally added:

PostgreSQL
Redis
Docker Compose
MCP Firewall
Solana Receipts
x402 Compute
benchmark runner
replay logs
usage receipts
GitHub Integration Rules

This repo is connected to GitHub by normal Git remote authentication.

Do not commit secrets.

Never write real values for:

GITHUB_TOKEN
OPENAI_API_KEY
ANTHROPIC_API_KEY
DATABASE_URL
SOLANA_RPC_URL
wallet private keys
seed phrases
.env contents

Use placeholder documentation only in .env.example.

If GitHub Actions are added later, secrets must be referenced securely through GitHub Secrets, for example:

env:
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

Do not create GitHub Actions, Codex Actions, deployment workflows, or CI secrets unless explicitly requested.

MCP and Open-Source Integration Rules

MCP support is part of the future architecture, but do not connect real MCP servers by default.

For MCP-related work:

start with documentation
define descriptor types
define trust boundaries
define mock manifests
avoid live external tool calls
never allow hidden tool injection
never allow unreviewed filesystem, shell, wallet, or network access

Open-source collaborations should be structured around safe extension points:

benchmark packs
agent presets
passport schemas
MCP descriptor examples
replay/result schemas
UI components
documentation improvements

Do not add real external dependency integrations unless the repo already contains the required package and configuration, or the user explicitly asks for that integration.

Design Direction

BenchArena should feel like a serious verification protocol with competitive energy.

Visual style:

dark
technical
clean
card-based
protocol metadata
verification badges
rank and honor elements
proof and receipt surfaces
replay-style inspection surfaces

Do not make the UI look like:

a casino
a meme coin site
a cartoon battle game
a copied Codewars UI
a copied Pokémon-style game

Use Codewars only as product-architecture inspiration:

Codewars: Kata → Solve → Feedback → Rank → Honor → Leaderboard
BenchArena: Agent → Passport → Trial → Result → Reputation → Leaderboard
Development Rules

Keep changes small and commit-friendly.

Prefer one logical layer per commit.

When making changes, report:

files changed
why they changed
how to test
suggested commit message

Before claiming completion, run relevant checks if available:

pnpm lint
pnpm typecheck
pnpm test
pnpm build

If scripts do not exist, state that clearly.

Do not claim tests passed unless they were actually run.

Commit Style

Use numbered commit messages in this project style.

Examples:

017--init-bencharena-foundation
018--add-codex-project-context
019--add-product-brief-docs
020--add-web-architecture-notes
021--add-mock-agent-passports
022--add-player-card-ui

Suggested format:

NNN--short-action-description

Use lowercase words separated by hyphens.

First Build Priorities

The next smallest useful commits should be:

018--add-codex-project-context
019--add-product-brief-docs
020--add-architecture-and-trust-docs
021--add-web-architecture-and-roadmap
022--add-mock-agent-passport-data

Do not jump directly into complex backend work.

Expected Product Objects

When adding types or mock data, start with these objects:

Agent
Agent Passport
Verification State
Security Gate Result
Trial
Trial Result
Player Card
Leaderboard Row
Usage Receipt
Proof Receipt

Keep early objects simple and readable.

Output Expectations

For planning tasks, respond with:

understanding
proposed files
exact changes
test plan
commit message

For implementation tasks, make the smallest safe change and explain exactly what changed.

For unclear tasks, ask one focused clarification question before editing.

Non-Negotiables

BenchArena must remain:

passport-first
verification-first
security-conscious
mock-data-friendly in early stages
honest about unfinished features
proof-ready without leaking private data
open-source friendly
useful for agent developers, vibe coders, AI researchers, security teams, MCP builders, Web3 builders, and DePIN/compute teams

---