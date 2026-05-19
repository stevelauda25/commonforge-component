# Figma Token Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all color tokens in the codebase with the Figma source-of-truth equivalents from three Tokens Studio JSON exports (Mode 1 primitives, Light/Dark semantic themes). Eliminate every `experiment-*` token. Update all 9 components and ~27 docs files to use the new class names.

**Architecture:** Single PR, big-bang rewrite of `theme.css` + `tailwind-preset.ts` (the two source-of-truth files), followed by mechanical per-file class renames in components and docs. No new tests added (this codebase has no test suite); verification uses TypeScript typecheck + Tailwind build + visual smoke on the docs site.

**Tech Stack:** CSS custom properties, Tailwind v3 preset, React 18 + TypeScript, tsup, pnpm workspaces.

**Spec reference:** [`docs/superpowers/specs/2026-05-19-figma-token-alignment-design.md`](../specs/2026-05-19-figma-token-alignment-design.md)

---

## Important conventions

**No test framework.** Verify each task by running:
- `pnpm --filter pod-test-tokens build` after changing `theme.css` / `tailwind-preset.ts`
- `pnpm --filter pod-test-ui build` after changing any component
- `pnpm typecheck` for full repo
- `grep -rE '<pattern>' <path>` to confirm a rename swept everything

**Commit after every task.** Per CLAUDE.md, do NOT auto-push. User commits authorship is `Steve Lauda <eng@blissful.design>`.

**Tailwind class mapping reference** (used across many tasks):

| Old class | → New class |
|---|---|
| `bg-accent` | `bg-brand` |
| `bg-accent-hover` | `bg-brand-hover` |
| `bg-accent-active` | `bg-brand-hover` *(active collapses to hover)* |
| `bg-accent-subtle` | `bg-brand-subtle` |
| `text-accent-fg` | `text-on-brand` |
| `bg-danger` | `bg-destructive` |
| `bg-danger-hover` | `bg-destructive` |
| `bg-danger-active` | `bg-destructive-hover` |
| `bg-danger-subtle` | `bg-destructive-subtle` |
| `text-danger-fg` | `text-on-destructive` |
| `text-danger` | `text-destructive` |
| `text-info-fg` | `text-on-info` |
| `text-warning-fg` | `text-on-warning` |
| `bg-raised` | `bg-elevated` |
| `text-text-primary` | `text-default` |
| `text-text-secondary` | `text-subtle` |
| `text-text-muted` | `text-muted` |
| `text-text-disabled` | `text-disabled` |
| `text-text-inverse` | `text-inverse` |
| `border-border-subtle` | `border-subtle` |
| `border-border-default` | `border-default` |
| `border-border-strong` | `border-strong` |
| `outline-border-default` | `outline-default` |
| `ring-border-focus` | `ring-brand` |
| `bg-text-primary` | `bg-inverse` |
| `border-text-primary` | `border-inverse` |
| `text-canvas` *(checkbox icon)* | `text-inverse` |
| `bg-experiment-orange`, `bg-experiment-primary-test` | `bg-brand` |
| `bg-experiment-primary-hover-dark` | `bg-brand-hover` |
| `border-experiment-input-stroke-active` | `border-subtle` |
| `bg-experiment-input-bg-focused` | `bg-subtle` |
| `border-experiment-cb-border` | `border-strong` |
| `bg-experiment-cb-disabled-bg`, `border-experiment-cb-disabled-bg` | `bg-disabled`, `border-disabled` |
| `text-experiment-cb-disabled-icon` | `text-icon-disabled` |
| `bg-experiment-tab-base` | `bg-surface` |
| `bg-experiment-tab-chip` | `bg-elevated` |
| `text-experiment-tab-indigo` | `text-badge-indigo-accent` |
| `border-experiment-tab-border` | `border-strong` |
| `text-experiment-tab-text` | `text-subtle` |
| `text-experiment-tab-text-disabled` | `text-disabled` |
| `bg-experiment-zinc-700` | `bg-elevated` |
| `bg-experiment-badge-{c}-bg` | `bg-badge-{c}` *(9 colors, mode-adaptive)* |
| `bg-experiment-badge-{c}-tag` | `bg-badge-{c}-accent` *(new component-scoped token)* |
| `text-experiment-badge-{c}-fg` | `text-badge-{c}` |

Save this table for reference during component refactor tasks.

---

## Task 1: Add Figma JSON exports to repo

**Files:**
- Create: `packages/tokens/figma-exports/Mode 1.tokens.json`
- Create: `packages/tokens/figma-exports/Light Theme.tokens.json`
- Create: `packages/tokens/figma-exports/Dark Theme.tokens.json`
- Create: `packages/tokens/figma-exports/README.md`

These files become the canonical record of the Figma export this PR is based on, so future reviewers can diff against a future export.

- [ ] **Step 1: Create the exports directory and copy JSON files**

```bash
mkdir -p packages/tokens/figma-exports
cp "/Users/naufalirsyad/Downloads/Mode 1.tokens.json" packages/tokens/figma-exports/
cp "/Users/naufalirsyad/Downloads/Semantic Color/Light Theme.tokens.json" packages/tokens/figma-exports/
cp "/Users/naufalirsyad/Downloads/Semantic Color/Dark Theme.tokens.json" packages/tokens/figma-exports/
```

- [ ] **Step 2: Create README**

Write `packages/tokens/figma-exports/README.md`:

```markdown
# Figma token exports

Canonical Figma variable exports in W3C Tokens Studio format. These three
files are the source of truth for the color section of `../src/theme.css`.

- `Mode 1.tokens.json` — 297 primitives across 27 chromatic ramps + alpha + base
- `Light Theme.tokens.json` — 93 semantic tokens (`bg`, `border`, `fg`, `icon`, `text`) for light mode
- `Dark Theme.tokens.json` — same semantic structure for dark mode

When Figma changes, replace these files and update `theme.css` to match.
Do not hand-edit these files.
```

- [ ] **Step 3: Verify files copied**

Run: `ls -la packages/tokens/figma-exports/`
Expected: 4 files (3 JSON + README.md).

- [ ] **Step 4: Commit**

```bash
git add packages/tokens/figma-exports/
git commit -m "chore(tokens): add canonical Figma token exports

Snapshot of Figma's Tokens Studio export for the color system.
Source of truth for the upcoming theme.css rewrite."
```

---

## Task 2: Rewrite `theme.css` color section

**Files:**
- Modify: `packages/tokens/src/theme.css` (lines 12-271, color section + experimental + badges)

Replace the entire `:root` and `.dark` blocks (preserving the radius/shadow/glow/motion blocks at the end of `:root` and the same blocks in `.dark`).

- [ ] **Step 1: Read the current `theme.css` to confirm structure**

Run: `wc -l packages/tokens/src/theme.css`
Expected: 296 lines.

- [ ] **Step 2: Overwrite `theme.css` with the new content**

Use the Write tool with this exact content:

