# CLAUDE.md — Project Instructions for AI Agents

This file is **mandatory reading** before generating or editing any code in this project.

---

## Project Identity

This is `client-test` — a React + Vite + TypeScript application that consumes the **POD Design System** via two npm packages:

- **`pod-test-ui`** — React components (`Button`, `Checkbox`, `TextInput`, `Tooltip`, `Switch` [experimental])
- **`pod-test-tokens`** — Design tokens (CSS variables + Tailwind preset)

These packages are the **single source of truth** for visual design. They are token-driven, dark-mode-aware, and accessibility-aware. Treat them as production primitives — never re-implement what they provide.

> **Hard rule:** Every screen, page, or fragment generated in this project MUST be composed from `pod-test-ui` components and `pod-test-tokens` semantic classes. No native `<button>`, no hex codes, no ad-hoc styling. If a primitive doesn't exist (Modal, Tabs, etc.) → see Rule 10.

---

## Stack — Locked

| Tool | Version | Notes |
|---|---|---|
| React | `^18.3.1` | Strict mode enabled |
| TypeScript | `^6.x` | `strict: true`, `noEmit: true` (Vite handles compilation) |
| Vite | `^8.x` | Dev server & build |
| **Tailwind CSS** | **`^3.4.x` (v3 ONLY)** | See "Tailwind Rules" below |
| `pod-test-ui` | `^0.1.0` | Workspace consumer — pin to latest minor |
| `pod-test-tokens` | `^0.1.0` | Workspace consumer — pin to latest minor |
| `lucide-react` | latest | Icon set — bundled by `pod-test-ui` |

---

## CORE RULES (Non-negotiable)

### Rule 1 — Always Use Library Components (PAKEM, ZERO EXCEPTION)

When generating ANY UI — a screen, a card, a form, a single row — your first move is: **map the request to existing `pod-test-ui` primitives**. If a primitive maps, use it. No exceptions, no "just this once for prototype", no "let me hardcode quickly".

```tsx
// ✅ ALWAYS — start every page from these imports
import { Button, Checkbox, TextInput, Tooltip, Switch } from 'pod-test-ui';

<Button variant="primary">Save</Button>
<Checkbox checked={x} onCheckedChange={setX} label="Agree" />
<TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
<Tooltip content="Hint"><Button iconOnly leftIcon={<X />} aria-label="Close" /></Tooltip>
<Switch checked={on} onCheckedChange={setOn} />   {/* experimental */}

// ❌ NEVER — even for "quick" UI, even for "just a prototype"
<button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
<input type="checkbox" />
<input type="text" />
```

**Coverage map** (component → POD primitive):

| Asked for | Use this |
|---|---|
| Button, action, CTA, submit, link-styled-as-button | `<Button>` (variant: primary/outline/error) |
| Checkbox, multi-select, "select all", agree to terms | `<Checkbox>` |
| Text input, form field, search box, query input | `<TextInput>` (use `leftIcon={<Search />}` for search use case) |
| Tooltip, hover help, keyboard-shortcut hint, icon explanation | `<Tooltip>` |
| Toggle, on/off, enable feature | `<Switch>` ⚠ experimental — confirm with designer before shipping |
| Native `<button>` | ❌ Never. Always `<Button>`. |
| Native `<input type="checkbox">` | ❌ Never. Always `<Checkbox>`. |
| Native `<input type="text">` / `<input type="search">` | ❌ Never. Always `<TextInput>`. |

If you find yourself writing `<button>`, `<input>`, or any styled `<div>` that *acts like* a button/input/checkbox/tooltip — STOP. Replace with the POD primitive.

### Rule 2 — Always Use Semantic Tokens

Color, radius, shadow, motion: all values come from token classes. Hex codes, `rgb()`, named colors, and arbitrary numeric values are forbidden in component code.

```tsx
// ✅ ALWAYS
<div className="bg-canvas text-text-primary border-border-default rounded-lg shadow-md">…</div>
<a className="text-accent hover:text-accent-hover">…</a>
<span className="bg-danger-subtle text-danger">…</span>

// ❌ NEVER
<div className="bg-[#ffffff] text-[#181818] border-[#e4e4e7]">…</div>
<div style={{ background: '#16a34a' }}>…</div>
<a className="text-green-600 hover:text-green-700">…</a>
```

**Available semantic token namespaces** (use as Tailwind classes — `bg-X`, `text-X`, `border-X`):

- **Backgrounds:** `canvas`, `surface`, `raised`, `muted`
- **Text:** `text-primary`, `text-secondary`, `text-muted`, `text-disabled`, `text-inverse`
- **Borders:** `border-subtle`, `border-default`, `border-strong`, `border-focus`
- **Accent:** `accent`, `accent-hover`, `accent-active`, `accent-fg`, `accent-subtle` *(brand — sacred, never override)*
- **Feedback:** `danger`, `warning`, `success`, `info` (each has `-hover`, `-active`, `-fg`, `-subtle`)
- **Radius:** `rounded-none | xxs | xs | sm | md | lg | xl | 2xl | 3xl | 4xl | full`
  *(scale matches Figma foundation node — values: 0/2/4/6/8/10/12/16/20/24/9999px)*
