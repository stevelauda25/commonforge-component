# Foundation — documentation & readiness

Every token below was extracted value-for-value from the running 3001 app and
cross-checked against the 5173 prototype. Status legend: ✅ ready · ➕ proposed
addition (used in code, not yet a token).

**Changelog 2026-07-21:** all 5 review decisions handled — 1, 2, 3, 5 resolved,
4 declined for now (see §6). Same day: typography scale extended — font sizes
`body` 14px / `body-lg` 16px and line-heights `body` 20px / `body-lg` 24px added (v0.3.0).

## 1. Colors

### 1.1 Palette ramps — ✅ ready

| Ramp | Shades | Notes |
|---|---|---|
| `neutral` (warm) | 25 → 950 (12) | brand neutrals — cream/charcoal family |
| `crimson` (brand) | 25 → 950 (12) | vermilion brand color; 500 `#C0180C` = primary buttons |
| `green` (success) | 25 → 950 (12) | |
| `amber` (warning) | 25 → 950 (12) | |
| `red` (error) | 25 → 950 (12) | deliberately distinct from crimson |
| `gray` (cool) | 25 → 975 (18, incl. 75/150/250/350/975 half-steps) | from Figma Primitives; **only 3001 had this tokenized** — adopting it back into 5173 would replace ~15 hardcoded hexes there |

Full hex tables: see `tokens.css` / `tokens.json`.

### 1.2 Semantic colors — ✅ ready (decisions 1–2 resolved 2026-07-21)

| Token | Value | Status |
|---|---|---|
| `background` / `surface` / `surface-sunken` | `#FBFAF9` / `#FFFFFF` / `#F6F4F1` | ✅ |
| `foreground` | `#201B18` | ✅ |
| `secondary` | `#525252` (cool gray-800) | ✅ — note: cool gray inside a warm system (intentional, matches Figma) |
| `muted-foreground` / `subtle-foreground` | `#6B6259` / `#8B8175` | ✅ (rarely used in components so far) |
| `border-hairline` / `border-strong` | `#E2DCD4` / `#CFC7BC` | ✅ — note: most components actually use `border-black/10` at 0.5px instead of the hairline token |
| `text-primary` | `#000000` | ✅ **resolved** — renamed from `--primary`: the black was always the primary *text* color (~70 usages of the `text-primary` class), not the action color. Actions are crimson-500. The `--color-primary` theme mapping now points at `--text-primary`, so existing `text-primary` classes keep working |
| `primary-hover` | `#98150B` (crimson-600) | ✅ — kept: it is the text hover state (`hover:text-primary-hover` in JobCard/JobCardV2) |
| `primary-foreground` | `#FFFFFF` | ✅ — kept: text on dark/primary surfaces (used by dashboard widgets) |
| `danger` | `#E51D31` | ✅ |
| `danger-foreground` | `rgba(255, 255, 255, 0.95)` | ✅ **resolved** — dark red `#9C1122` removed, replaced with near-white alpha. Token is currently unused in app code, so this is a safe default for future danger buttons |

### 1.3 Hardcoded colors still in components (decision 4: leave as-is for now)

Per the 2026-07-21 review, these stay hardcoded and are **not** promoted to tokens
in this round — documented here so the doc site can note them:

| Hex | Used for |
|---|---|
| `#4169D6` | job status "In-progress", chart series |
| `#DB4C86` | job status "Potential" |
| `#0072E4` | Actuals bars, skills level 5 |
| `#00A97F` | Calendar bars, budget "on track" |
| `#0D76F2` | map pins (staffed) |
| `#EB6214` | skills level 2 |
| `#BC97F7` / `#F7F1FF` / `#7635D9` | badge `purple` variant |
| `#2D251F` | progress-bar default fill |
| `#A2A19A` / `#D3D2CF` | gantt bar default/disabled |
| `#211D1A` | chart tooltip background |

## 2. Radius — ✅ ready (xs added 2026-07-21)

