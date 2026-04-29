# POD Design System — Sprint 1 Design

**Status:** Implemented · Sprint 1 scope
**Components:** Button · Checkbox · SearchInput · Tooltip

---

## Goals

Understand how a design-system sprint (Outpace Labs style) works in practice by
shipping **a minimum-viable token system and 4 components** — enough to seed a
real POD design system without overcommitting to architecture.

## Non-goals

- Complete component library (Modal, Select, Table, etc.) — deferred.
- Publishing to npm — `@pod/ui` and `@pod/tokens` are workspace-only.
- Build pipeline for packages — they ship raw TS/CSS; the docs site compiles
  them through Vite. Adding a package build step is a sprint-2 concern.
- Storybook — the MDX docs site is enough to review the full surface.

## Architecture

### Monorepo
pnpm workspaces. Three entries: `packages/tokens`, `packages/ui`,
`apps/docs`.

### Token strategy — two layers
1. **Primitives** (`packages/tokens/src/primitives.ts`). Raw color scales
   (neutral, blue, green, red, yellow, cyan). Stored as `"R G B"` triples so
   Tailwind can compose them with `/<alpha-value>`. Not imported by components.
2. **Semantic** (`packages/tokens/src/theme.css`). CSS custom properties
   defining the component vocabulary:
   `bg.canvas`, `text.primary`, `border.default`, `accent.*`, `danger.*`, …
   Two scopes: `:root` for light, `.dark` for dark. **This is what components
   consume.**

The bridge is `tailwind-preset.ts`: it maps each semantic CSS variable to a
Tailwind class (`bg-canvas`, `text-primary`, `border-border-default`, …).
Both the UI package and the docs site `tailwind.config.ts` extend this preset.

Radius, shadow, motion, font sizes, and font family live alongside in the
same preset.

### Dark mode
Class-based: toggle `.dark` on `<html>`. Components don't reference `dark:` —
the variable values swap and everything cascades.

### Component rules
- **TypeScript + React 18**, `forwardRef`, semicolons, plain exports.
- Classes composed via `cn()` (clsx + tailwind-merge) so consumers can override
  with `className` safely.
- Focus affordance is shared (`lib/focus-ring.ts`) — every interactive element
  uses the same keyboard ring styling.
- No hardcoded hex values in `packages/ui/src/` (verifiable by grep).
- Tooltip uses Radix primitives for accessibility. Everything else is native
  HTML + Tailwind — explicit and small.

## Delivery checklist

- [x] `pnpm install && pnpm dev` starts the docs site on port 5174
- [x] All 4 components exist with documented variants and states
- [x] Light + dark mode visible in the docs site
- [x] Components consume only semantic tokens (no hex)
- [x] Docs page per component in `apps/docs/src/pages/components/` (rendered at http://localhost:5174)
- [x] Keyboard support: Tab cycles, Enter/Space activate, Esc closes tooltip
- [x] Type check passes (`pnpm typecheck`)

## What still needs review

- **Figma alignment.** Figma files were not accessible at scaffold time —
  colors were chosen to match a generic dashboard aesthetic. When Figma is
  accessible, swap values in `theme.css` only; components won't need edits.
- **Visual QA.** The docs site covers variants × states but hasn't been
  walked through by a designer yet.
- **Accent scale completeness.** Only the 3 shades the components needed
  (`default`, `hover`, `active`) are promoted to semantic tokens. If Sprint 2
  reveals more needs (e.g. `accent-soft` for selected rows), extend `theme.css`
  and `tailwind-preset.ts` together.
- **Focus ring contrast.** The ring uses `border-focus` (`rgb(59 130 246)` in
  light, `rgb(96 165 250)` in dark). Good over both canvas colors in our
  tests, but bring through a contrast audit before shipping broadly.

## Recommended next sprints

1. **Tokens v2 (from Figma).** Pull real POD colors, type scale, radii,
   shadows from Figma into `primitives.ts` and `theme.css`. Zero component
   edits expected.
2. **Typography primitives.** Add `<Text>` / `<Heading>` components so POD
   screens stop reaching for raw Tailwind classes for text sizing.
3. **Form primitives.** `Label`, `Field`, `HelperText` shared across inputs —
   Checkbox and SearchInput currently inline label/error rendering; a single
   `Field` wrapper would dedupe that.
4. **Select / Dropdown / DatePicker.** Dashboard-critical. Use Radix for
   a11y, match the Tooltip pattern.
5. **Data display.** `Badge`, `Tag`, `Table` cell primitives — dominant in
   Positive EV, Bet Tracker, Odds Screener.
6. **Dark palette pass.** Current dark mode is functional but unreviewed.
   Dashboard dark UIs need extra contrast between `surface` and `raised`.
7. **Component tests.** Currently none — the docs site acts as the visual check.
   Introduce Vitest + Testing Library when API stability matters.
8. **Package build.** When we want to consume `@pod/ui` from the real POD repo
   without sharing `tsconfig.base.json`, add `tsup` or equivalent.