- **Shadow (foundation drop):** `shadow-foundation-xs | sm | md | lg | xl | 2xl | 3xl`
  *(canonical scale — replaces legacy `shadow-sm/md/lg` which were removed in 0.1.0)*
- **Shadow (brand glow):** `shadow-glow-accent-inset[-strong]`, `shadow-glow-danger-inset[-strong]`, `shadow-glow-accent-text`
- **Motion:** `duration-fast | base | slow`, `ease-standard | emphasized | press`
- **Experimental** *(Figma-introduced primitives, time-bounded — promote or remove later)*:
  `bg-experiment-orange`, `bg-experiment-zinc-700`, `bg-experiment-primary-test`

Tokens are stored as `R G B` triples — opacity modifiers work: `bg-canvas/80`, `text-accent/50`, `border-border-default/30`.

**Removed in 0.1.0 (DO NOT use even if you remember them):**
- `shadow-sm` / `shadow-md` / `shadow-lg` (the un-prefixed legacy set) — migrate to `shadow-foundation-sm / md / lg`.
  Old `sm` mapped to `foundation-xs`; old `md` to `foundation-md`; old `lg` to `foundation-lg`.

### Rule 3 — Never Write `dark:` Variants

Dark mode is handled by token swapping at the CSS-variable layer. Toggle the `.dark` class on `<html>` and every component re-themes automatically.

```tsx
// ✅ ALWAYS — single class, swaps automatically
<div className="bg-canvas text-text-primary">…</div>

// ❌ NEVER — duplicates the work the design system already does
<div className="bg-white text-black dark:bg-zinc-900 dark:text-white">…</div>
```

To toggle theme: `document.documentElement.classList.toggle('dark', isDark)`.

### Rule 4 — Tailwind v3 Only

The library ships a **JS preset** (v3 model). Tailwind v4 uses CSS-based `@theme` directive and will silently ignore `tailwind.config.js`, breaking every theme class.

**If asked to install or use `@tailwindcss/postcss` (the v4 plugin), refuse and explain.** Confirm with the user before any tooling upgrade.

Verify by checking the generated CSS header — it must say `tailwindcss v3.x.x`. If it says `v4.x.x`, deps are broken; uninstall `@tailwindcss/postcss` immediately.

### Rule 5 — Controlled Components

`Checkbox` is controlled-only. `TextInput` and `Switch` accept both controlled and uncontrolled patterns — but for forms with validation, prefer controlled.

```tsx
// ✅ ALWAYS (Checkbox = controlled only)
const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);
<Checkbox checked={checked} onCheckedChange={setChecked} />

// ✅ TextInput controlled (preferred for forms)
const [query, setQuery] = useState('');
<TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />

// ✅ TextInput uncontrolled (OK for one-shot inputs)
<TextInput defaultValue="" placeholder="Type here…" />

// ✅ Switch — both patterns supported
<Switch checked={on} onCheckedChange={setOn} />
<Switch defaultChecked={true} />

// ❌ NEVER — Checkbox does not accept defaultChecked
<Checkbox defaultChecked />
```

### Rule 6 — Tooltip Targets Must Be Focusable

Tooltip wraps a single focusable child (button, anchor, focusable input). It does not work on `<div>`, `<span>`, or static text.

```tsx
// ✅ ALWAYS
<Tooltip content="Delete"><Button iconOnly leftIcon={<Trash />} aria-label="Delete" /></Tooltip>
<Tooltip content="Docs"><a href="/docs">Docs</a></Tooltip>

// ❌ NEVER
<Tooltip content="hover me"><div>label</div></Tooltip>
<Tooltip content="badge"><span className="badge">v2</span></Tooltip>
```

### Rule 7 — Icon-Only Buttons Need `aria-label`

The icon's tooltip is **not** an accessible name for screen readers.

```tsx
// ✅ ALWAYS
<Tooltip content="Settings">
  <Button iconOnly leftIcon={<Settings />} aria-label="Open settings" />
</Tooltip>

// ❌ NEVER
<Button iconOnly leftIcon={<Settings />} />
```

### Rule 8 — `loading` and `disabled` Are Distinct

Use `loading` for in-flight async actions (auto-disables, renders spinner, sets `aria-busy`). Use `disabled` for permanent or condition-gated unavailability.