| Token | Value | Typical use |
|---|---|---|
| `radius-none` | 0px | sharp corners |
| `radius-2xs` | 2px | subtle rounding on tiny controls |
| `radius-xs` | 4px | badges, tags, day cells (decision 5) |
| `radius-sm` | 6px | buttons, inputs, cards (default component radius) |
| `radius-md` | 8px | compact KPI cards |
| `radius-10` | 10px | between md and lg (gap-filler, added 2026-07-21) |
| `radius-lg` | 12px | toasts, tooltips |
| `radius-xl` | 16px | large surfaces |
| `radius-full` | 9999px | pills & circles — avatar, switch, progress bars, skill dots, map pins |

One-offs that remain outside the scale: `rounded-[3px]` (checkbox small, legend chip),
`rounded-[5px]` (drop-zone inner, checkbox large) — acceptable component-level values.

## 3. Shadows — ✅ ready (6 tokens + 2 documented recipes)

**Token shadows** (in `tokens.css`):

| Token | Use | Value |
|---|---|---|
| `shadow-elev-1` | cards | `0 1px 2px rgba(32,27,24,.05), 0 4px 10px rgba(32,27,24,.04)` |
| `shadow-elev-2` | raised cards | `0 1px 2px rgba(32,27,24,.05), 0 5px 14px rgba(32,27,24,.05)` |
| `shadow-pop` | modals | `0 1px 2px rgba(32,27,24,.06), 0 12px 30px rgba(32,27,24,.16)` |
| `shadow-button` | button, segmented pill, date-picker Apply | 6 layers incl. inset highlights — see tokens.css |
| `shadow-frame` | dashboard frame surface (the #F7F7F7 container) | 3 layers + 2 inset hairlines — see tokens.css |
| `shadow-card` | white cards/panels inside the frame (kpi-card, dashboard panels, job cards) | 5 layers incl. inset hairlines — see tokens.css |

**Documented recipes** (still in component code, not tokens):

| Recipe | Used by |
|---|---|
| Popover/menu shadow (3 layers, all `rgba(0,0,0,0.05)`) | dropdowns, menus, date-picker card |
| Chart tooltip shadow (6 layers) | chart-tooltip |

## 4. Typography — ✅ ready (decision 3 resolved 2026-07-21)

| Token | Value | Status |
|---|---|---|
| `font-sans` | Geist, Inter, system-ui… | ✅ |
| ~~`font-mono`~~ | — | ✅ **resolved: removed** — the design system ships no mono font. App usages (code snippets, job numbers, JSON logs) fall back to the platform monospace stack via Tailwind's default `font-mono`, which needs no token |
| extra sizes | 3xs 9px · 2xs 10px · caption 11px · xs 12px · body-sm 13px · body 14px · body-lg 16px | ✅ (xs/body/body-lg overlap Tailwind's `text-xs`/`text-sm`/`text-base` but are part of the documented scale) |
| extra line-heights | tight 13 · snug 14 · caption 15 · xs 16 · body-sm 18 · body 20 · body-lg 24 | ✅ (xs = stock `leading-4`) — note: tight/snug **override** Tailwind's stock `leading-tight/snug` |
| root font-size | 16px fixed ("THE ONE KNOB" — whole UI scales from this) | ✅ |

## 5. Spacing — ➖ nothing to collect (documented)

Neither app defines custom spacing tokens — both use Tailwind's default 4px scale,
with component dimensions authored in rem. Fixed component dimensions (panel heights,
sidebar width 15rem, etc.) are documented per-component in the inventories rather than
as tokens. If the design system wants a spacing scale later, that is a new decision,
not an extraction.

## 6. Decisions — all handled (2026-07-21)

1. ~~`--primary: #000000` vs crimson brand buttons~~ → **it is a text color.** Renamed
   to `--text-primary`; theme mapping `--color-primary` kept so `text-primary` classes
   don't break. Action color = crimson-500.
2. ~~`--danger-foreground: #9C1122`~~ → **removed**, replaced with
   `rgba(255, 255, 255, 0.95)` (near-white alpha). Token unused in code, so no breakage.
3. ~~Mono font: Geist Mono vs Space Mono~~ → **neither — no mono token shipped.**
   Apps fall back to platform monospace for code/numbers/logs.
4. ~~Promote the 10 hardcoded colors to tokens~~ → **declined for now**; documented
   in §1.3 instead. Can be revisited when the doc site is built.
5. ~~Add `radius-xs: 4px`~~ → **added** (badges, tags, day cells).

**Foundation is now decision-free and ready for the component-collection phase.**