```css
/*
 * Semantic theme tokens — light + dark.
 *
 * Sourced from Figma exports in packages/tokens/figma-exports/.
 *
 * Values are "R G B" triples (no `rgb()` wrapper), so Tailwind can compose them
 * with opacity modifiers via the `<alpha-value>` placeholder in
 * tailwind-preset.ts. Example: `bg-canvas/80` → rgb(var(--color-bg-canvas) / 0.8).
 *
 * Components consume the Tailwind class names (bg-canvas, text-default, …).
 * They never read these variables directly.
 */

:root {
  /* ── Backgrounds ──────────────────────────────────────────────────── */
  --color-bg-canvas:        250 250 250;   /* #FAFAFA */
  --color-bg-surface:       255 255 255;   /* #FFFFFF */
  --color-bg-elevated:      234 234 237;   /* #EAEAED */
  --color-bg-muted:         244 244 245;   /* #F4F4F5 */
  --color-bg-subtle:        244 244 245;   /* #F4F4F5 */
  --color-bg-disabled:      244 244 245;   /* #F4F4F5 */
  --color-bg-inverse:         9   9  11;   /* #09090B */
  --color-bg-neutral:       124 126 132;   /* #7C7E84 */
  --color-bg-brand:          21 128  61;   /* #15803D */
  --color-bg-brand-hover:    22 101  52;   /* #166534 */
  --color-bg-brand-subtle:  240 253 244;   /* #F0FDF4 */
  --color-bg-destructive:        185  28  28;  /* #B91C1C */
  --color-bg-destructive-hover:  153  27  27;  /* #991B1B */
  --color-bg-destructive-subtle: 254 242 242;  /* #FEF2F2 */
  --color-bg-error:          220  38  38;  /* #DC2626 */
  --color-bg-error-subtle:   254 242 242;  /* #FEF2F2 */
  --color-bg-success:         22 163  74;  /* #16A34A */
  --color-bg-success-subtle: 240 253 244;  /* #F0FDF4 */
  --color-bg-warning:        234 179   8;  /* #EAB308 */
  --color-bg-warning-subtle: 254 252 232;  /* #FEFCE8 */
  --color-bg-info:            37  99 235;  /* #2563EB */
  --color-bg-info-subtle:    239 246 255;  /* #EFF6FF */

  /* Badge backgrounds — pastel pill in light, dark pill in dark */
  --color-bg-badge-green:    240 253 244;  /* #F0FDF4 */
  --color-bg-badge-blue:     239 246 255;  /* #EFF6FF */
  --color-bg-badge-orange:   255 247 237;  /* #FFF7ED */
  --color-bg-badge-lime:     247 254 231;  /* #F7FEE7 */
  --color-bg-badge-indigo:   238 242 255;  /* #EEF2FF */
  --color-bg-badge-red:      254 242 242;  /* #FEF2F2 */
  --color-bg-badge-purple:   250 245 255;  /* #FAF5FF */
  --color-bg-badge-sky:      240 249 255;  /* #F0F9FF */
  --color-bg-badge-yellow:   254 252 232;  /* #FEFCE8 */

  /* Badge middle-ring accent — primitive {color}/500, same in both modes */
  --color-badge-orange-accent: 249 115  22;  /* #F97316 */
  --color-badge-lime-accent:   132 204  22;  /* #84CC16 */
  --color-badge-purple-accent: 168  85 247;  /* #A855F7 */
  --color-badge-green-accent:   34 197  94;  /* #22C55E */
  --color-badge-indigo-accent:  99 102 241;  /* #6366F1 */
  --color-badge-sky-accent:     14 165 233;  /* #0EA5E9 */
  --color-badge-blue-accent:    59 130 246;  /* #3B82F6 */
  --color-badge-red-accent:    239  68  68;  /* #EF4444 */
  --color-badge-yellow-accent: 234 179   8;  /* #EAB308 */

  /* ── Borders ──────────────────────────────────────────────────────── */
  --color-border-default:           234 234 237;  /* #EAEAED */
  --color-border-subtle:            212 212 216;  /* #D4D4D8 */
  --color-border-strong:            212 212 216;  /* #D4D4D8 */
  --color-border-brand:              22 163  74;  /* #16A34A */
  --color-border-destructive:       220  38  38;  /* #DC2626 */
  --color-border-destructive-subtle: 252 165 165; /* #FCA5A5 */
  --color-border-disabled:          234 234 237;  /* #EAEAED */
  --color-border-error:             220  38  38;  /* #DC2626 */
  --color-border-info:               37  99 235;  /* #2563EB */
  --color-border-inverse:             9   9  11;  /* #09090B */
  --color-border-success:            22 163  74;  /* #16A34A */
  --color-border-warning:           202 138   4;  /* #CA8A04 */

  /* ── Text ─────────────────────────────────────────────────────────── */
  --color-text-default:        17  17  19;  /* #111113 */
  --color-text-strong:          9   9  11;  /* #09090B */
  --color-text-subtle:        124 126 132;  /* #7C7E84 */
  --color-text-muted:         124 126 132;  /* #7C7E84 */
  --color-text-disabled:      161 161 170;  /* #A1A1AA */
  --color-text-placeholder:   161 161 170;  /* #A1A1AA */
  --color-text-inverse:       250 250 250;  /* #FAFAFA */
  --color-text-brand:          21 128  61;  /* #15803D */
  --color-text-success:        21 128  61;  /* #15803D */
  --color-text-destructive:   220  38  38;  /* #DC2626 */
  --color-text-error:         220  38  38;  /* #DC2626 */
  --color-text-warning:       161  98   7;  /* #A16207 */
  --color-text-info:           29  78 216;  /* #1D4ED8 */
  --color-text-on-brand:       250 250 250; /* #FAFAFA */
  --color-text-on-destructive: 250 250 250; /* #FAFAFA */
  --color-text-on-success:     250 250 250; /* #FAFAFA */
  --color-text-on-warning:       9   9  11; /* #09090B */
  --color-text-on-info:        250 250 250; /* #FAFAFA */

  /* Badge text — chromatic in light, pastel in dark */
  --color-text-badge-green:   34 197  94;   /* #22C55E */
  --color-text-badge-blue:    59 130 246;   /* #3B82F6 */
  --color-text-badge-orange: 249 115  22;   /* #F97316 */
  --color-text-badge-lime:   132 204  22;   /* #84CC16 */
  --color-text-badge-indigo:  99 102 241;   /* #6366F1 */
  --color-text-badge-red:    239  68  68;   /* #EF4444 */
  --color-text-badge-purple: 168  85 247;   /* #A855F7 */
  --color-text-badge-sky:     14 165 233;   /* #0EA5E9 */
  --color-text-badge-yellow: 234 179   8;   /* #EAB308 */

  /* ── Icon ─────────────────────────────────────────────────────────── */
  --color-icon-default:        17  17  19;  /* #111113 */
  --color-icon-strong:          9   9  11;  /* #09090B */
  --color-icon-subtle:        124 126 132;  /* #7C7E84 */
  --color-icon-muted:         161 161 170;  /* #A1A1AA */
  --color-icon-disabled:      161 161 170;  /* #A1A1AA */
  --color-icon-placeholder:   161 161 170;  /* #A1A1AA */
  --color-icon-inverse:       250 250 250;  /* #FAFAFA */
  --color-icon-brand:          21 128  61;  /* #15803D */
  --color-icon-success:        21 128  61;  /* #15803D */
  --color-icon-destructive:   220  38  38;  /* #DC2626 */
  --color-icon-error:         220  38  38;  /* #DC2626 */
  --color-icon-warning:       161  98   7;  /* #A16207 */
  --color-icon-info:           29  78 216;  /* #1D4ED8 */
  --color-icon-on-brand:       250 250 250; /* #FAFAFA */
  --color-icon-on-destructive: 250 250 250; /* #FAFAFA */
  --color-icon-on-success:     250 250 250; /* #FAFAFA */
  --color-icon-on-warning:       9   9  11; /* #09090B */
  --color-icon-on-info:        250 250 250; /* #FAFAFA */

  /* ── Foreground (decorative) ──────────────────────────────────────── */
  --color-fg-default:    17  17  19;  /* #111113 */
  --color-fg-subtle:    234 234 237;  /* #EAEAED */
  --color-fg-disabled:  234 234 237;  /* #EAEAED */
  --color-fg-brand:      22 163  74;  /* #16A34A */
  --color-fg-on-brand:    9   9  11;  /* #09090B — NOTE: intentionally dark on brand bg */

  /* ── Overlays ─────────────────────────────────────────────────────── */
  --color-overlay: 0 0 0;           /* used with /alpha */

  /* ── Radius ───────────────────────────────────────────────────────── */
  --radius-none: 0px;
  --radius-xxs:  2px;
  --radius-xs:   4px;
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   10px;
  --radius-xl:   12px;
  --radius-2xl:  16px;
  --radius-3xl:  20px;
  --radius-4xl:  24px;
  --radius-full: 9999px;

  /* ── Shadows ──────────────────────────────────────────────────────── */
  --shadow-foundation-xs:  0 2px 2px 0 rgb(0 0 0 / 0.08);
  --shadow-foundation-sm:
    0 4px 4px 0 rgb(0 0 0 / 0.08),
    0 2px 2px 0 rgb(0 0 0 / 0.04);
  --shadow-foundation-md:
    0 4px 8px 0 rgb(0 0 0 / 0.08),
    0 2px 4px 0 rgb(0 0 0 / 0.04);
  --shadow-foundation-lg:
    0 8px 12px 0 rgb(0 0 0 / 0.08),
    0 4px 8px 0 rgb(0 0 0 / 0.04);
  --shadow-foundation-xl:
    0 16px 20px 0 rgb(0 0 0 / 0.08),
    0 12px 16px 0 rgb(0 0 0 / 0.04);
  --shadow-foundation-2xl:
    0 24px 32px 0 rgb(0 0 0 / 0.08),
    0 20px 24px 0 rgb(0 0 0 / 0.04);
  --shadow-foundation-3xl:
    0 32px 40px 0 rgb(0 0 0 / 0.08),
    0 24px 32px 0 rgb(0 0 0 / 0.04);

  /* ── Glow effects (brand) ─────────────────────────────────────────── */
  --shadow-glow-accent-inset:
    inset 0 0 4px rgb(194 255 204 / 0.25);
  --shadow-glow-accent-inset-strong:
    inset 0 0 4px rgb(194 255 204 / 0.25),
    inset 0 0 12px 4px rgb(194 255 204 / 0.25);
  --shadow-glow-danger-inset:
    inset 0 0 4px rgb(254 202 202 / 0.25);
  --shadow-glow-danger-inset-strong:
    inset 0 0 4px rgb(254 202 202 / 0.25),
    inset 0 0 12px 4px rgb(254 202 202 / 0.25);
  --shadow-glow-accent-text: 0 0 11px rgb(28 175 89);

  /* ── Motion ───────────────────────────────────────────────────────── */
  --duration-fast:  120ms;
  --duration-base:  180ms;
  --duration-slow:  240ms;
  --ease-standard:   cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized: cubic-bezier(0.3, 0, 0.8, 0.15);
  --ease-press:      cubic-bezier(0.25, 1, 0.5, 1);
}

.dark {
  /* ── Backgrounds ──────────────────────────────────────────────────── */
  --color-bg-canvas:          9   9  11;   /* #09090B */
  --color-bg-surface:        17  17  19;   /* #111113 */
  --color-bg-elevated:       28  28  31;   /* #1C1C1F */
  --color-bg-muted:          24  24  27;   /* #18181B */
  --color-bg-subtle:         17  17  19;   /* #111113 */
  --color-bg-disabled:       28  28  31;   /* #1C1C1F */
  --color-bg-inverse:       250 250 250;   /* #FAFAFA */
  --color-bg-neutral:       124 126 132;   /* #7C7E84 */
  --color-bg-brand:          21 128  61;   /* #15803D */
  --color-bg-brand-hover:    21 128  61;   /* #15803D */
  --color-bg-brand-subtle:   11  33  21;   /* #0B2115 */
  --color-bg-destructive:        153  27  27;  /* #991B1B */
  --color-bg-destructive-hover:  153  27  27;  /* #991B1B */
  --color-bg-destructive-subtle:  38  13  14;  /* #260D0E */
  --color-bg-error:          239  68  68;  /* #EF4444 */
  --color-bg-error-subtle:    38  13  14;  /* #260D0E */
  --color-bg-success:         34 197  94;  /* #22C55E */
  --color-bg-success-subtle:  11  33  21;  /* #0B2115 */
  --color-bg-warning:        234 179   8;  /* #EAB308 */
  --color-bg-warning-subtle:  66  32   6;  /* #422006 */
  --color-bg-info:            59 130 246;  /* #3B82F6 */
  --color-bg-info-subtle:     23  37  84;  /* #172554 */

  --color-bg-badge-green:    11  33  21;   /* #0B2115 */
  --color-bg-badge-blue:     23  37  84;   /* #172554 */
  --color-bg-badge-orange:   67  20   7;   /* #431407 */
  --color-bg-badge-lime:     26  46   5;   /* #1A2E05 */
  --color-bg-badge-indigo:   30  27  75;   /* #1E1B4B */
  --color-bg-badge-red:      38  13  14;   /* #260D0E */
  --color-bg-badge-purple:   59   7 100;   /* #3B0764 */
  --color-bg-badge-sky:       8  47  73;   /* #082F49 */
  --color-bg-badge-yellow:   66  32   6;   /* #422006 */

  /* badge-{c}-accent: same values in dark (primitive 500 stops) */
  --color-badge-orange-accent: 249 115  22;
  --color-badge-lime-accent:   132 204  22;
  --color-badge-purple-accent: 168  85 247;
  --color-badge-green-accent:   34 197  94;
  --color-badge-indigo-accent:  99 102 241;
  --color-badge-sky-accent:     14 165 233;
  --color-badge-blue-accent:    59 130 246;
  --color-badge-red-accent:    239  68  68;
  --color-badge-yellow-accent: 234 179   8;

  /* ── Borders ──────────────────────────────────────────────────────── */
  --color-border-default:           24  24  27;   /* #18181B */
  --color-border-subtle:            58  58  61;   /* #3A3A3D */
  --color-border-strong:            28  28  31;   /* #1C1C1F */
  --color-border-brand:             22 163  74;   /* #16A34A */
  --color-border-destructive:      185  28  28;   /* #B91C1C */
  --color-border-destructive-subtle: 127  29  29; /* #7F1D1D */
  --color-border-disabled:          58  58  61;   /* #3A3A3D */
  --color-border-error:            239  68  68;   /* #EF4444 */
  --color-border-info:              59 130 246;   /* #3B82F6 */
  --color-border-inverse:          250 250 250;   /* #FAFAFA */
  --color-border-success:           34 197  94;   /* #22C55E */
  --color-border-warning:          234 179   8;   /* #EAB308 */

  /* ── Text ─────────────────────────────────────────────────────────── */
  --color-text-default:       244 244 245;  /* #F4F4F5 */
  --color-text-strong:        250 250 250;  /* #FAFAFA */
  --color-text-subtle:        124 126 132;  /* #7C7E84 */
  --color-text-muted:         161 161 170;  /* #A1A1AA */
  --color-text-disabled:       58  58  61;  /* #3A3A3D */
  --color-text-placeholder:    58  58  61;  /* #3A3A3D */
  --color-text-inverse:         9   9  11;  /* #09090B */
  --color-text-brand:          74 222 128;  /* #4ADE80 */
  --color-text-success:        74 222 128;  /* #4ADE80 */
  --color-text-destructive:   248 113 113;  /* #F87171 */
  --color-text-error:         239  68  68;  /* #EF4444 */
  --color-text-warning:       250 204  21;  /* #FACC15 */
  --color-text-info:           96 165 250;  /* #60A5FA */
  --color-text-on-brand:       250 250 250; /* #FAFAFA */
  --color-text-on-destructive: 250 250 250; /* #FAFAFA */
  --color-text-on-success:     250 250 250; /* #FAFAFA */
  --color-text-on-warning:       9   9  11; /* #09090B */
  --color-text-on-info:        250 250 250; /* #FAFAFA */

  --color-text-badge-green:  220 252 231;   /* #DCFCE7 */
  --color-text-badge-blue:   219 234 254;   /* #DBEAFE */
  --color-text-badge-orange: 255 237 213;   /* #FFEDD5 */
  --color-text-badge-lime:   236 252 203;   /* #ECFCCB */
  --color-text-badge-indigo: 224 231 255;   /* #E0E7FF */
  --color-text-badge-red:    254 226 226;   /* #FEE2E2 */
  --color-text-badge-purple: 243 232 255;   /* #F3E8FF */
  --color-text-badge-sky:    224 242 254;   /* #E0F2FE */
  --color-text-badge-yellow: 254 249 195;   /* #FEF9C3 */

  /* ── Icon ─────────────────────────────────────────────────────────── */
  --color-icon-default:       244 244 245;  /* #F4F4F5 */
  --color-icon-strong:        250 250 250;  /* #FAFAFA */
  --color-icon-subtle:        124 126 132;  /* #7C7E84 */
  --color-icon-muted:         161 161 170;  /* #A1A1AA */
  --color-icon-disabled:       58  58  61;  /* #3A3A3D */
  --color-icon-placeholder:    58  58  61;  /* #3A3A3D */
  --color-icon-inverse:         9   9  11;  /* #09090B */
  --color-icon-brand:          74 222 128;  /* #4ADE80 */
  --color-icon-success:        74 222 128;  /* #4ADE80 */
  --color-icon-destructive:   248 113 113;  /* #F87171 */
  --color-icon-error:         239  68  68;  /* #EF4444 */
  --color-icon-warning:       250 204  21;  /* #FACC15 */
  --color-icon-info:           96 165 250;  /* #60A5FA */
  --color-icon-on-brand:       250 250 250; /* #FAFAFA */
  --color-icon-on-destructive: 250 250 250; /* #FAFAFA */
  --color-icon-on-success:     250 250 250; /* #FAFAFA */
  --color-icon-on-warning:       9   9  11; /* #09090B */
  --color-icon-on-info:        250 250 250; /* #FAFAFA */

  /* ── Foreground ───────────────────────────────────────────────────── */
  --color-fg-default:   244 244 245;  /* #F4F4F5 */
  --color-fg-subtle:     58  58  61;  /* #3A3A3D */
  --color-fg-disabled:   58  58  61;  /* #3A3A3D */
  --color-fg-brand:      34 197  94;  /* #22C55E */
  --color-fg-on-brand:  250 250 250;  /* #FAFAFA */

  /* Foundation shadows — same values in dark mode */
  --shadow-foundation-xs:  0 2px 2px 0 rgb(0 0 0 / 0.08);
  --shadow-foundation-sm:
    0 4px 4px 0 rgb(0 0 0 / 0.08),
    0 2px 2px 0 rgb(0 0 0 / 0.04);
  --shadow-foundation-md:
    0 4px 8px 0 rgb(0 0 0 / 0.08),
    0 2px 4px 0 rgb(0 0 0 / 0.04);
  --shadow-foundation-lg:
    0 8px 12px 0 rgb(0 0 0 / 0.08),
    0 4px 8px 0 rgb(0 0 0 / 0.04);
  --shadow-foundation-xl:
    0 16px 20px 0 rgb(0 0 0 / 0.08),
    0 12px 16px 0 rgb(0 0 0 / 0.04);
  --shadow-foundation-2xl:
    0 24px 32px 0 rgb(0 0 0 / 0.08),
    0 20px 24px 0 rgb(0 0 0 / 0.04);
  --shadow-foundation-3xl:
    0 32px 40px 0 rgb(0 0 0 / 0.08),
    0 24px 32px 0 rgb(0 0 0 / 0.04);
}
```