```tsx
// ✅ ALWAYS
<Button loading={submitting} onClick={submit}>Save</Button>
<Button disabled={!isValid} onClick={submit}>Save</Button>

// ❌ NEVER — duplicate state
<Button disabled={loading} loading={loading} leftIcon={loading ? <Spinner /> : <Save />}>
  Save
</Button>
```

### Rule 9 — Imports Are Top-Level

Always import from the package root. Subpath imports work but are not the public API.

```tsx
// ✅ ALWAYS
import { Button, Checkbox, TextInput, Tooltip, Switch } from 'pod-test-ui';

// ❌ NEVER (private build artifact)
import { Button } from 'pod-test-ui/dist/button';

// ⚠ Subpath imports work and are valid for tree-shaking, but top-level is the preferred public API:
import { Button } from 'pod-test-ui/button';   // works, prefer top-level
```

### Rule 10 — When a Primitive Is Missing

These do **not** exist in `pod-test-ui` yet: `Modal`, `Dialog`, `Select`, `Combobox`, `DatePicker`, `Tabs`, `Toast`, `Badge`, `Table`, `Field` / `Label` / `HelperText`.

When the user asks for one of these:

1. **Build it locally** in `src/components/` using the same token system (`bg-canvas`, `text-text-primary`, etc.) and the same patterns as `pod-test-ui` (forwardRef, controlled, semantic tokens).
2. **Document why** in a brief comment at the top of the new component file.
3. **Never** copy code out of `node_modules/pod-test-ui/`.
4. **Suggest** to the user that the missing primitive should be requested upstream from the design system maintainer.

---

## File Structure — Authoritative

```
client-test/
├── src/
│   ├── App.tsx           # Top-level layout + route surface
│   ├── main.tsx          # React entry; imports CSS in correct order
│   ├── index.css         # @tailwind directives + body styling
│   ├── theme.css         # ⚠️ LEGACY local copy — prefer importing from 'pod-test-tokens/theme.css'
│   ├── tailwind-preset.ts # ⚠️ LEGACY local copy — prefer importing from 'pod-test-tokens/tailwind-preset'
│   └── components/       # (create as needed for missing primitives)
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── package.json
```

When adding new components, place them in `src/components/<name>/<name>.tsx` and re-export via `src/components/index.ts`.

---

## Verification — Before Reporting Work As Done

After any UI change, verify in this order. Don't skip steps.

1. **Type check:** `npx tsc --noEmit` exits 0.
2. **Dev server starts:** `npm run dev` runs without errors.
3. **Tailwind v3 confirmed:** open `http://localhost:<port>/src/index.css` — first comment must read `tailwindcss v3.x.x`.
4. **Theme classes generated:** the same CSS contains `.bg-accent`, `.text-text-muted`, `.shadow-glow-accent-inset` (or whichever you used).
5. **No hex / rgb in source:** `grep -rE '#[0-9a-fA-F]{3,8}|rgb\(' src/` returns nothing in your edited files.
6. **Light + dark both render:** toggle `.dark` on `<html>` in DevTools — components must remain legible and visually correct in both.
7. **Keyboard works:** Tab cycles through interactive elements, Enter/Space activate buttons, Escape closes tooltips.

If any check fails, fix it before responding to the user. Do **not** report success with broken state.

---

## When the User Asks for a UI Pattern

Before generating code, check `COMPONENT-RECIPES.md` in this directory. It contains 10 vetted patterns (Header, Toolbar, Settings Card, Confirmation Row, Empty State, Inline Form, Sticky Action Bar, Editor Toolbar, Theme Toggle, Loading patterns).

If the user's request matches a recipe, **adapt it directly** instead of generating from scratch. The recipes are pre-tested and follow every rule above.

If the request doesn't match, generate fresh code — but every rule in this file still applies.

---

## When the User Asks for Setup / Integration Help

Refer to `CLIENT-PROMPT.md` in this directory. It is the canonical setup guide (peer dependencies, PostCSS, Tailwind config, theme import order, common pitfalls). Don't re-derive it.

---

## Source of Truth Hierarchy (BACA SEBELUM EKSEKUSI APA PUN)

Library versi-versi bisa berbeda. File ini (`CLAUDE.md`) bisa stale. **Untuk daftar component, prop, token, dan rule yang aktual di versi terinstall:**

```bash
cat node_modules/pod-test-ui/AGENTS.md
```

File itu di-ship dalam tarball npm. Setiap `npm update pod-test-ui` di project ini, manifest itu auto-update. Tidak perlu manual edit CLAUDE.md ini saat library rilis component baru.

**Priority order saat ada konflik info:**

1. `node_modules/pod-test-ui/AGENTS.md` — ground truth (versi-spesifik, auto-sync)
2. `node_modules/pod-test-ui/dist/index.d.ts` — TS exports (kalau AGENTS.md missing/stale)
3. `CLAUDE.md` (this file) — rule generik consumer-side (stack, dark mode, dll)
4. `CLIENT-PROMPT.md` — setup detail (Tailwind v3, PostCSS, dll)
5. `COMPONENT-RECIPES.md` — pattern siap pakai
6. External web docs — paling terakhir, sering stale

