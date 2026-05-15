# CLAUDE.md — Project Instructions for AI Agents

This file is **mandatory reading** before generating or editing any code in this project.

---

## Project Identity

This is `client-test` — a React + Vite + TypeScript application that consumes the **POD Design System** via two npm packages:

- **`pod-test-ui`** — React components. Current shipped set: `Button`, `Checkbox`, `TextInput`, `SearchInput`, `Dropdown` (+ `DropdownMenu` / `DropdownItem` / `DropdownBadge`), `Tooltip`, `Switch` (experimental), **`Badge`** (added 0.1.8), **`Tab`** (added 0.1.8).
- **`pod-test-tokens`** — Design tokens (CSS variables + Tailwind preset). Source of truth for colors, radius, shadows, **spacing**, **font family**, **font size**, motion durations + easings, keyframes.

These packages are the **single source of truth** for visual design AND interaction primitives. They are token-driven, dark-mode-aware, and accessibility-aware. Treat them as production primitives — never re-implement what they provide.

> **Hard rule:** Every screen, page, or fragment generated in this project MUST be composed from `pod-test-ui` components and `pod-test-tokens` semantic classes. No native `<button>`, no hex codes, no ad-hoc styling, no third-party variants of primitives that POD already ships. If a primitive doesn't exist → see Rule 10.

> **The list above can lag the actual installed version.** Before generating code, ALWAYS check `node_modules/pod-test-ui/AGENTS.md` (ships in the tarball, auto-updates on `npm install`). That file is the ground truth — this CLAUDE.md is a project-level overview only.

---

## Stack — Locked

| Tool | Version | Notes |
|---|---|---|
| React | `^18.3.1` | Strict mode enabled |
| TypeScript | `^6.x` | `strict: true`, `noEmit: true` (Vite handles compilation) |
| Vite | `^8.x` | Dev server & build |
| **Tailwind CSS** | **`^3.4.x` (v3 ONLY)** | See "Tailwind Rules" below |
| `pod-test-ui` | **always latest published** | Currently `^0.1.8`. Bump on every release; never freeze on an old minor. |
| `pod-test-tokens` | **always latest published** | Currently `^0.1.8`. Lockstep with `pod-test-ui`. |
| `lucide-react` | latest | Icon set — bundled by `pod-test-ui` |

---

## CORE RULES (Non-negotiable)

### Rule -1 — Copy Locale: ENGLISH ONLY (regardless of conversation language)

Every visible string in generated component code MUST be **English**, full
stop. This applies to:

- `label`, `placeholder`, `hint`, `description`, `error` props on inputs / checkboxes / dropdowns
- Button text and link labels
- Tab labels, badge content, tooltip content
- Empty-state copy, page titles, section headings, table headers
- Any literal text that ends up rendered in the UI

```tsx
// ✅ ALWAYS (no matter what language the prompt is in)
<TextInput label="Email" placeholder="you@example.com" hint="We never share this." />
<Button>Sign in</Button>
<Badge color="green">READY</Badge>
<Dropdown placeholder="Select country" />

// ❌ NEVER
<TextInput label="Surel" placeholder="alamat@anda.com" hint="Kami tidak akan membagikan ini." />
<Button>Masuk</Button>
<Badge color="green">SIAP</Badge>
<Dropdown placeholder="Pilih negara" />
```

**Why:** This project is a public showcase for the POD design system. Demos
and prototypes ship to investors, partners, and external developers — the
locale audience is international. Bahasa Indonesia in component copy
looks like accidental developer leakage.

**The conversation can be in any language** (Indonesian, English, Spanish,
etc.) — the AI agent still responds in the user's language, but the *code
it generates* always has English strings.

**The only exception** — when the user EXPLICITLY passes a string in their
prompt as the literal copy:

- "set the button label to `Masuk`" → emit `<Button>Masuk</Button>` (user supplied)
- "placeholder text harus `Tulis pesan di sini...`" → emit verbatim (user supplied)

Otherwise default English. If unsure, default English.

### Rule 0 — Always Use the Latest NPM Version (PINNED-CARET, NOT FROZEN)

`package.json` deps for `pod-test-ui` and `pod-test-tokens` MUST use a caret
range pointing to the latest published version. Whenever a new version
ships on npm, bump both in lockstep, run `npm install`, and verify
`node_modules/pod-test-ui/AGENTS.md` reflects the new version. Component
availability + intent map + token list change between releases — old
AGENTS.md = stale rules in your head.

