# BenchArena Agent Notes

BenchArena is a verification protocol for autonomous AI agents. Keep frontend work aligned with the core loop:

`Agent Source -> Normalize -> Security Gate -> Agent Passport -> Trial -> Result -> Player Card -> Reputation`

Trust line stays visible in product surfaces:

`No hidden injection. No raw memory upload. No private keys.`

## Frontend Skills

Use these installed skills for frontend work when relevant:

- `senior-frontend` for React, Next.js, accessibility, and performance hygiene.
- `frontend-design` for strong visual direction, content discipline, and non-generic composition.
- `web-design-guidelines` for accessibility, focus states, typography, reduced motion, and interaction checks.
- `vercel-composition-patterns` for block-based component architecture and clear composition.
- `vercel-react-best-practices` for server-component defaults, small client islands, and bundle discipline.
- `vercel-react-view-transitions` only when navigation or route-level transitions actually need it.

## Brand Typography

Use expressive typography deliberately. BenchArena should feel editorial and protocol-grade, not like a generic SaaS template.

| Role | Font |
|---|---|
| Body / regular text | Mileast |
| Main display / hero | Armelia |
| Editorial notes / thesis lines | Alphacorsa |
| Secondary headings | Warband |
| Bold emphasis in paragraphs / callouts | CurovaSemibold |
| Logs / metadata / hashes / metrics | Monospace |

If font files are not present in the repo, do not download random substitutes. Define named CSS variables with readable fallbacks and document the missing font files in the work summary.

## CSS Orchestration

- Keep `apps/web/app/globals.css` minimal.
- Put design tokens and font variables in `apps/web/styles/tokens.css`.
- Put base element rules in `apps/web/styles/base.css`.
- Put layout primitives in `apps/web/styles/layout.css`.
- Put shared effects in `apps/web/styles/effects.css`.
- Put motion primitives in `apps/web/styles/motion.css`.
- Put editorial/header typography in `apps/web/styles/cyber-editorial.css`.
- Put grid/background texture utilities in `apps/web/styles/editor-grid.css`.
- Put section-specific styles in CSS Modules beside each landing component.

## Motion And Visual Rules

- Use motion to create hierarchy and presence, not noise.
- Honor `prefers-reduced-motion`.
- Animate `transform` and `opacity` by default.
- Keep the first viewport as one brand-led composition, not a dashboard.
- The brand or product name must be a hero-level signal.
- Do not place detached cards, badges, stats, or noisy overlays in the hero.
- Keep runtime, proof, sandbox, wallet, MCP, Solana, database, and x402 features marked `Mock`, `Planned`, or `Future` unless real code exists.
- Do not copy assets, code, or layouts from Codewars, xHermes, or any reference site. Use them only as product-language and interaction inspiration.
