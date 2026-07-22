# Figma Token Alignment — Design

**Date:** 2026-05-19
**Status:** Awaiting review
**Scope:** Color tokens only (radius, shadow, motion deliberately out of scope)

## Context

The pod-native-design-system codebase currently has color tokens whose names
and values have drifted from the canonical Figma source. The designer has now
exported the official Figma token system as three W3C-format JSON files:

- `Mode 1.tokens.json` — 297 primitive colors (27 chromatic ramps × 11 stops + 20 alpha stops + base black/white)
- `Light Theme.tokens.json` — 93 semantic tokens (`bg/*`, `border/*`, `fg/*`, `icon/*`, `text/*`)
- `Dark Theme.tokens.json` — 93 semantic tokens (same structure)

These three files become the source of truth. The codebase is reorganized to
mirror them exactly: same names, same values, same family taxonomy. Per the
designer's confirmation, **components in Figma reference semantic tokens
directly** — there is no separate "components" variable collection. So every
`experiment-*` token in the codebase is drift to be eliminated.

## Goal

Land a single PR that:

1. Renames every codebase token to its Figma equivalent (or deletes it if no
   equivalent exists).
2. Eliminates every `experiment-*` token (replaces them with the appropriate
   foundation semantic token).
3. Updates all 11 tracked components to use the new class names.
4. Leaves the codebase visually matching Figma's semantic system, accepting
   small drifts where the current code was wrong.

## Source-of-truth files

```
/Users/naufalirsyad/Downloads/Mode 1.tokens.json
/Users/naufalirsyad/Downloads/Semantic Color/Light Theme.tokens.json
/Users/naufalirsyad/Downloads/Semantic Color/Dark Theme.tokens.json
```

During implementation these three files are copied into the repo at
`packages/tokens/figma-exports/` for traceability. `theme.css` is generated
from them by hand-translation (no codegen; this is a one-time conversion).

---

## Section 1 — Foundation token rewrite

### Strategy

`packages/tokens/src/theme.css` color section is fully rewritten. All 93
semantic tokens are exposed per mode. Radius, shadow, glow, and motion blocks
are untouched.

### Name and family mapping

Current codebase → new Figma-aligned name:

#### Backgrounds (`bg-*`)

| Current | → New | Light | Dark | Notes |
|---|---|---|---|---|
| `bg-canvas` | `bg-canvas` | #FAFAFA | #09090B | Light value changes from #FFFFFF |
| `bg-surface` | `bg-surface` | #FFFFFF | #111113 | Light value changes from #FAFAFA |
| `bg-raised` | `bg-elevated` | #EAEAED | #1C1C1F | Renamed |
| `bg-muted` | `bg-muted` | #F4F4F5 | #18181B | Dark changes from #27272A |
| *(new)* | `bg-subtle` | #F4F4F5 | #111113 | New |
| *(new)* | `bg-disabled` | #F4F4F5 | #1C1C1F | New |
| *(new)* | `bg-inverse` | #09090B | #FAFAFA | New |
| *(new)* | `bg-neutral` | #7C7E84 | #7C7E84 | New |
| `accent-default` | `bg-brand` | **#15803D** | #15803D | Light value changes from #16A34A (brand was wrong) |
| `accent-hover` | `bg-brand-hover` | **#166534** | #15803D | Light value changes from #15803D |
| `accent-subtle` | `bg-brand-subtle` | #F0FDF4 | #0B2115 | — |
| `danger-hover` | `bg-destructive` | **#B91C1C** | #991B1B | Light value changes from #991B1B |
| `danger-active` | `bg-destructive-hover` | **#991B1B** | #991B1B | Light value changes from #7F1D1D |
| `danger-subtle` | `bg-destructive-subtle` | #FEF2F2 | #260D0E | — |
| *(new)* | `bg-error` | #DC2626 | #EF4444 | New |
| *(new)* | `bg-error-subtle` | #FEF2F2 | #260D0E | New |
| `success-default` | `bg-success` | #16A34A | #22C55E | — |
| `success-subtle` | `bg-success-subtle` | #F0FDF4 | #0B2115 | — |
| `warning-default` | `bg-warning` | #EAB308 | #EAB308 | — |
| `warning-subtle` | `bg-warning-subtle` | #FEFCE8 | #422006 | — |
| `info-default` | `bg-info` | #2563EB | #3B82F6 | — |
| `info-subtle` | `bg-info-subtle` | #EFF6FF | #172554 | — |
| `experiment-badge-{c}-bg` | `bg-badge-{c}` | (per Figma) | (per Figma) | 9 colors, mode-adaptive |