- [ ] **Step 3: Verify the file structure**

Run: `head -10 packages/tokens/src/theme.css && echo '...' && tail -10 packages/tokens/src/theme.css`
Expected: First lines show the new comment, last lines show `--shadow-foundation-3xl` and closing brace.

Run: `grep -c '^  --color-' packages/tokens/src/theme.css`
Expected: ~150 lines (combined light + dark color tokens).

Run: `grep 'experiment-' packages/tokens/src/theme.css`
Expected: NO matches (all experiment-* removed).

- [ ] **Step 4: Commit**

```bash
git add packages/tokens/src/theme.css
git commit -m "feat(tokens): rewrite theme.css color section per Figma source

Replace all color tokens (light + dark) with Figma's W3C semantic export.
Adds bg/border/text/icon/fg families. Removes all experiment-* tokens.
Renames accent/danger to brand/destructive per Figma names.

Radius, shadow, glow, motion blocks unchanged."
```

---

## Task 3: Rewrite `tailwind-preset.ts`

**Files:**
- Modify: `packages/tokens/src/tailwind-preset.ts` (full rewrite)

- [ ] **Step 1: Overwrite the file**

Write `packages/tokens/src/tailwind-preset.ts`:

```ts
import type { Config } from 'tailwindcss';

/**
 * Tailwind preset — the single bridge between CSS variables in theme.css
 * and the utility classes used by components.
 *
 * Token families match Figma's variable collection: bg, border, text,
 * icon, fg. Each family is registered as a nested map so Tailwind generates
 * clean classes (`bg-brand`, `text-default`, `border-subtle`).
 *
 * Icon and fg tokens are aliased into the text family so SVG color cascade
 * via `text-icon-default` / `text-fg-default` works. Badge-accent tokens
 * (component-scoped, 3rd badge layer) are registered in both bg and text
 * so consumers can use either prefix.
 */

const rgbVar = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const BADGE_COLORS = [
  'orange', 'lime', 'purple', 'green', 'indigo', 'sky', 'blue', 'red', 'yellow',
] as const;

const badgeAccentBg = Object.fromEntries(
  BADGE_COLORS.map((c) => [`badge-${c}-accent`, `rgb(var(--color-badge-${c}-accent) / <alpha-value>)`]),
);
const badgeBg = Object.fromEntries(
  BADGE_COLORS.map((c) => [`badge-${c}`, rgbVar(`bg-badge-${c}`)]),
);
const badgeText = Object.fromEntries(
  BADGE_COLORS.map((c) => [`badge-${c}`, rgbVar(`text-badge-${c}`)]),
);
const badgeTextAccent = Object.fromEntries(
  BADGE_COLORS.map((c) => [`badge-${c}-accent`, `rgb(var(--color-badge-${c}-accent) / <alpha-value>)`]),
);

export const preset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          canvas:   rgbVar('bg-canvas'),
          surface:  rgbVar('bg-surface'),
          elevated: rgbVar('bg-elevated'),
          muted:    rgbVar('bg-muted'),
          subtle:   rgbVar('bg-subtle'),
          disabled: rgbVar('bg-disabled'),
          inverse:  rgbVar('bg-inverse'),
          neutral:  rgbVar('bg-neutral'),
          brand:               rgbVar('bg-brand'),
          'brand-hover':       rgbVar('bg-brand-hover'),
          'brand-subtle':      rgbVar('bg-brand-subtle'),
          destructive:         rgbVar('bg-destructive'),
          'destructive-hover': rgbVar('bg-destructive-hover'),
          'destructive-subtle': rgbVar('bg-destructive-subtle'),
          error:           rgbVar('bg-error'),
          'error-subtle':  rgbVar('bg-error-subtle'),
          success:          rgbVar('bg-success'),
          'success-subtle': rgbVar('bg-success-subtle'),
          warning:          rgbVar('bg-warning'),
          'warning-subtle': rgbVar('bg-warning-subtle'),
          info:           rgbVar('bg-info'),
          'info-subtle':  rgbVar('bg-info-subtle'),
          ...badgeBg,
          ...badgeAccentBg,
        },
        border: {
          default:               rgbVar('border-default'),
          subtle:                rgbVar('border-subtle'),
          strong:                rgbVar('border-strong'),
          brand:                 rgbVar('border-brand'),
          destructive:           rgbVar('border-destructive'),
          'destructive-subtle':  rgbVar('border-destructive-subtle'),
          disabled:              rgbVar('border-disabled'),
          error:                 rgbVar('border-error'),
          info:                  rgbVar('border-info'),
          inverse:               rgbVar('border-inverse'),
          success:               rgbVar('border-success'),
          warning:               rgbVar('border-warning'),
        },
        text: {
          default:     rgbVar('text-default'),
          strong:      rgbVar('text-strong'),
          subtle:      rgbVar('text-subtle'),
          muted:       rgbVar('text-muted'),
          disabled:    rgbVar('text-disabled'),
          placeholder: rgbVar('text-placeholder'),
          inverse:     rgbVar('text-inverse'),
          brand:       rgbVar('text-brand'),
          success:     rgbVar('text-success'),
          destructive: rgbVar('text-destructive'),
          error:       rgbVar('text-error'),
          warning:     rgbVar('text-warning'),
          info:        rgbVar('text-info'),
          'on-brand':       rgbVar('text-on-brand'),
          'on-destructive': rgbVar('text-on-destructive'),
          'on-success':     rgbVar('text-on-success'),
          'on-warning':     rgbVar('text-on-warning'),
          'on-info':        rgbVar('text-on-info'),
          // icon aliases — for SVG color cascade (text-icon-default, etc.)
          'icon-default':        rgbVar('icon-default'),
          'icon-strong':         rgbVar('icon-strong'),
          'icon-subtle':         rgbVar('icon-subtle'),
          'icon-muted':          rgbVar('icon-muted'),
          'icon-disabled':       rgbVar('icon-disabled'),
          'icon-placeholder':    rgbVar('icon-placeholder'),
          'icon-inverse':        rgbVar('icon-inverse'),
          'icon-brand':          rgbVar('icon-brand'),
          'icon-success':        rgbVar('icon-success'),
          'icon-destructive':    rgbVar('icon-destructive'),
          'icon-error':          rgbVar('icon-error'),
          'icon-warning':        rgbVar('icon-warning'),
          'icon-info':           rgbVar('icon-info'),
          'icon-on-brand':       rgbVar('icon-on-brand'),
          'icon-on-destructive': rgbVar('icon-on-destructive'),
          'icon-on-success':     rgbVar('icon-on-success'),
          'icon-on-warning':     rgbVar('icon-on-warning'),
          'icon-on-info':        rgbVar('icon-on-info'),
          // fg aliases
          'fg-default':  rgbVar('fg-default'),
          'fg-subtle':   rgbVar('fg-subtle'),
          'fg-disabled': rgbVar('fg-disabled'),
          'fg-brand':    rgbVar('fg-brand'),
          'fg-on-brand': rgbVar('fg-on-brand'),
          ...badgeText,
          ...badgeTextAccent,
        },
        fg: {
          default:    rgbVar('fg-default'),
          subtle:     rgbVar('fg-subtle'),
          disabled:   rgbVar('fg-disabled'),
          brand:      rgbVar('fg-brand'),
          'on-brand': rgbVar('fg-on-brand'),
        },
        overlay: 'rgb(var(--color-overlay) / <alpha-value>)',
      },
      boxShadow: {
        'foundation-xs':  'var(--shadow-foundation-xs)',
        'foundation-sm':  'var(--shadow-foundation-sm)',
        'foundation-md':  'var(--shadow-foundation-md)',
        'foundation-lg':  'var(--shadow-foundation-lg)',
        'foundation-xl':  'var(--shadow-foundation-xl)',
        'foundation-2xl': 'var(--shadow-foundation-2xl)',
        'foundation-3xl': 'var(--shadow-foundation-3xl)',
        'glow-accent-inset':        'var(--shadow-glow-accent-inset)',
        'glow-accent-inset-strong': 'var(--shadow-glow-accent-inset-strong)',
        'glow-danger-inset':        'var(--shadow-glow-danger-inset)',
        'glow-danger-inset-strong': 'var(--shadow-glow-danger-inset-strong)',
        'glow-accent-text':         'var(--shadow-glow-accent-text)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        xxs:  'var(--radius-xxs)',
        xs:   'var(--radius-xs)',
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        '4xl': 'var(--radius-4xl)',
        full: 'var(--radius-full)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        standard:   'var(--ease-standard)',
        emphasized: 'var(--ease-emphasized)',
        press:      'var(--ease-press)',
      },
    },
  },
};

export default preset;
```

