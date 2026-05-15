# `pod-test-ui` — Manifest untuk AI Agent

> **AI agent yang sedang edit kode di project konsumen `pod-test-ui`: BACA FILE INI sebelum kasih saran code change.**
> File ini ground truth tentang component + token yang tersedia di versi **yang ter-install** di project ini. Versi ke versi bisa beda — selalu cek `node_modules/pod-test-ui/AGENTS.md`, bukan dokumentasi eksternal.

## Versi & sumber kebenaran

```json
{
  "package": "pod-test-ui",
  "version": "0.1.5",
  "manifest_version": 1,
  "last_updated": "2026-05-13"
}
```

**Changelog 0.1.7 → 0.1.8:**
- New components: **`Badge`** (11 color variants — green/lime/orange/yellow/red/purple/indigo/sky/blue/soft-gray/dark-gray, optional removable ×) and **`Tab`** (4 styles: menu/underline/screen-nav/pill, stateless atom).
- **Dropdown — `popup` prop (NEW preferred API).** Pass `<DropdownMenu>...</DropdownMenu>` to `popup` and the trigger anchors the popover correctly even when `hint`/`error` are present. Old pattern (rendering `DropdownMenu` as a sibling with `absolute` positioning) still works but mis-aligns the popup below the hint — migrate to `popup`.
  ```tsx
  <Dropdown
    label="Books" placeholder="Select" hint="..."
    open={open} onClick={() => setOpen(o => !o)}
    popup={<DropdownMenu>{items}</DropdownMenu>}
  />
  ```