#### Borders (`border-*`)

| Current | → New | Light | Dark |
|---|---|---|---|
| `border-default` | `border-default` | #EAEAED | #18181B |
| `border-subtle` | `border-subtle` | #D4D4D8 | #3A3A3D |
| `border-strong` | `border-strong` | #D4D4D8 | #1C1C1F |
| `border-focus` | DELETE — use `border-brand` or `ring-brand` | — | — |
| *(new)* | `border-brand` | #16A34A | #16A34A |
| *(new)* | `border-destructive` | #DC2626 | #B91C1C |
| *(new)* | `border-destructive-subtle` | #FCA5A5 | #7F1D1D |
| *(new)* | `border-disabled` | #EAEAED | #3A3A3D |
| *(new)* | `border-error` | #DC2626 | #EF4444 |
| *(new)* | `border-info` | #2563EB | #3B82F6 |
| *(new)* | `border-inverse` | #09090B | #FAFAFA |
| *(new)* | `border-success` | #16A34A | #22C55E |
| *(new)* | `border-warning` | #CA8A04 | #EAB308 |

#### Text (`text-*`)

| Current | → New | Light | Dark | Notes |
|---|---|---|---|---|
| `text-primary` | `text-default` | #111113 | #F4F4F5 | Light slightly darker than current #18181B |
| `text-secondary` | `text-subtle` | #7C7E84 | #7C7E84 | — |
| `text-muted` | `text-muted` | #7C7E84 | #A1A1AA | — |
| `text-disabled` | `text-disabled` | #A1A1AA | #3A3A3D | — |
| `text-inverse` | `text-inverse` | #FAFAFA | #09090B | — |
| `accent-fg` | `text-on-brand` | #FAFAFA | #FAFAFA | — |
| *(new)* | `text-strong` | #09090B | #FAFAFA | — |
| *(new)* | `text-placeholder` | #A1A1AA | #3A3A3D | — |
| *(new)* | `text-brand` | #15803D | #4ADE80 | — |
| *(new)* | `text-success` / `text-error` / `text-warning` / `text-info` / `text-destructive` | (per Figma) | (per Figma) | — |
| *(new)* | `text-on-destructive` / `text-on-success` / `text-on-warning` / `text-on-info` | (per Figma) | (per Figma) | — |
| `experiment-badge-{c}-fg` | `text-badge-{c}` | (per Figma) | (per Figma) | 9 colors. Drops the redundant `text-` inside Figma's `text.text-badge-X` |

#### Icon (`icon-*`) — new family

Figma keeps `icon` separate from `text`. Most values are identical to `text-*`
keys, but `on-brand` diverges (text=light, icon=light, fg=dark). Codebase
gains a full `icon-*` family registered in Tailwind under `colors.icon.*`,
exposed via `text-icon-{key}` classes (the standard Tailwind `text-` utility
sets CSS `color`, which cascades to SVG `currentColor`).

Keys: `default`, `subtle`, `muted`, `strong`, `disabled`, `placeholder`,
`inverse`, `brand`, `success`, `destructive`, `error`, `warning`, `info`,
`on-brand`, `on-destructive`, `on-success`, `on-warning`, `on-info`.

#### Foreground (`fg-*`) — new family