**IMPORTANT** — if the existing `tailwind-preset.ts` has additional entries (`boxShadow`, `borderRadius`, `transitionDuration`, `transitionTimingFunction`, etc.) that don't appear above, preserve them by reading the original first and merging. The block above shows the color/shadow/radius/motion sections expected to exist; verify by diffing.

- [ ] **Step 2: Read the original to confirm no other extends are lost**

Run: `cat packages/tokens/src/tailwind-preset.ts | grep -E '^      [a-z]+:' | sort -u`
Expected output should list all top-level extend keys (colors, boxShadow, borderRadius, transitionDuration, transitionTimingFunction). If any extra key exists, append it to the new file before continuing.

- [ ] **Step 3: Build the tokens package**

Run: `pnpm --filter pod-test-tokens build`
Expected: Build succeeds with no TS errors.

- [ ] **Step 4: Commit**

```bash
git add packages/tokens/src/tailwind-preset.ts
git commit -m "feat(tokens): rewrite tailwind-preset color map per Figma families

Expose five nested families: bg, border, text, icon, fg.
Icon and fg tokens aliased under text.* for SVG color cascade.
Badge-accent tokens dual-registered in bg and text families.
Drop accent/danger/experiment/border-focus keys (removed in theme.css)."
```

---

## Task 4: Update `lib/focus-ring.ts`

