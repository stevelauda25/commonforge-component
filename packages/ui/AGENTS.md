# `pod-test-ui` — Manifest untuk AI Agent

> **AI agent yang sedang edit kode di project konsumen `pod-test-ui`: BACA FILE INI sebelum kasih saran code change.**
> File ini ground truth tentang component + token yang tersedia di versi **yang ter-install** di project ini. Versi ke versi bisa beda — selalu cek `node_modules/pod-test-ui/AGENTS.md`, bukan dokumentasi eksternal.

## Versi & sumber kebenaran

```json
{
  "package": "pod-test-ui",
  "version": "0.1.4",
  "manifest_version": 1,
  "last_updated": "2026-05-13"
}
```

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
| `Tooltip` | stable | `default` · `info` · `warning` · `error` | — | n/a (wraps a focusable child) | `/components/tooltip` |
| `Switch` | **experimental** (not in Figma yet) | — | `sm` · `md` | controlled + uncontrolled (`defaultChecked` / `checked` + `onCheckedChange`) | — |

**Utility export:** `cn(...args)` — Tailwind className composer dengan conflict resolution (`tailwind-merge` inside).

**Subpath imports (tree-shakable):**
```tsx
import { Button } from 'pod-test-ui/button';
import { Checkbox } from 'pod-test-ui/checkbox';
import { TextInput } from 'pod-test-ui/text-input';
import { Switch } from 'pod-test-ui/switch';
import { Tooltip } from 'pod-test-ui/tooltip';
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