```jsonc
// ✅ package.json after every POD release
"dependencies": {
  "pod-test-tokens": "^0.1.8",
  "pod-test-ui":     "^0.1.8"
}
```

**Before generating any UI**, confirm three things:

1. `cat node_modules/pod-test-ui/package.json | grep version` — installed version.
2. `npm view pod-test-ui version` — latest on npm. If installed < latest,
   bump first. New components / new props you'd miss otherwise.
3. `cat node_modules/pod-test-ui/AGENTS.md` — ground-truth changelog +
   component table + intent map. Use those exact API names; don't
   guess from training data.

**Forbidden:**
- ❌ Pinning to an old version on purpose to "avoid breakage" — the design
  system uses semver. Patch / minor bumps are additive.
- ❌ Falling back to a local copy of a primitive that POD now ships
  (e.g. you built a local `Badge` before 0.1.8 — delete it, use the npm one).
- ❌ Generating UI without first re-reading `AGENTS.md` after a `npm install`.

### Rule 1 — Always Use Library Components (PAKEM, ZERO EXCEPTION)

When generating ANY UI — a screen, a card, a form, a single row — your first move is: **map the request to existing `pod-test-ui` primitives**. If a primitive maps, use it. No exceptions, no "just this once for prototype", no "let me hardcode quickly".

```tsx
// ✅ ALWAYS — import from the npm package, top-level entry
import {
  Button, Checkbox, TextInput, SearchInput,
  Dropdown, DropdownMenu, DropdownItem, DropdownBadge,
  Tooltip, Switch, Badge, Tab,
} from 'pod-test-ui';

<Button variant="primary">Save</Button>
<Checkbox checked={x} onCheckedChange={setX} label="Agree" />
<TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Email" />
<SearchInput placeholder="Search…" />
<Dropdown open={open} onClick={() => setOpen(o => !o)} popup={<DropdownMenu>...</DropdownMenu>} />
<Tooltip content="Hint"><Button iconOnly leftIcon={<X />} aria-label="Close" /></Tooltip>
<Switch checked={on} onCheckedChange={setOn} />
<Badge color="green">READY</Badge>
<Tab tabType="underline" active>Overview</Tab>

// ❌ NEVER — even for "quick" UI, even for "just a prototype"
<button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
<input type="checkbox" />
<input type="text" />
<div className="rounded-md bg-zinc-800 px-2 text-xs">READY</div>  {/* should be <Badge> */}
```

**Coverage map** (component → POD primitive):

| Asked for | Use this |
|---|---|
| Button, action, CTA, submit, link-styled-as-button | `<Button>` (variant: primary/outline/error) |
| Checkbox, multi-select, "select all", agree to terms | `<Checkbox>` |
| Text input, form field, email field, password field | `<TextInput>` |
| Search box, query input, filter input | `<SearchInput>` (built-in icon + ⌘K hint) |
| Dropdown, select, picker, combobox, single/multi-select | `<Dropdown popup={<DropdownMenu>...</DropdownMenu>}>` (pass menu via the `popup` prop since 0.1.8) |
| Removable filter chip, multi-select chip | `<Dropdown variant="tags" tags={[...]} onRemoveTag={...} popup={...} />` |
| Status badge, count chip, category tag, filter pill | `<Badge color="…">LABEL</Badge>` (11 colors, optional removable ×) |
| Tab, tab bar, segmented nav | `<Tab tabType="menu \| underline \| screen-nav \| pill" active={...}>` (atom — parent owns active state) |
| Tooltip, hover help, keyboard-shortcut hint, icon explanation | `<Tooltip>` |
| Toggle, on/off, enable feature | `<Switch>` ⚠ experimental — confirm with designer before shipping |
| Native `<button>` | ❌ Never. Always `<Button>`. |
| Native `<input type="checkbox">` | ❌ Never. Always `<Checkbox>`. |
| Native `<input type="text">` / `<input type="search">` | ❌ Never. Always `<TextInput>` / `<SearchInput>`. |
| Native `<select>` | ❌ Never. Always `<Dropdown popup={...}>`. |

If you find yourself writing `<button>`, `<input>`, `<select>`, or any styled `<div>` that *acts like* a primitive POD ships — STOP. Replace with the POD primitive. When in doubt, `cat node_modules/pod-test-ui/AGENTS.md` to confirm what's shipped in the installed version.