**Files:**
- Modify: `packages/ui/src/lib/focus-ring.ts`

- [ ] **Step 1: Read the current file**

Run: `cat packages/ui/src/lib/focus-ring.ts`

- [ ] **Step 2: Replace `ring-border-focus` with `ring-brand` and `ring-offset-canvas` (stays same)**

Edit the file:

```ts
/**
 * Shared focus-ring classes so every interactive component has identical
 * keyboard focus affordance. Uses the semantic `border-brand` token so the
 * ring colour automatically swaps in dark mode.
 */
export const focusRing =
  'focus-visible:outline-none ' +
  'focus-visible:ring-2 ' +
  'focus-visible:ring-brand ' +
  'focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-bg-canvas';
```

Note: `ring-offset-canvas` becomes `ring-offset-bg-canvas` because canvas is now nested under `bg.canvas`.

- [ ] **Step 3: Verify**

Run: `grep -E 'border-focus|ring-offset-canvas' packages/ui/src/lib/focus-ring.ts`
Expected: NO matches.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/lib/focus-ring.ts
git commit -m "refactor(ui): focus-ring uses ring-brand and ring-offset-bg-canvas"
```

---

## Task 5: Update `switch.tsx`

**Files:**
- Modify: `packages/ui/src/switch/switch.tsx`

- [ ] **Step 1: Apply the renames**

Line 43 change: `value ? 'bg-accent' : 'bg-muted'` → `value ? 'bg-brand' : 'bg-muted'`

(`bg-canvas` on line ~49 stays as `bg-canvas` — already correct.)

Use Edit:
```
old: value ? 'bg-accent' : 'bg-muted',
new: value ? 'bg-brand' : 'bg-muted',
```

- [ ] **Step 2: Verify**

Run: `grep -E 'bg-accent\b' packages/ui/src/switch/switch.tsx`
Expected: NO matches.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/switch/switch.tsx
git commit -m "refactor(ui): switch uses bg-brand"
```

---

## Task 6: Update `button.tsx`

**Files:**
- Modify: `packages/ui/src/button/button.tsx` (lines 30-100)

- [ ] **Step 1: Read the current file**

Run: `cat packages/ui/src/button/button.tsx`

- [ ] **Step 2: Apply class renames**

Apply these find/replace pairs (use Edit tool, one at a time):

| Find (exact string) | Replace |
|---|---|
| `'bg-accent-hover text-accent-fg ' +` | `'bg-brand text-on-brand ' +` |
| `'hover:bg-accent-hover ' +` | `'hover:bg-brand-hover ' +` |
| `'active:bg-accent-active',` | `'active:bg-brand-hover',` |
| `'bg-transparent text-text-muted ' +` | `'bg-transparent text-muted ' +` |
| `'outline outline-1 outline-border-default [outline-offset:-1px] ' +` | `'outline outline-1 outline-default [outline-offset:-1px] ' +` |
| `'hover:text-text-primary hover:shadow-glow-accent-inset ' +` | `'hover:text-default hover:shadow-glow-accent-inset ' +` |
| `'active:text-text-primary active:shadow-glow-accent-inset',` | `'active:text-default active:shadow-glow-accent-inset',` |
| `'bg-danger-hover text-danger-fg ' +` | `'bg-destructive text-on-destructive ' +` |
| `'active:bg-danger-active',` | `'active:bg-destructive-hover',` |
| `'hover:bg-experiment-zinc-700',` | `'hover:bg-elevated',` |
| `'hover:!bg-experiment-primary-hover-dark',` | `'hover:!bg-brand-hover',` |

Note: the original line 30 starts with `'bg-accent-hover text-accent-fg'` which represents the **default Primary button** style. Per the spec, the spec says Primary Button uses `bg-brand` as default state — so `bg-accent-hover` (the old "default" value) maps to `bg-brand`, and `hover:bg-accent-hover` (old hover) becomes `hover:bg-brand-hover`. The original codebase had its semantic naming shifted by one rank; the new mapping unshifts it.

Verify after editing: read the file's variant section to confirm the Primary style now reads `bg-brand` default, `hover:bg-brand-hover`, `active:bg-brand-hover`.

- [ ] **Step 3: Look for any orphan `experiment-orange` / `experiment-primary-test` references**

Run: `grep -nE 'experiment-orange|experiment-primary-test' packages/ui/src/button/button.tsx`
Expected: NO matches. If matches exist, replace each with `bg-brand`.

- [ ] **Step 4: Verify no old classes remain**

Run: `grep -E 'accent-|danger-|experiment-|text-text-|border-border-|bg-raised|outline-border-' packages/ui/src/button/button.tsx`
Expected: NO matches.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/button/button.tsx
git commit -m "refactor(ui): button uses bg-brand / bg-destructive / new token names