Figma's `fg` family is for decorative foregrounds, distinct from text/icons.
Five keys: `default`, `subtle`, `disabled`, `brand`, `on-brand`. Note that
`fg.on-brand` is **dark** (#09090B light, #FAFAFA dark) — opposite of
`text.on-brand` and `icon.on-brand`. This is intentional Figma behavior.

Registered in Tailwind under `colors.fg.*`, accessible via `bg-fg-{key}`,
`text-fg-{key}`, `border-fg-{key}` as needed.

### Codebase-only tokens that survive

Not in any Figma JSON; kept as-is in `theme.css`:

- `--color-overlay` (modal backdrop, used with `/alpha`)
- `--shadow-glow-accent-*`, `--shadow-glow-danger-*`, `--shadow-glow-accent-text`
- `--shadow-foundation-*` (foundation-shadows.json, separate Figma source)
- `--radius-*`, `--duration-*`, `--ease-*`

### Tailwind preset rewrite

[packages/tokens/src/tailwind-preset.ts](../../../packages/tokens/src/tailwind-preset.ts)
exposes five color families:

```ts
theme.colors = {
  bg: { canvas, surface, elevated, muted, subtle, disabled, inverse, neutral,
        brand, 'brand-hover', 'brand-subtle',
        destructive, 'destructive-hover', 'destructive-subtle',
        error, 'error-subtle', success, 'success-subtle',
        warning, 'warning-subtle', info, 'info-subtle',
        'badge-{c}', 'badge-{c}-accent' /* 9 chromatic colors each */ },
  border: { default, subtle, strong, brand, destructive, 'destructive-subtle',
            disabled, error, info, inverse, success, warning },
  text: { default, strong, subtle, muted, disabled, placeholder, inverse,
          brand, success, destructive, error, warning, info,
          'on-brand', 'on-destructive', 'on-success', 'on-warning', 'on-info',
          'badge-{c}', 'badge-{c}-accent' /* aliased — same value as bg.badge-{c}-accent */ },
  icon: { default, strong, subtle, muted, disabled, placeholder, inverse,
          brand, success, destructive, error, warning, info,
          'on-brand', 'on-destructive', 'on-success', 'on-warning', 'on-info' },
  fg: { default, subtle, disabled, brand, 'on-brand' },
  overlay: '0 0 0', // unchanged
}
```

Removed entirely: `accent.*`, `danger.*`, all `experiment.*` keys, `border.focus`.

---

## Section 2 — Eliminate every `experiment-*` token

The codebase has 15 non-badge `experiment-*` tokens and 27
`experiment-badge-*` tokens (9 colors × 3 layers). All are removed. Mapping:

### Button (3 tokens deleted)

| Token | Replacement | Reason |
|---|---|---|
| `experiment-orange` (#F97316) | `bg-brand` | Designer confirmed: Primary Button always uses `bg-brand`. The orange variant was drift. |
| `experiment-primary-test` (#1F71FF) | `bg-brand` | Same — no blue variant exists. |
| `experiment-primary-hover-dark` (#0A662D) | `bg-brand-hover` | Hover state uses semantic `bg-brand-hover` (#166534 light, #15803D dark). |

**Visual impact**: Primary Button becomes consistently brand green across all
sizes and variants, matching Figma. Current production has orange/blue
inconsistencies that will disappear.

### TextInput (2 tokens deleted)

| Token | Replacement | Drift |
|---|---|---|
| `experiment-input-stroke-active` | `border-subtle` | Exact match both modes |
| `experiment-input-bg-focused` | `bg-subtle` | Dark exact, light shifts #FAFAFA → #F4F4F5 |

### Checkbox (3 tokens deleted)

| Token | Replacement | Drift |
|---|---|---|
| `experiment-cb-border` | `border-strong` | Light exact (#D4D4D8); dark shifts #7C7E84 → #1C1C1F |
| `experiment-cb-disabled-bg` | `bg-disabled` | Dark exact; light shifts #E4E4E7 → #F4F4F5 (lighter) |
| `experiment-cb-disabled-icon` | `icon-disabled` | Exact both modes |

### Tabs (6 tokens deleted)

| Token | Replacement | Drift |
|---|---|---|
| `experiment-tab-base` | `bg-surface` | Dark exact; light shifts #FAFAFA → #FFFFFF |
| `experiment-tab-chip` | `bg-elevated` | Dark exact; light shifts #F4F4F5 → #EAEAED |
| `experiment-tab-indigo` | Replaced via Tab refactor — see Section 3 | Not a static token; tab leading icon color is per-instance |
| `experiment-tab-border` | `border-strong` | Light exact; dark shifts #18181B → #1C1C1F |
| `experiment-tab-text` | `text-subtle` | Exact both modes |
| `experiment-tab-text-disabled` | `text-disabled` | Exact both modes |

### Misc (1 token deleted)

| Token | Replacement |
|---|---|
| `experiment-zinc-700` | `bg-elevated` (exact match in dark mode, only usage site) |

### Badges (27 tokens deleted, replaced by mode-adaptive 2+1 layer)

The Badge component currently renders 3 visual layers per chromatic variant:
outer pill, middle accent ring, inner text. Figma exports 2 mode-adaptive
tokens per color (`bg.badge-{c}` and `text.text-badge-{c}`). To preserve the
3-layer visual identity:

| Layer | Token | Source |
|---|---|---|
| Outer pill bg | `bg-badge-{c}` | Figma `bg.badge-{c}` — mode-adaptive (pastel in light, dark in dark) |
| Middle accent ring | `badge-{c}-accent` | Codebase-only, value from Figma Mode 1 primitive `{c}/500` — same in light + dark |
| Inner text | `text-badge-{c}` | Figma `text.text-badge-{c}` — mode-adaptive (chromatic in light, pastel in dark) |

`badge-{c}-accent` values (from Mode 1 primitive `{c}/500`):

| Token | Hex |
|---|---|
| `badge-orange-accent` | #F97316 |
| `badge-lime-accent` | #84CC16 |
| `badge-purple-accent` | #A855F7 |
| `badge-green-accent` | #22C55E |
| `badge-indigo-accent` | #6366F1 |
| `badge-sky-accent` | #0EA5E9 |
| `badge-blue-accent` | #3B82F6 |
| `badge-red-accent` | #EF4444 |
| `badge-yellow-accent` | #EAB308 |

These tokens are registered in Tailwind under **both** `colors.bg.*` and
`colors.text.*` so component code can use either `bg-badge-{c}-accent` (for
the middle ring fill) or `text-badge-{c}-accent` (for icon tinting reuse —
see Tab Menu/Active note in Section 3).

`badge-{c}-accent` is the only invented (non-Figma-semantic) token family in
this PR. Justified because the 3-layer Badge is a codebase design decision
Figma's semantic export doesn't model, and the user has explicitly chosen to
keep all three visual layers. The values themselves trace back to Figma Mode
1 primitives, so source-of-truth alignment is preserved.

**Visual impact**: Light-mode badges change significantly. Currently the
codebase force-renders dark-style badges in both modes (dark pill +
chromatic ring + pastel text). After this PR, light mode badges adopt
Figma's pastel-pill + chromatic-text style. Designer should review.

### Result

Zero `experiment-*` tokens remain in `theme.css`. Every color reference in
component code traces back to a Figma semantic token (or the
`bg-badge-{c}-accent` token, which is documented as primitive-derived).

---

## Section 3 — Component refactor

All 11 tracked components in `packages/ui/src/` need Tailwind class updates.
Type-checker catches stale references because the new color map deletes the
old keys.

### Class rename quick reference

Applied across all components, docs, and centernode runtime:

| Old | → New |
|---|---|
| `bg-accent-default` | `bg-brand` |
| `bg-accent-hover` | `bg-brand-hover` |
| `bg-accent-active` | `bg-brand-hover` (active state collapses; see below) |
| `bg-accent-subtle` | `bg-brand-subtle` |
| `text-accent-fg` | `text-on-brand` |
| `bg-danger-hover` | `bg-destructive` |
| `bg-danger-active` | `bg-destructive-hover` (active collapses) |
| `bg-danger-subtle` | `bg-destructive-subtle` |
| `text-danger-fg` | `text-on-destructive` |
| `text-danger` | `text-destructive` |
| `bg-raised` | `bg-elevated` |
| `text-text-{key}` | `text-{key}` (drop double-`text-`) |
| `border-border-{key}` | `border-{key}` (drop double-`border-`) |
| `ring-border-focus` | `ring-brand` |
| `bg-text-primary` | `bg-inverse` |
| `border-text-primary` | `border-inverse` |
| `bg-experiment-*` / `text-experiment-*` / `border-experiment-*` | per Section 2 mapping |

### State collapse: `-active` removed

Figma exposes only `default` and `hover` for `brand` and `destructive`. There
is no `-active`. Component press states (`:active` Tailwind) now use the same
color as `:hover`. This is intentional — Figma's hover already darkens
substantially, and the previous codebase 3-state rhythm was drift.

### Tooltip and Checkbox dark fills

Tooltip body and the checked Checkbox use the dark fill currently via
`bg-text-primary` / `border-text-primary`. New code uses `bg-inverse` /
`border-inverse`. Slight color shift in light mode (#18181B → #09090B,
slightly darker — Figma-correct).

### Tab Menu/Active icon — refactor to dynamic color

`experiment-tab-indigo` (#6366F1, the leading icon tint for Menu/Active tab
variant) is removed. The icon color in Figma is randomized per tab instance,
so it cannot be a static foundation token.

**Scope for this PR**: replace static `text-experiment-tab-indigo` reference
with `text-badge-indigo-accent` (always #6366F1 in both modes — preserves
current visual exactly). Using `text-badge-indigo` directly would be wrong
because that token is mode-adaptive (#6366F1 light, #E0E7FF pastel dark) and
would silently change the dark-mode tab icon from indigo to pastel.

**Follow-up PR (out of scope here)**: refactor Tab to accept an `iconColor`
prop or auto-cycle through the badge chromatic palette (`badge-indigo`,
`badge-orange`, `badge-lime`, `badge-purple`, etc.). Designer is the source
of truth for the cycling logic.

### Five-family Tailwind classes

After the preset rewrite, component code can use:

- `bg-{key}` for backgrounds
- `text-{key}` for body text colors
- `text-icon-{key}` for icon colors (SVG `currentColor` cascade)
- `text-fg-{key}` / `bg-fg-{key}` for decorative foregrounds
- `border-{key}` for borders

Convention: use the prefix matching intent. Body text → `text-default`. Icon
SVG → `text-icon-default`. Decorative dot/divider → `bg-fg-default`. Most
values are identical across families, but the distinction documents intent
and protects against future Figma value divergence (e.g., `on-brand`).

### Files touched

```
packages/tokens/src/theme.css                  — full color section rewrite
packages/tokens/src/tailwind-preset.ts         — color map rewrite
packages/ui/src/button/button.tsx
packages/ui/src/checkbox/checkbox.tsx
packages/ui/src/dropdown/dropdown.tsx
packages/ui/src/tabs/tabs.tsx
packages/ui/src/tabs-menu/tabs-menu.tsx
packages/ui/src/text-input/text-input.tsx
packages/ui/src/search-input/search-input.tsx
packages/ui/src/badges/badges.tsx
packages/ui/src/tooltip/tooltip.tsx
packages/ui/src/lib/focus-ring.ts
apps/docs/src/**/*.mdx                         — sweep for old class names
apps/docs/src/components/docs/*.tsx            — sweep for old class names
centernode/src/utils/cfRuntime.js             — sweep for old token names
packages/tokens/figma-exports/Mode 1.tokens.json              — new file (traceability)
packages/tokens/figma-exports/Light Theme.tokens.json         — new file
packages/tokens/figma-exports/Dark Theme.tokens.json          — new file
```

Untouched:
- `packages/tokens/src/theme.css` radius/shadow/glow/motion blocks
- `.figma/variables/*.json` per-component caches
- `.figma/manifest.json`, `.figma/snapshots.json`

---

## Section 4 — Rollout and verification

### Execution order (single PR)

1. Copy three JSON exports to `packages/tokens/figma-exports/`.
2. Rewrite `theme.css` color section.
3. Rewrite `tailwind-preset.ts` color map.
4. `pnpm typecheck` — catches every stale class reference in components.
5. Update component .tsx files until typecheck is clean.
6. Sweep `apps/docs/` and `centernode/` for stale class strings (`grep -rE 'experiment-|accent-|text-text-|border-border-|bg-raised|border-focus'`).
7. `pnpm build` for tokens and ui packages.
8. `pnpm dev` on `apps/docs/`, walk every component page, capture before/after.

### Pass criteria

- `pnpm typecheck` clean.
- `pnpm --filter cf-tokens build` clean.
- `pnpm --filter cf-ui build` clean.
- No grep hits for old token names anywhere in `packages/`, `apps/docs/`, `centernode/src/`.
- `node scripts/figma/check.mjs` reports IN SYNC for all 11 tracked components (we haven't touched component Figma nodes, only renamed local tokens — so per-component caches stay valid).
- Visual smoke pass against `apps/docs/` for all 11 components.

### Known visual shifts (designer should review)

| Change | Effect |
|---|---|
| `bg-canvas` light: #FFF → #FAFAFA | Page background slightly grayer |
| `bg-surface` light: #FAFAFA → #FFF | Cards/inputs slightly whiter |
| `bg-brand` light: #16A34A → #15803D | Brand green one step darker |
| `bg-brand-hover` light: #15803D → #166534 | Hover state one step darker |
| Primary Button: orange/blue → brand green | Consistent brand color across all sizes |
| Light-mode badges: dark-style → pastel-style | Visual identity shift, mode-correct now |
| Tooltip body, checked Checkbox: #18181B → #09090B | Slightly darker in light mode |
| Active state on Button etc.: dedicated darker → same as hover | Press response loses 1 step of color depth |
| Various tab/checkbox/input states: 1-step zinc shift | Subtle drift, Figma-correct |

### Risks

- **String-template class usage won't fail typecheck.** Mitigation: explicit grep sweep before merging. Listed in pass criteria.
- **Centernode and client-test consume `cf-ui` via npm.** Per CLAUDE.md, local changes here won't show in deployed centernode until `/publish` runs and bumps centernode's dependency. Out of scope for this PR; `/publish` is a separate user-triggered command.
- **Designer surprise on light-mode badge restyle.** Visual is genuinely different from current. Flag explicitly in the PR description.
- **Tab Menu/Active still hardcoded to indigo.** Acceptable for this PR (preserves current visual), but the follow-up Tab refactor PR needs to happen before any production use of randomized Tab icons.

## Out of scope

- Radius, shadow, glow, motion tokens — not in the three JSON exports.
- `.figma/variables/*.json` per-component caches — separate sync mechanism (`/refresh-vars`, `/sync-figma`) untouched.
- Tab component refactor for dynamic icon color — follow-up PR.
- Publishing new `cf-ui` to npm — separate `/publish` flow.
- Code Connect mappings, Storybook, snapshot tests (none exist in this repo).
- Writing Figma changes back to the file.

## Designer follow-ups

After merge, the designer reviews `apps/docs/` and confirms:

1. Light-mode badge restyle (pastel pill, chromatic text) is correct.
2. Primary Button consistently green across all sizes is intended.
3. The 1-step shifts in tab/checkbox/input states (light-mode lightening,
   dark-mode subtle changes) are acceptable.
4. Specs the eventual Tab icon randomization logic for the follow-up PR.