- **DropdownMenu** — bg swapped from `bg-canvas` (#09090b) to `bg-experiment-tab-base` (#111113 = Figma `bg/medium`), now consistent across Tab + Badge + Dropdown popovers.
- **DropdownBadge** — internally wraps the canonical `Badge` component (instead of its own ad-hoc styles). Same API (`label`, `color`), but consumes `experiment-badge-*` tokens for visual consistency.
- **Motion** — `animate-menu-in` upgraded to the POD elegant baseline: blur 4px→0 + opacity 0→1 + scale 0.97→1 + translateY -4→0, 280ms cubic-bezier(0.4, 0, 0.2, 1). Same family as the removal-motion standard. New `animate-menu-item-in` for staggered item cascade (220ms, 24ms delay per index). `DropdownMenu` auto-applies the cascade to its children.

**Changelog 0.1.4 → 0.1.5:**
- New component: **`Dropdown`** — single-select or multi-tag trigger with label/hint/error/sublabel/labelInfo/required. Stateless: pair with `DropdownMenu` for popup. Variants `default` × `tags`, sizes `sm` · `md`. Figma source: `input-dropdown` (node `2415:2051`).
- New sub-primitives shipped with Dropdown:
  - **`DropdownMenu`** — popover container, scrollable, animates in via `animate-menu-in`.
  - **`DropdownItem`** — single row. Props: `selected`, `disabled`, `destructive`, `error`, `leftAdornment`, `rightAdornment`, `showSelectedMark`.
  - **`DropdownBadge`** — small leading badge (label + colored dot). 9 colors: `green`/`blue`/`orange`/`lime`/`indigo`/`red`/`sky`/`purple`/`yellow`. Used as `<DropdownItem leftAdornment={<DropdownBadge label="CIRC" color="green" />}>`. Since 0.1.8, internally a thin wrapper around `Badge`.
- New motion utilities in `pod-test-tokens` preset:
  - `animate-menu-in` — fade + scale-down reveal. Auto-applied to `DropdownMenu`. (Upgraded in 0.1.8 — see top of changelog.)
  - `animate-fade-in` — opacity fade, `duration-fast · ease-standard`. For consumer popovers/tooltips.
- `canvas.ts` schema additions (consumed by playground tools like centernode):
  - `CanvasComponent.tokens` — common POD tokens this component consumes (filters Tokens panel scope).
  - `CanvasComponent.variantTokens` — per-variant token allowlist (e.g. Button primary uses `accent-*`, Button error uses `danger-*`).
  - `CanvasComponent.extraScope` — sub-primitives that must be in scope for composite examples (e.g. Dropdown ships `DropdownMenu`, `DropdownItem`, `DropdownBadge`).
  - `CanvasExample.code` — raw JSX/TSX override for composite examples (function components with state).

**Changelog 0.1.3 → 0.1.4:**
- New subpath: `pod-test-ui/canvas` — neutral manifest (component name, variants, sizes, defaultProps, examples) for playground / infinite-canvas tools to discover POD components.
- New subpath: `pod-test-ui/styles.css` — compiled Tailwind utility bundle. For consumers that don't run their own Tailwind: `import 'pod-test-ui/styles.css'`. `@tailwind base` intentionally omitted to avoid leaking element-level preflight into host UI.
- New component: `TextInput` — single-line text input, variants `default`, sizes `sm`/`md`/`lg`. See component table.
- New component: `Switch` — controlled/uncontrolled boolean toggle (`sm` · `md`). NOTE: not yet in Figma source — experimental, may be revised once design lands.
- Build pipeline: added `scripts/canvas/sync.mjs` codegen. Per-component metadata at `src/<dir>/canvas.ts` auto-aggregates to tsup/package.json/canvas manifest/centernode runtime.

**Changelog 0.1.0 → 0.1.1:**
- Fix: Primary button hover state no longer renders maroon (`bg-danger-hover` cross-namespace bug — accent and danger are separate sacred namespaces).
- Spec: `/sync-figma` step 4 now enforces sacred-namespace boundary explicitly (Figma `surface-primary*` may only map to `accent-*`, never `danger-*`).

> **Auto-sync mechanism:** File ini di-ship di tarball npm. Setiap `npm update pod-test-ui` di project konsumen, file ini ter-update otomatis. Konsumen tidak perlu manual edit CLAUDE.md mereka untuk component baru.

## Component yang tersedia (TOP-LEVEL EXPORTS)

| Component | Status | Variants | Sizes | Controlled? | Doc page |
|---|---|---|---|---|---|
| `Button` | stable | `primary` · `outline` · `error` | `xs` · `sm` · `md` · `lg` | uncontrolled (default `type='button'`) | `/components/button` |
| `Checkbox` | stable | — | — | **controlled only** (`checked` + `onCheckedChange`) | `/components/checkbox` |
| `TextInput` | stable | `default` | `sm` · `md` · `lg` | controlled + uncontrolled (`defaultValue` / `value`) | `/components/text-input` |
| `SearchInput` | stable | `default` | `sm` · `md` | controlled + uncontrolled (`defaultValue` / `value`) — built-in ⌘K shortcut hint + optional clear button | `/components/search-input` |
| `Dropdown` | stable | `default` · `tags` | `sm` · `md` | **stateless trigger** — consumer manages `open` + menu. Pass `<DropdownMenu>` to the `popup` prop (preferred since 0.1.8) so the popover anchors below the trigger correctly even with `hint`/`error` present. | `/components/dropdown` |
| `Tooltip` | stable | `default` · `info` · `warning` · `error` | — | n/a (wraps a focusable child) | `/components/tooltip` |
| `Badge` | stable | 11 colors: `green` · `lime` · `orange` · `yellow` · `red` · `purple` · `indigo` · `sky` · `blue` · `soft-gray` · `dark-gray` | — | optional `closable` (× icon); pass `onClose` for interactive remove | `/components/badge` |
| `Tab` | stable | `menu` · `underline` · `screen-nav` · `pill` (`tabType` prop) | — | stateless atom — consumer manages `active` + focus. Compose into a tablist | `/components/tab` |
| `Switch` | **experimental** (not in Figma yet) | — | `sm` · `md` | controlled + uncontrolled (`defaultChecked` / `checked` + `onCheckedChange`) | — |

**Utility export:** `cn(...args)` — Tailwind className composer dengan conflict resolution (`tailwind-merge` inside).

**Subpath imports (tree-shakable):**
```tsx
import { Button } from 'pod-test-ui/button';
import { Checkbox } from 'pod-test-ui/checkbox';
import { TextInput } from 'pod-test-ui/text-input';
import { SearchInput } from 'pod-test-ui/search-input';
import { Dropdown, DropdownMenu, DropdownItem, DropdownBadge } from 'pod-test-ui/dropdown';
import { Switch } from 'pod-test-ui/switch';
import { Tooltip } from 'pod-test-ui/tooltip';
import { Badge } from 'pod-test-ui/badges';
import { Tab } from 'pod-test-ui/tabs';
// Canvas/playground catalog (machine-readable manifest):
import { canvasManifest } from 'pod-test-ui/canvas';
// Compiled Tailwind utilities (for non-Tailwind consumers):
import 'pod-test-ui/styles.css';
```

Or top-level umbrella (less ideal for tree-shaking):
```tsx
import { Button, Checkbox, TextInput, Tooltip, cn } from 'pod-test-ui';
```

## Component intent map (untuk natural-language → primitive)

Kalau user bilang… | Pakai…
---|---
"button", "tombol", "CTA", "submit", "action" | `<Button>`
"primary action", "primary button" | `<Button variant="primary">`
"secondary", "outline button", "ghost button" | `<Button variant="outline">` (POD pakai `outline`, BUKAN `secondary`)
"danger", "destructive", "delete button", "error action" | `<Button variant="error">`
"icon only button" | `<Button iconOnly aria-label="..." leftIcon={<Icon />} />`
"loading button", "submitting" | `<Button loading>...</Button>` (auto-disabled + spinner)
"checkbox", "multi-select", "select all", "agree to terms" | `<Checkbox>`
"indeterminate", "partial select" | `<Checkbox checked="indeterminate">`
"search", "filter input", "query box", "cari" | `<TextInput leftIcon={<Search />} placeholder="…" />` (POD pakai TextInput, tidak ada primitive khusus SearchInput)
"text input", "form field", "text field", "input box" | `<TextInput>`
"text input dengan error", "validation error" | `<TextInput error="..." />`
"switch", "toggle", "on/off" | `<Switch>` ⚠ experimental — confirm dengan designer kalau ini final
"dropdown", "select", "picker", "combobox" | `<Dropdown popup={<DropdownMenu>...</DropdownMenu>} open={open} ...>` — pass menu as `popup` prop so it anchors correctly even with `hint`/`error`. Old "render `DropdownMenu` as sibling" pattern still works but mis-positions below hint.
"multi-select", "multi-pick", "tags input" | `<Dropdown variant="tags" tags={[...]} onRemoveTag={...} popup={<DropdownMenu>{checkboxItems}</DropdownMenu>} />`
"badge", "chip", "status pill", "filter tag" | `<Badge color="green">LABEL</Badge>` — 11 colors. `closable={true}` adds × icon; pass `onClose` to make it an interactive remove button.
"action menu", "context menu", "overflow menu" | `<Dropdown>` + `<DropdownMenu>` with `<DropdownItem leftAdornment={<Icon />}>` rows; destructive action = `<DropdownItem destructive>Delete</DropdownItem>`
"tooltip", "hover help", "shortcut hint" | `<Tooltip>` (wraps a focusable element)
"input text", "form field", "text box" | ❌ **Belum ada di pod-test-ui**. Build local pakai POD tokens (Rule 10 di consumer's CLAUDE.md)
"modal", "dialog", "popup" | ❌ Belum ada. Build local.
"select", "dropdown", "picker" | ❌ Belum ada. Build local.
"date picker", "calendar" | ❌ Belum ada. Build local.
"badge", "chip", "tag" | ❌ Belum ada. Build local.

## Token (Tailwind class) yang dijamin tersedia

### Backgrounds
`bg-canvas` · `bg-surface` · `bg-raised` · `bg-muted`

### Text colors
`text-text-primary` · `text-text-secondary` · `text-text-muted` · `text-text-disabled` · `text-text-inverse`

### Borders
`border-border-subtle` · `border-border-default` · `border-border-strong` · `border-border-focus`

### Brand (SACRED — never override these in components)
`accent` · `accent-hover` · `accent-active` · `accent-fg` · `accent-subtle`

### Feedback (each has `-hover`, `-active`, `-fg`, `-subtle`)
`danger` · `warning` · `success` · `info`

### Radius (resolved values di kanan)
`rounded-none` (0) · `rounded-xxs` (2) · `rounded-xs` (4) · `rounded-sm` (6) · `rounded-md` (8) · `rounded-lg` (10) · `rounded-xl` (12) · `rounded-2xl` (16) · `rounded-3xl` (20) · `rounded-4xl` (24) · `rounded-full` (9999)

### Shadows (drop)
`shadow-foundation-xs` · `shadow-foundation-sm` · `shadow-foundation-md` · `shadow-foundation-lg` · `shadow-foundation-xl` · `shadow-foundation-2xl` · `shadow-foundation-3xl`

### Shadows (brand glow)
`shadow-glow-accent-inset` · `shadow-glow-accent-inset-strong` · `shadow-glow-danger-inset` · `shadow-glow-danger-inset-strong` · `shadow-glow-accent-text`

### Motion
`duration-fast` · `duration-base` · `duration-slow` · `ease-standard` · `ease-emphasized` · `ease-press`

### Experimental (time-bounded — jangan pakai untuk UI produksi kecuali memang A/B test)
`bg-experiment-orange` · `bg-experiment-zinc-700` · `bg-experiment-primary-test`

> **Opacity modifier:** semua color token support `bg-canvas/80`, `text-accent/50`, dst. (R G B triple storage).

## REMOVED di versi 0.1.0 (jangan pakai meskipun masih nyangkut di muscle memory)
- `shadow-sm`, `shadow-md`, `shadow-lg` (non-`foundation-`-prefixed) — migrasi ke `shadow-foundation-sm/md/lg`.

## Aturan POD yang harus AI agent patuhi

0. **All visible copy in component code MUST be English.** Labels,
   placeholders, hints, errors, button text, badge content, tab labels,
   empty-state copy — semuanya English regardless of prompt language. The
   conversation can be Indonesian/Spanish/whatever; the code stays English.
   Only exception: user explicitly passes a string in their prompt as
   the literal copy ("set button to `Masuk`" → emit `Masuk` verbatim).
   ```tsx
   // ✅ <TextInput label="Email" placeholder="you@example.com" />
   // ❌ <TextInput label="Surel" placeholder="alamat@anda.com" />
   ```
1. **Use POD primitives first.** Kalau intent map a primitif, pakai itu — jangan native `<button>`/`<input>`.
2. **Token only.** Tidak ada hex (`#...`), tidak ada `rgb()`, tidak ada `style={{ color: ... }}` di app code.
3. **Tidak ada `dark:` modifier.** Dark mode di-handle automatic by token swap saat `.dark` class aktif di `<html>`.
4. **Tailwind v3 only.** Kalau muncul `@tailwindcss/postcss` di deps, refuse + suggest uninstall.
5. **Sacred tokens never modified.** `accent-*`, `danger-*`, `warning-*`, `success-*`, `info-*`, `border-focus`, `shadow-glow-*-*` — tidak boleh diubah valuenya. Color baru → `experiment-<name>`.
6. **Controlled-only components.** `Checkbox` wajib pakai prop+callback. Tidak ada `defaultChecked`.
7. **Tooltip target must be focusable.** Wrap `<Button>`, `<a>`, atau element dengan `tabIndex`. Tidak boleh wrap `<div>` / `<span>`.
8. **Icon-only Button needs `aria-label`.** Tooltip content bukan accessible name.
9. **Imports top-level.** `import { Button } from 'pod-test-ui'` — bukan subpath.
10. **Missing primitive → build local.** Lokasi: `src/components/<name>/<name>.tsx`. Wajib konsumsi POD tokens. Docs alasan di top of file comment.

## Cara verify file ini up-to-date

Saat AI agent ragu tentang apa yang tersedia:

```bash
cat node_modules/pod-test-ui/AGENTS.md         # this file
cat node_modules/pod-test-ui/package.json      # version check
ls node_modules/pod-test-ui/dist/              # confirm exports
```

Versi yang tertulis di header file ini = versi yang ter-install. Kalau `package.json` ngga match (bukan kemungkinan, tapi sanity check), invalidate this file dan trust `dist/index.d.ts` exports.

## Integration dengan agentation.dev (kalau project pakai)

Project konsumen yang punya `agentation` dependency dapat enrich annotation output dengan POD context via [`pod-agentation.ts` helper di client-test](https://github.com/.../client-test/src/lib/pod-agentation.ts) atau equivalent. Output enriched bakal include reference balik ke file ini — Claude saat eksekusi annotation tau intent + POD rule.

Flow ringkas:

```
Owner non-dev → klik element di browser (Agentation overlay)
              → tulis intent ("ganti ke outline")
              → output di-clipboard (enriched dengan POD rule reference)
              → paste ke Claude
              → Claude baca CLAUDE.md + AGENTS.md (file ini)
              → eksekusi dengan POD primitive + token, no hex
```
