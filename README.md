# POD Design System — Test Environment

Sprint-style scope: **4 components** (Button, Checkbox, SearchInput, Tooltip) built with tokens, light/dark mode, and a docs site.

This repo is the foundation for the bigger POD design system. It intentionally keeps scope small so the sprint process is easy to review and expand.

---

## What's inside

```
pod-design-system/
├── packages/
│   ├── tokens/       # Design tokens (colors, typography, spacing, …)
│   │                 # → CSS variables + Tailwind preset
│   └── ui/           # React components (source-only, no build step)
│       └── src/
│           ├── button/
│           ├── checkbox/
│           ├── search-input/
│           └── tooltip/
├── apps/
│   └── docs/         # Vite + React + MDX — the docs site (foundations + components)
└── docs/             # Architecture notes (DESIGN.md), specs, plans
```

## Quick start

```bash
pnpm install
pnpm dev               # → http://localhost:5174 (docs site)
```

Other scripts:

```bash
pnpm typecheck    # TypeScript across all packages
pnpm build        # Production build of the docs site
```

## Principles

- **Token-based styling.** Components never embed hex values. Semantic tokens
  (`bg-canvas`, `text-primary`, …) are CSS variables wired up via a Tailwind
  preset in `packages/tokens`.
- **Light + dark mode** via a `.dark` class on `<html>`; components are theme-agnostic.
- **Source-only packages.** `@pod/ui` and `@pod/tokens` are shipped as raw TS/CSS;
  the docs site compiles them through Vite. No dual build pipeline for this test
  environment.
- **Docs site is the review surface.** A single MDX-driven site shows every
  component's variants and states alongside foundation pages — no Storybook.

## Next steps

See [docs/DESIGN.md](docs/DESIGN.md) for the architectural notes and the list of
things to tackle when this expands beyond the sprint.
