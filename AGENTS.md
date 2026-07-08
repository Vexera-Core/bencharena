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