Replaces accent-*/danger-*/experiment-* classes with Figma semantic tokens.
Active state collapses to hover (Figma has no -active)."
```

---

## Task 7: Update `checkbox.tsx`

**Files:**
- Modify: `packages/ui/src/checkbox/checkbox.tsx` (lines 75-125)

- [ ] **Step 1: Apply class renames**

Find/replace pairs:

| Find | Replace |
|---|---|
| `'bg-canvas border-experiment-cb-border shadow-foundation-xs',` | `'bg-canvas border-strong shadow-foundation-xs',` |
| `'checked:bg-text-primary checked:border-text-primary checked:shadow-none',` | `'checked:bg-inverse checked:border-inverse checked:shadow-none',` |
| `'indeterminate:bg-text-primary indeterminate:border-text-primary indeterminate:shadow-none',` | `'indeterminate:bg-inverse indeterminate:border-inverse indeterminate:shadow-none',` |
| `'hover:border-text-primary',` | `'hover:border-inverse',` |
| `'disabled:bg-experiment-cb-disabled-bg disabled:border-experiment-cb-disabled-bg disabled:shadow-none disabled:cursor-not-allowed',` | `'disabled:bg-disabled disabled:border-disabled disabled:shadow-none disabled:cursor-not-allowed',` |
| `'disabled:hover:border-experiment-cb-disabled-bg',` | `'disabled:hover:border-disabled',` |
| `'text-canvas peer-disabled:text-experiment-cb-disabled-icon',` | `'text-inverse peer-disabled:text-icon-disabled',` |
| `disabled ? 'text-text-disabled cursor-not-allowed' : 'text-text-primary cursor-pointer',` | `disabled ? 'text-disabled cursor-not-allowed' : 'text-default cursor-pointer',` |
| `className="text-xs text-text-muted"` | `className="text-xs text-muted"` |
| `<span id={errorId} className="text-xs text-danger">` | `<span id={errorId} className="text-xs text-destructive">` |

- [ ] **Step 2: Verify**

Run: `grep -E 'accent-|danger\b|experiment-|text-text-|border-border-|bg-text-primary|border-text-primary|text-canvas' packages/ui/src/checkbox/checkbox.tsx`
Expected: NO matches. (`text-canvas` should have been replaced with `text-inverse` for the icon.)

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/checkbox/checkbox.tsx
git commit -m "refactor(ui): checkbox uses bg-inverse / new token names

Checked + indeterminate states use bg-inverse / border-inverse (was the
ad-hoc bg-text-primary trick). Disabled states use bg-disabled."
```

---

## Task 8: Update `tooltip.tsx`

**Files:**
- Modify: `packages/ui/src/tooltip/tooltip.tsx`

- [ ] **Step 1: Apply class renames**

Find/replace pairs:

| Find | Replace |
|---|---|
| `'bg-text-primary text-text-inverse',` | `'bg-inverse text-inverse',` |
| `'bg-danger text-danger-fg',` | `'bg-destructive text-on-destructive',` |
| `variant === 'default' && 'text-text-primary',` | `variant === 'default' && 'text-default',` |
| `variant === 'error' && 'text-danger',` | `variant === 'error' && 'text-destructive',` |

Note on `text-inverse` (line 24): in light mode this is `#FAFAFA` (light text on dark `bg-inverse`). Same value as the old `text-text-inverse`. Correct.

- [ ] **Step 2: Verify**

Run: `grep -E 'accent-|danger\b|danger-fg|bg-text-primary|text-text-' packages/ui/src/tooltip/tooltip.tsx`
Expected: NO matches.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/tooltip/tooltip.tsx
git commit -m "refactor(ui): tooltip uses bg-inverse / bg-destructive"
```

---

## Task 9: Update `tabs.tsx`

**Files:**
- Modify: `packages/ui/src/tabs/tabs.tsx`

This file has the most class renames in a single component.

- [ ] **Step 1: Apply class renames (in order)**

| Find | Replace |
|---|---|
| `'focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus/40 ' +` | `'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ' +` |
| `'bg-canvas text-experiment-tab-text hover:text-text-primary ' +` | `'bg-canvas text-subtle hover:text-default ' +` |
| `'disabled:text-experiment-tab-text-disabled disabled:hover:text-experiment-tab-text-disabled',` | `'disabled:text-disabled disabled:hover:text-disabled',` (apply twice — lines 44 and 47) |
| `'text-experiment-tab-text hover:text-text-primary ' +` | `'text-subtle hover:text-default ' +` |
| `'bg-experiment-tab-base text-experiment-tab-text ' +` | `'bg-surface text-subtle ' +` (apply twice — lines 49, 53) |
| `'hover:bg-surface hover:text-experiment-tab-text ' +` | `'hover:bg-surface hover:text-subtle ' +` |
| `'disabled:text-experiment-tab-text-disabled disabled:hover:bg-experiment-tab-base',` | `'disabled:text-disabled disabled:hover:bg-surface',` (apply twice — lines 51, 55) |
| `menu: 'bg-experiment-tab-base border border-experiment-tab-border text-text-primary',` | `menu: 'bg-surface border border-strong text-default',` |
| `underline: 'text-text-primary',` | `underline: 'text-default',` |
| `'screen-nav': 'bg-experiment-tab-base text-text-primary',` | `'screen-nav': 'bg-surface text-default',` |
| `pill: 'bg-experiment-tab-base border border-experiment-tab-border text-text-primary',` | `pill: 'bg-surface border border-strong text-default',` |
| `const iconTint = isMenu && active ? 'text-experiment-tab-indigo' : 'text-experiment-tab-text';` | `const iconTint = isMenu && active ? 'text-badge-indigo-accent' : 'text-subtle';` |
| `disabled ? 'text-experiment-tab-text-disabled' : iconTint,` | `disabled ? 'text-disabled' : iconTint,` |
| `disabled ? 'text-experiment-tab-text-disabled' : 'text-experiment-tab-text',` | `disabled ? 'text-disabled' : 'text-subtle',` (apply twice — lines 126 and 139) |
| `'shrink-0 inline-flex items-center justify-center w-5 rounded-xs px-1.5 bg-experiment-tab-chip',` | `'shrink-0 inline-flex items-center justify-center w-5 rounded-xs px-1.5 bg-elevated',` |

- [ ] **Step 2: Verify**

Run: `grep -E 'experiment-|text-text-|border-border-|ring-border-focus|bg-experiment-tab' packages/ui/src/tabs/tabs.tsx`
Expected: NO matches.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/tabs/tabs.tsx
git commit -m "refactor(ui): tabs uses semantic foundation tokens

Replace all experiment-tab-* with bg-surface / bg-elevated / text-subtle /
text-disabled / border-strong. Menu/Active leading icon hardcoded to
text-badge-indigo-accent (static #6366F1, preserves current visual).
Designer follow-up: refactor to dynamic chromatic icon color."
```

---

## Task 10: Update `text-input.tsx`

**Files:**
- Modify: `packages/ui/src/text-input/text-input.tsx`

- [ ] **Step 1: Apply class renames**

| Find | Replace |
|---|---|
| `text-text-muted` | `text-muted` (5 occurrences across the file) |
| `text-text-primary` | `text-default` (3+ occurrences) |
| `text-text-disabled` | `text-disabled` |
| `'border-border-default',` | `'border-default',` (2 occurrences — lines 248, 304, 329) |
| `border-l border-border-default` | `border-l border-default` |
| `border-r border-border-default` | `border-r border-default` |
| `'hover:border-experiment-input-stroke-active',` | `'hover:border-subtle',` |
| `'focus-within:border-experiment-input-stroke-active',` | `'focus-within:border-subtle',` |
| `'focus-within:bg-experiment-input-bg-focused',` | `'focus-within:bg-subtle',` |
| `text-sm font-normal leading-5 text-danger` | `text-sm font-normal leading-5 text-destructive` |
| `flex items-center gap-1 text-[13px] leading-[18px] text-danger` | `flex items-center gap-1 text-[13px] leading-[18px] text-destructive` |

Use Edit with `replace_all: true` for the common renames (`text-text-muted` etc.) to apply globally in the file.

- [ ] **Step 2: Verify**

Run: `grep -E 'experiment-|text-text-|border-border-|text-danger\b' packages/ui/src/text-input/text-input.tsx`
Expected: NO matches.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/text-input/text-input.tsx
git commit -m "refactor(ui): text-input uses semantic foundation tokens"
```

---

## Task 11: Update `search-input.tsx`

**Files:**
- Modify: `packages/ui/src/search-input/search-input.tsx`

- [ ] **Step 1: Apply class renames**

| Find | Replace |
|---|---|
| `text-text-primary` | `text-default` (replace_all) |
| `text-text-muted` | `text-muted` (replace_all) |
| `text-text-disabled` | `text-disabled` (replace_all) |
| `'border-border-default',` | `'border-default',` |
| `'hover:border-experiment-input-stroke-active',` | `'hover:border-subtle',` |
| `'focus-within:border-experiment-input-stroke-active',` | `'focus-within:border-subtle',` |
| `'focus-within:bg-experiment-input-bg-focused',` | `'focus-within:bg-subtle',` |
| `'inline-flex items-center justify-center rounded-xs bg-experiment-zinc-700 px-1.5 text-[13px] leading-[18px] text-text-muted'` | `'inline-flex items-center justify-center rounded-xs bg-elevated px-1.5 text-[13px] leading-[18px] text-muted'` |
| `text-danger\b` (any standalone use) | `text-destructive` |

- [ ] **Step 2: Verify**

Run: `grep -E 'experiment-|text-text-|border-border-|text-danger\b' packages/ui/src/search-input/search-input.tsx`
Expected: NO matches.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/search-input/search-input.tsx
git commit -m "refactor(ui): search-input uses semantic foundation tokens"
```