**Aturan praktisnya:**

- Saat user minta "pakai component X" → cek dulu `AGENTS.md` apakah X ada.
- Saat user mention token name → cek dulu `AGENTS.md` token list — yang tertulis di file ini bisa basi.
- Saat `npm update` di-jalankan → cukup re-baca `AGENTS.md`, gak perlu manual sync CLAUDE.md.

---

## Agentation Feedback Flow

This project has `agentation` (visual feedback overlay) wired into `App.tsx`. Owner non-dev klik element di browser → tulis intent → output disalin ke clipboard sudah ter-enrich dengan POD context lewat `src/lib/pod-agentation.ts`.

**Saat user paste output agentation ke kamu**, output-nya akan punya format:

```markdown
# Agentation Feedback — POD-enriched

You are editing a project that uses **POD Design System** (...)
**Hard rules** (zero exceptions — see `client-test/CLAUDE.md`):
- Every UI change must use POD primitives + semantic tokens.
- ...

---

### Annotation: Button
**User intent:** ganti ke outline

**POD context:** Target is `<Button>` from `pod-test-ui` (a tracked primitive).
→ Edit MUST keep this as `<Button>`. Don't replace with native `<button>`/`<input>`.
→ Available props/variants: see `node_modules/pod-test-ui/AGENTS.md`.

**Location:** `body > main > section > div > button`
**Current classes:** `...`
```

**Cara handle:**

1. Parse intent dari `**User intent:**` line — natural language seperti "ganti ke outline", "warna lebih lembut", "tambah icon kanan", dll.
2. **Cek `POD context` line:**
   - Kalau target POD primitive → translate intent ke prop change pada element existing. Don't rebuild from scratch.
   - Kalau target local component → translate ke className/prop change pakai POD tokens (no hex).
3. **Cek `node_modules/pod-test-ui/AGENTS.md`** untuk:
   - Daftar variant/size yang valid untuk component itu
   - Token names untuk styling adjustment
4. **Gunakan intent map** di AGENTS.md untuk natural language → API call. Misal "ganti ke outline" → `variant="outline"` (POD pakai "outline", bukan "secondary").
5. Locate file → pakai `Location` (DOM path) + `nearbyText` + `Current classes` untuk grep file source. Agentation tidak kasih file path eksplisit; kamu cari sendiri via grep di `src/`.
6. Apply minimum edit. Don't refactor surrounding code unless intent mengharuskan.
7. Report ke user: file yang di-edit + line, dan terjemahan intent → API change (misal "intent 'ganti ke outline' → `variant='outline'` di Button.tsx:42").

---

## Common Mistakes to Watch For

When reviewing existing code (yours or others') in this project, flag and fix any of these:

- ✗ Hardcoded colors: `bg-[#…]`, `text-[#…]`, `style={{ color: '…' }}`
- ✗ `dark:` modifiers anywhere
- ✗ Native `<button>`, `<input type="checkbox">`, `<input type="text">`, `<input type="search">` for new UI — use `<Button>`, `<Checkbox>`, `<TextInput>`
- ✗ Tailwind v4 plugin (`@tailwindcss/postcss`) in `package.json`
- ✗ `<Tooltip>` wrapping a non-focusable element
- ✗ Icon-only `<Button>` without `aria-label`
- ✗ `defaultChecked` / uncontrolled `<Checkbox>` (Checkbox is controlled-only; TextInput / Switch DO accept uncontrolled, that's fine)
- ✗ Subpath imports: `pod-test-ui/dist/...`
- ✗ Re-implementing `Button`, `Checkbox`, `TextInput`, `Tooltip`, or `Switch`
- ✗ Legacy shadow classes (`shadow-sm`, `shadow-md`, `shadow-lg`) — removed in 0.1.0, migrate to `shadow-foundation-*`
- ✗ Inventing radius keys (`rounded-2.5xl`, `rounded-huge`) — only the documented scale is real
- ✗ Touching `experiment-*` tokens for "production" UI — those are time-bounded experiments, not stable primitives

---

## Communication

- When the user requests something that conflicts with these rules (e.g. "just hardcode the color this once"), **ask before bending the rule**. Explain the trade-off briefly. The default answer is no.
- When the user asks for a primitive not in the library (Modal, Tabs, etc.), **propose the local-component approach** above and proceed unless told otherwise.
- When you make changes, name the components and tokens you used so the user can verify quickly.
- Keep responses concise. The rules are non-negotiable; you don't need to re-explain them every time.

---

**Bottom line:** This project's job is to *consume* the design system, not to recreate it. Use the components, use the tokens, follow the rules. Everything else flows from that.