### Rule 2 — Always Use Semantic Tokens (color, radius, shadow, spacing, font, motion)

Every visual value MUST come from a token class exposed by the
`pod-test-tokens` Tailwind preset. Hex codes, `rgb()`, named colors,
arbitrary spacing (`p-[17px]`), and one-off font sizes are forbidden in
application code.

```tsx
// ✅ ALWAYS
<div className="bg-canvas text-text-primary border-border-default rounded-lg shadow-foundation-md p-4 gap-3">…</div>
<a className="text-accent hover:text-accent-hover text-sm font-medium">…</a>
<span className="bg-danger-subtle text-danger rounded-xs px-2 py-0.5">…</span>

// ❌ NEVER
<div className="bg-[#ffffff] text-[#181818] border-[#e4e4e7] p-[17px]">…</div>
<div style={{ background: '#16a34a', padding: '13px' }}>…</div>
<a className="text-green-600 hover:text-green-700 text-[15px]">…</a>
<input className="font-['Roboto']" />  {/* font family is locked to Inter via preset */}
```

**Available semantic token namespaces** (apply as Tailwind classes — `bg-X`, `text-X`, `border-X`, etc.):

- **Backgrounds:** `canvas`, `surface`, `raised`, `muted`
- **Text colors:** `text-primary`, `text-secondary`, `text-muted`, `text-disabled`, `text-inverse`
- **Borders:** `border-subtle`, `border-default`, `border-strong`, `border-focus`
- **Brand accent:** `accent`, `accent-hover`, `accent-active`, `accent-fg`, `accent-subtle` *(sacred — never override)*
- **Feedback:** `danger`, `warning`, `success`, `info` — each with `-hover`, `-active`, `-fg`, `-subtle`
- **Radius:** `rounded-none | xxs | xs | sm | md | lg | xl | 2xl | 3xl | 4xl | full`
  *(scale matches Figma foundation — values: 0/2/4/6/8/10/12/16/20/24/9999px). Inventing new keys is forbidden.*
- **Shadow (foundation drop scale):** `shadow-foundation-xs | sm | md | lg | xl | 2xl | 3xl`
- **Shadow (brand glow):** `shadow-glow-accent-inset[-strong]`, `shadow-glow-danger-inset[-strong]`, `shadow-glow-accent-text`
- **Spacing (padding / margin / gap):** Tailwind's stock scale — `0`, `0.5` (2px), `1` (4px), `1.5` (6px), `2` (8px), `2.5` (10px), `3` (12px), `4` (16px), `5` (20px), `6` (24px), `8` (32px), `10` (40px), `12` (48px), `16` (64px). **Never** use arbitrary `p-[Npx]` / `gap-[Npx]`. If the design calls for a value outside this scale, talk to the designer first.
- **Font family:** Locked to **Inter** (loaded via `next/font` upstream and via stylesheet in docs). Don't import another font. POD's `text-*` size classes assume Inter metrics.
- **Font size scale:** `text-xs` (12), `text-sm` (13 — dashboard default), `text-base` (14), `text-md` (15), `text-lg` (16), `text-xl` (18), `text-2xl` (20), `text-3xl` (24). Use these. Never `text-[15px]`.
- **Font weight:** `font-normal`, `font-medium`, `font-semibold`, `font-bold` — same as Tailwind defaults.
- **Motion:** `duration-fast | base | slow`, `ease-standard | emphasized | press`. Use `animate-menu-in` / `animate-menu-item-in` / `animate-fade-in` for entry; mirror their durations (220–280ms) for any custom exit motion.
- **Experimental** *(Figma-introduced primitives, time-bounded — promote or remove later)*:
  `bg-experiment-tab-base`, `bg-experiment-tab-chip`, `bg-experiment-tab-text`, `bg-experiment-badge-{color}-{bg,tag,fg}`, etc. **Don't touch these for production UI** — they exist for component internals.

Tokens are stored as `R G B` triples — opacity modifiers work: `bg-canvas/80`, `text-accent/50`, `border-border-default/30`.