---

## Task 12: Update `dropdown.tsx`

**Files:**
- Modify: `packages/ui/src/dropdown/dropdown.tsx`

- [ ] **Step 1: Apply class renames**

| Find | Replace |
|---|---|
| Comment block referencing `bg-experiment-tab-base` (around line 48) | Comment can be left or updated; the class on line 50 is the substantive change |
| `'overflow-hidden rounded-md border border-border-default bg-experiment-tab-base shadow-foundation-lg',` | `'overflow-hidden rounded-md border border-default bg-surface shadow-foundation-lg',` |
| `const colorClass = destructive \|\| error ? 'text-danger' : 'text-text-primary';` | `const colorClass = destructive \|\| error ? 'text-destructive' : 'text-default';` |
| `text-text-muted` | `text-muted` (replace_all) |
| `text-text-primary` | `text-default` (replace_all) |
| `'focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus/40',` | `'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',` |
| `? 'hover:bg-danger-subtle'` | `? 'hover:bg-destructive-subtle'` |
| `text-sm font-normal leading-5 text-danger` | `text-sm font-normal leading-5 text-destructive` |
| `flex items-center gap-1 text-[13px] leading-[18px] text-danger` | `flex items-center gap-1 text-[13px] leading-[18px] text-destructive` |
| `'border-experiment-input-stroke-active',` | `'border-subtle',` (3 occurrences) |
| `'bg-experiment-input-bg-focused',` | `'bg-subtle',` |
| `'border-border-default',` | `'border-default',` |
| `'hover:border-experiment-input-stroke-active',` | `'hover:border-subtle',` |
| `'focus-visible:border-experiment-input-stroke-active',` | `'focus-visible:border-subtle',` |

Note: line 48-49 has a comment block referencing `bg-experiment-tab-base = Figma bg/medium`. That comment is now outdated — replace it with a one-line note: `// bg-surface = Figma bg.surface for dropdown menu container`.

- [ ] **Step 2: Verify**

Run: `grep -E 'experiment-|text-text-|border-border-|text-danger\b|bg-danger-|border-focus' packages/ui/src/dropdown/dropdown.tsx`
Expected: NO matches.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/dropdown/dropdown.tsx
git commit -m "refactor(ui): dropdown uses semantic foundation tokens"
```

---

## Task 13: Update `badges.tsx`

**Files:**
- Modify: `packages/ui/src/badges/badges.tsx`

This file has the most semantic shift: the chromatic badge variants map to a 3-token-per-color scheme using mode-adaptive Figma tokens plus the new `badge-{c}-accent` token.

- [ ] **Step 1: Read the current structure**

Run: `sed -n '40,110p' packages/ui/src/badges/badges.tsx`

- [ ] **Step 2: Replace the chromatic and gray variant maps**

The current file has entries shaped like:
```ts
orange: {
  bg: 'bg-experiment-badge-orange-bg',
  tag: 'bg-experiment-badge-orange-tag',
  fg: 'text-experiment-badge-orange-fg',
},
```

For each of the 9 chromatic colors (orange, lime, purple, green, indigo, sky, blue, red, yellow), rewrite the entry as:

```ts
orange: {
  bg: 'bg-badge-orange',
  tag: 'bg-badge-orange-accent',
  fg: 'text-badge-orange',
},
```

Apply the same pattern for the other 8 colors (`lime`, `purple`, `green`, `indigo`, `sky`, `blue`, `red`, `yellow`) — replace each `experiment-badge-{c}-{bg|tag|fg}` reference per the mapping in the top reference table.

For the **gray variants** (around lines 96-103):
```ts
gray: {
  bg: 'bg-experiment-tab-chip',
  tag: 'bg-experiment-tab-text-disabled',
  fg: 'text-experiment-tab-text',
},
// Another gray with border:
{
  bg: 'bg-experiment-tab-base border border-experiment-tab-border',
  tag: 'bg-experiment-tab-text-disabled',
  fg: 'text-experiment-tab-text',
},
```

Become:
```ts
gray: {
  bg: 'bg-elevated',
  tag: 'bg-disabled',  // was text-disabled value; using bg-disabled which is same #F4F4F5/#1C1C1F
  fg: 'text-subtle',
},
{
  bg: 'bg-surface border border-strong',
  tag: 'bg-disabled',
  fg: 'text-subtle',
},
```

- [ ] **Step 3: Update the removable-badge focus ring (line ~216)**

Find: `focus:outline-none focus-visible:ring-1 focus-visible:ring-border-focus/60`
Replace: `focus:outline-none focus-visible:ring-1 focus-visible:ring-brand/60`

- [ ] **Step 4: Verify**

Run: `grep -E 'experiment-|ring-border-focus' packages/ui/src/badges/badges.tsx`
Expected: NO matches.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/badges/badges.tsx
git commit -m "refactor(ui): badges use Figma bg-badge-* / text-badge-* + accent ring

9 chromatic variants: bg = bg-badge-{c} (pastel light, dark dark),
middle ring = bg-badge-{c}-accent (primitive 500, both modes),
text = text-badge-{c} (chromatic light, pastel dark).
Gray variants use bg-elevated / bg-surface + border-strong + text-subtle."
```

---

## Task 14: Build `pod-test-ui` to verify all component changes typecheck

**Files:** None (verification only)

- [ ] **Step 1: Run typecheck across workspace**

Run: `pnpm typecheck`
Expected: PASS (no TypeScript errors).

If any errors appear, they will name specific files and lines — revisit the corresponding task to fix.

- [ ] **Step 2: Build the UI package**

Run: `pnpm --filter pod-test-ui build`
Expected: PASS. Tailwind compilation runs as part of build:css and will fail loudly if any unknown class is referenced.

If it fails with "unknown utility class", grep for that class and either:
- Update the offending file to use the new name from the mapping table.
- Or add the missing token to `tailwind-preset.ts` if it was legitimately missing.

- [ ] **Step 3: Final sweep of `packages/ui/src/`**

Run: `grep -rE 'experiment-|accent-default|accent-hover|accent-active|accent-fg|accent-subtle|bg-accent\b|text-accent\b|danger-default|danger-hover|danger-active|danger-fg|danger-subtle|bg-danger\b|text-danger\b|text-text-|border-border-|bg-text-primary|border-text-primary|ring-border-focus|bg-raised|outline-border-default|text-info-fg|text-warning-fg' packages/ui/src/`
Expected: NO matches anywhere in `packages/ui/src/`.

- [ ] **Step 4: Commit (if any fixes were made)**

If Steps 2-3 surfaced issues that needed fixing, commit with:
```bash
git commit -am "fix(ui): cleanup token-rename stragglers"
```

If nothing needed fixing, skip this commit.

---

## Task 15: Sweep `apps/docs/`

**Files:**
- Modify: 27 files in `apps/docs/src/` (per earlier grep)

The docs site uses old class names heavily but follows the same rename pattern. Apply mechanical sed substitutions, then visually verify a small subset.

- [ ] **Step 1: Run mechanical sed substitutions across `apps/docs/src/`**

The substitutions below use `find ... -exec sed -i ''` syntax (BSD sed on macOS). They handle the simple 1:1 renames.

