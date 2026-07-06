# BenchArena Web Design Audit

This note records the design direction for the next frontend commits. It uses the installed web design, Vercel composition, and React best-practice guidance as constraints.

## Current Read

- The app is buildable and already uses a dark protocol visual language.
- The page still leans too much on repeated cards and dashboard grids.
- The hero explains the product, but it does not yet feel editorial or inevitable.
- The header is functional, but its hover state can feel more deliberate and less generic.
- Decorative motion is isolated in a client component, which is the right boundary.
- Mock, Planned, and Future labels are present and must remain honest.

## Redesign Principles

- Lead with one strong editorial story: agent claims become verified reputation.
- Use fewer generic surfaces and more composed protocol moments.
- Keep motion transform/opacity-based and respectful of reduced-motion preferences.
- Keep links semantic, focus-visible, and usable on touch devices.
- Prefer original BenchArena interaction language over copied reference assets.
- Keep all runtime, sandbox, wallet, MCP, x402, and proof features labeled Mock, Planned, or Future.

## Immediate Fixes

- Add a skip link and main landmark target.
- Rework the landing composition so the first viewport feels sharper and more intentional.
- Tighten typography, spacing, focus states, and responsive behavior.
- Polish the floating protocol elements with original BenchArena hover and motion cues.
- Add theme color and dark color-scheme metadata support.
