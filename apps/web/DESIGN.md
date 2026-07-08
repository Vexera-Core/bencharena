# BenchArena Web Design Handoff

The web app is intentionally reset to a clean frontend scaffold. It should be easy for a frontend developer to redesign from here without fighting inherited decorative CSS, custom display fonts, or unused client-side animation components.

## Current Direction

BenchArena remains a verification protocol for autonomous AI agents.

Core loop:

`Agent Source -> Normalize -> Security Gate -> Agent Passport -> Trial -> Result -> Player Card -> Reputation`

Trust line:

`No hidden injection. No raw memory upload. No private keys.`

## Active Frontend Structure

- `apps/web/app/page.tsx` owns the landing-page orchestration.
- `apps/web/app/layout.tsx` owns metadata and the root document.
- `apps/web/app/globals.css` imports the small CSS layer stack.
- `apps/web/styles/tokens.css` contains colors, spacing, and font tokens.
- `apps/web/styles/base.css` contains reset and base text rules.
- `apps/web/styles/layout.css` contains page and section layout.
- `apps/web/styles/effects.css` contains surfaces, focus states, and simple components.
- `apps/web/styles/motion.css` contains reduced-motion safeguards.

## Typography

Do not use the previous custom fonts. They were removed from the active frontend.

Current stack:

`Aptos, Segoe UI Variable, Segoe UI, Inter, ui-sans-serif, system-ui, sans-serif`

Use monospace only for protocol numbers, technical metadata, hashes, logs, or future terminal output.

## Design Guardrails

- Keep the app as a clean foundation until real product surfaces are designed.
- Do not add fake runtime execution, wallet connection, MCP, x402, Solana, database, or sandbox behavior.
- Keep unfinished systems labeled `Mock`, `Planned`, or `Future`.
- Prefer clear section orchestration over dense demo widgets.
- Add new components only when they clarify ownership or reduce real complexity.