```bash
cd apps/docs/src

# Group A: drop double-prefix (text-text-* → text-*, border-border-* → border-*)
find . -type f \( -name '*.tsx' -o -name '*.mdx' \) -exec sed -i '' \
  -e 's/text-text-primary/text-default/g' \
  -e 's/text-text-secondary/text-subtle/g' \
  -e 's/text-text-muted/text-muted/g' \
  -e 's/text-text-disabled/text-disabled/g' \
  -e 's/text-text-inverse/text-inverse/g' \
  -e 's/border-border-subtle/border-subtle/g' \
  -e 's/border-border-default/border-default/g' \
  -e 's/border-border-strong/border-strong/g' \
  -e 's/outline-border-default/outline-default/g' \
  {} \;

# Group B: rename brand and feedback families
find . -type f \( -name '*.tsx' -o -name '*.mdx' \) -exec sed -i '' \
  -e 's/bg-accent-hover/bg-brand-hover/g' \
  -e 's/bg-accent-active/bg-brand-hover/g' \
  -e 's/bg-accent-subtle/bg-brand-subtle/g' \
  -e 's/bg-accent-default/bg-brand/g' \
  -e 's/text-accent-fg/text-on-brand/g' \
  -e 's/bg-danger-subtle/bg-destructive-subtle/g' \
  -e 's/bg-danger-active/bg-destructive-hover/g' \
  -e 's/bg-danger-hover/bg-destructive/g' \
  -e 's/text-danger-fg/text-on-destructive/g' \
  -e 's/text-info-fg/text-on-info/g' \
  -e 's/text-warning-fg/text-on-warning/g' \
  -e 's/bg-raised/bg-elevated/g' \
  -e 's/ring-border-focus/ring-brand/g' \
  -e 's/bg-text-primary/bg-inverse/g' \
  -e 's/border-text-primary/border-inverse/g' \
  {} \;

cd ../../..
```

- [ ] **Step 2: Handle `text-danger` and `bg-danger` (standalone, word-boundary sensitive)**

These two strings are dangerous because `bg-danger-hover` substring matches both. Run AFTER Group B (which already handled the suffixed versions):

```bash
cd apps/docs/src
# These match only the bare token (no trailing dash + word).
find . -type f \( -name '*.tsx' -o -name '*.mdx' \) -exec sed -i '' \
  -E 's/text-danger([^-a-zA-Z0-9])/text-destructive\1/g' \
  {} \;
find . -type f \( -name '*.tsx' -o -name '*.mdx' \) -exec sed -i '' \
  -E 's/bg-danger([^-a-zA-Z0-9])/bg-destructive\1/g' \
  {} \;
cd ../../..
```

- [ ] **Step 3: Verify**

Run from repo root:
```bash
grep -rE 'experiment-|accent-default|accent-hover|accent-active|accent-fg|accent-subtle|bg-accent\b|text-accent\b|danger-default|danger-hover|danger-active|danger-fg|danger-subtle|bg-danger\b|text-danger\b|text-text-|border-border-|bg-text-primary|border-text-primary|ring-border-focus|bg-raised|outline-border-default|text-info-fg|text-warning-fg' apps/docs/src/
```
Expected: NO matches.

If matches appear, they're patterns sed missed (e.g., class names inside template strings split across lines). Fix manually with Edit.

- [ ] **Step 4: Spot-check a few files to confirm sed didn't corrupt content**

Run:
```bash
head -50 apps/docs/src/pages/foundations/Color.mdx
head -30 apps/docs/src/components/docs/PageHeader.tsx
head -30 apps/docs/src/components/docs/Swatch.tsx
```

Expected: Files read normally, no garbled lines.

- [ ] **Step 5: Build docs**

Run: `pnpm --filter docs build`
Expected: PASS. If Tailwind reports "unknown utility class" errors, the named class still has an old form somewhere — fix and re-run.

- [ ] **Step 6: Commit**

```bash
git add apps/docs/
git commit -m "refactor(docs): sweep all old token class names to Figma-aligned names

Mechanical rename via sed: text-text-*, border-border-*, accent-*, danger-*,
bg-raised, ring-border-focus, bg-text-primary, etc. Matches token rename
in packages/tokens and packages/ui."
```

---

## Task 16: Verify centernode runtime (likely no-op)

**Files:**
- Read: `centernode/src/utils/podRuntime.js`

- [ ] **Step 1: Check for old token references**

Run:
```bash
grep -nE 'experiment-|accent-|danger-|text-text-|border-border-|bg-raised|bg-text-primary|border-text-primary|ring-border-focus' centernode/src/utils/podRuntime.js
```
Expected: NO matches (verified during plan drafting — file is token-agnostic).

- [ ] **Step 2: Sweep all of `centernode/src/`**

Run:
```bash
grep -rE 'bg-accent-|bg-danger-|bg-experiment-|text-accent-|text-danger-|text-experiment-|border-experiment-|text-text-|border-border-|bg-raised|ring-border-focus|bg-text-primary|border-text-primary' centernode/src/
```
Expected: NO matches.

- [ ] **Step 3: If matches were found, fix them**

For any file that has stale class names, apply the same rename map from the reference table. Commit per file:

```bash
git add centernode/src/path/to/file.js
git commit -m "refactor(centernode): rename to Figma-aligned class names"
```

If no matches were found, skip the commit. Document the finding in the task log.

---

## Task 17: Final verification

**Files:** None (verification only)

- [ ] **Step 1: Full typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 2: Build all packages**

Run: `pnpm build:packages`
Expected: PASS.

- [ ] **Step 3: Build docs**

Run: `pnpm build:docs`
Expected: PASS.

- [ ] **Step 4: Drift check against Figma**

Run: `node scripts/figma/check.mjs`
Expected: All 11 manifest entries report IN SYNC (we didn't touch component Figma nodes, only local tokens, so component caches stay valid).

If anything reports DRIFT here that wasn't drifted before, investigate — token renames shouldn't affect drift state since `.figma/variables/<slug>.json` files weren't touched.

- [ ] **Step 5: Visual smoke test**

Run: `pnpm dev`
Expected: Dev server starts on `http://localhost:5173` (or whatever port docs uses).

Walk through every component page:
- `/components/button` — Primary button is consistently green across all sizes
- `/components/checkbox` — checked state filled in `bg-inverse` (#09090B near-black)
- `/components/badge` — light mode badges show pastel pill + chromatic accent + chromatic text (NEW LOOK)
- `/components/tab` — Menu/Active tab shows indigo icon (preserved)
- `/components/dropdown`, `/components/text-input`, `/components/search-input` — focus states use brand green ring
- `/components/tooltip` — tooltip body is `bg-inverse` (slightly darker than before)
- `/components/switch` — on-state is `bg-brand` (#15803D)
- `/foundations/color` — color swatches reflect new values

Take screenshots if the user wants to compare with previous state.

- [ ] **Step 6: Final sweep — search entire repo for any old patterns**

Run from repo root:
```bash
grep -rE 'experiment-|accent-default|accent-hover|accent-active|accent-fg|accent-subtle|bg-accent\b|text-accent\b|danger-default|danger-hover|danger-active|danger-fg|danger-subtle|bg-danger\b|text-danger\b|text-text-|border-border-|bg-text-primary|border-text-primary|ring-border-focus|bg-raised|outline-border-default|text-info-fg|text-warning-fg' \
  --include='*.ts' --include='*.tsx' --include='*.mdx' --include='*.js' --include='*.css' \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.figma --exclude-dir=figma-exports
```
Expected: NO matches.

If any survive, fix them.

- [ ] **Step 7: Final commit (only if step 6 needed fixes)**

```bash
git commit -am "fix: final token-rename sweep"
```

- [ ] **Step 8: Report completion to user**

Print a summary:
- Number of commits
- Visual changes the designer should review (per spec "Known visual shifts" section)
- Follow-up tasks (Tab dynamic icon color refactor)
- Reminder: this PR doesn't `/publish` to npm; centernode + client-test won't see changes until a publish runs

---

## Plan Self-Review Notes

**Spec coverage check:**
- Section 1 (foundation rewrite) — Tasks 1, 2, 3 cover.
- Section 2 (eliminate experiment-*) — Tasks 4–13 cover (focus-ring, switch, button, checkbox, tooltip, tabs, text-input, search-input, dropdown, badges).
- Section 3 (component class refactor) — same tasks; Tab dynamic icon noted as out-of-scope follow-up.
- Section 4 (rollout & verification) — Tasks 14, 15, 16, 17.

**Placeholder check:** none — every step has concrete code or commands.

**Type consistency:** `bg-brand`, `text-default`, `border-strong`, etc. are used consistently across all task tables. Component-scoped `badge-{c}-accent` appears in theme.css, tailwind-preset.ts, and badges.tsx with the same name.

**Risk acknowledgment:** Tasks 14, 15, 17 include grep-based sweeps to catch anything the mechanical renames miss. Visual smoke is in Task 17.