**Removed (don't reach for from training memory):**
- `shadow-sm` / `shadow-md` / `shadow-lg` un-prefixed — migrate to `shadow-foundation-*`.
- `text-text-muted` was previously `#a1a1aa`; now scoped tokens (`experiment-tab-text` etc.) are darker per Figma. Don't try to "fix" the gray by switching tokens — different shades are intentional.

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

`pod-test-ui` currently ships: `Button`, `Checkbox`, `TextInput`, `SearchInput`,
`Dropdown` (+ DropdownMenu / DropdownItem / DropdownBadge), `Tooltip`, `Switch`,
`Badge`, `Tab`. **Confirm via `cat node_modules/pod-test-ui/AGENTS.md`** before
assuming something is missing — the list above may lag.

Truly missing (as of 0.1.8): `Modal` / `Dialog`, `Combobox`, `DatePicker`,
`Toast`, `Table`, dedicated `Field` / `Label` / `HelperText` primitives,
`Avatar`, `Pagination`.

If you need a `Tabs` group — compose `<Tab>` atoms in a `role="tablist"`
wrapper, parent owns active state (the `<Tab>` atom is what POD ships).
Same for `Badge` lists — just multiple `<Badge>` instances; no "BadgeGroup"
needed.

When the user asks for one of the truly missing primitives:

1. **Build it locally** in `src/components/` using the same token system (`bg-canvas`, `text-text-primary`, etc.) and the same patterns as `pod-test-ui` (forwardRef, controlled, semantic tokens, blur+scale exit motion for dismissals).
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
- ✗ Hardcoded spacing: `p-[17px]`, `gap-[10px]`, `m-[3px]` — use the stock Tailwind scale.
- ✗ Hardcoded font sizes: `text-[15px]`, `text-[24px]` — use `text-md`, `text-3xl`.
- ✗ Custom font family: `font-['Roboto']` — Inter is locked at the preset.
- ✗ `dark:` modifiers anywhere
- ✗ Native `<button>`, `<input type="checkbox">`, `<input type="text">`, `<input type="search">`, `<select>` for new UI — use `<Button>`, `<Checkbox>`, `<TextInput>`, `<SearchInput>`, `<Dropdown popup={…}>`
- ✗ Building a "Badge" / "Tab" / "Filter chip" yourself — POD ships `<Badge>` and `<Tab>` as of 0.1.8
- ✗ Rendering `<DropdownMenu>` as a sibling with `absolute` positioning — use `<Dropdown popup={…}>` so the popover anchors below the trigger even with hint/error present
- ✗ Tailwind v4 plugin (`@tailwindcss/postcss`) in `package.json`
- ✗ `<Tooltip>` wrapping a non-focusable element
- ✗ Icon-only `<Button>` without `aria-label`
- ✗ `defaultChecked` / uncontrolled `<Checkbox>` (Checkbox is controlled-only; TextInput / Switch DO accept uncontrolled, that's fine)
- ✗ Subpath imports: `pod-test-ui/dist/...`
- ✗ Re-implementing `Button`, `Checkbox`, `TextInput`, `SearchInput`, `Dropdown`, `Tooltip`, `Switch`, `Badge`, or `Tab`
- ✗ Legacy shadow classes (`shadow-sm`, `shadow-md`, `shadow-lg`) — removed in 0.1.0, migrate to `shadow-foundation-*`
- ✗ Inventing radius keys (`rounded-2.5xl`, `rounded-huge`) — only the documented scale is real
- ✗ Touching `experiment-*` tokens for "production" UI — those are time-bounded experiments, not stable primitives
- ✗ Instant DOM removal on user-triggered dismissal (filter chips, removable tags, toasts) — POD's removal-motion standard is 280ms blur+scale+width-collapse. See AGENTS.md "Motion" section for the recipe.
- ✗ Stale `package.json` — running against an older `pod-test-ui` than what's on npm. Run `npm view pod-test-ui version`; if installed < latest, bump first.

---

## Communication

- When the user requests something that conflicts with these rules (e.g. "just hardcode the color this once"), **ask before bending the rule**. Explain the trade-off briefly. The default answer is no.
- When the user asks for a primitive not in the library (Modal, Tabs, etc.), **propose the local-component approach** above and proceed unless told otherwise.
- When you make changes, name the components and tokens you used so the user can verify quickly.
- Keep responses concise. The rules are non-negotiable; you don't need to re-explain them every time.

---

**Bottom line:** This project's job is to *consume* the design system, not to recreate it. Use the components, use the tokens, follow the rules. Everything else flows from that.
