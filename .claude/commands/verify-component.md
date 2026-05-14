---
description: Post-sync fidelity audit. Pulls fresh Figma data, builds variant matrix table, compares against component code, reports mismatches per (variant, state, size). Run after /sync-figma when component has many variants.
---

# /verify-component &lt;slug&gt;

Standalone audit — no code changes. Use to **prove** a component matches Figma
across ALL its variants. Run after `/sync-figma <slug>` for any component
that has more than 1 variant or more than 2 sizes (Button, Checkbox, TextInput,
future Select/Dropdown/Radio).

This command exists because user reports of "doesn't look like Figma" almost
always trace to AI inferring patterns instead of auditing every cell.

## Argument

- `/verify-component button`       → audit Button against Figma
- `/verify-component checkbox`     → audit Checkbox
- `/verify-component <any-slug>`   → audit by slug in .figma/manifest.json

If no arg → ask user for slug. Don't pick one.

## Sat-set protocol (NO code edits during audit)

### 1. Lookup manifest entry

```bash
node -e "const m = require('./.figma/manifest.json'); const slug = process.argv[1]; const e = m.components.find(c => c.slug === slug); if (!e) { console.error('Unknown slug:', slug); process.exit(1); } console.log(JSON.stringify(e, null, 2));" -- <slug>
```

Capture `nodeId` for MCP calls.

### 2. Pull fresh Figma data — FULL PATH

```
mcp__claude_ai_Figma__get_design_context({ nodeId: "<from manifest>", clientLanguages: "typescript,javascript", clientFrameworks: "react,tailwind" })
mcp__claude_ai_Figma__get_variable_defs({ nodeId: "<from manifest>" })
```

This is an **audit**, not a sync — always FULL PATH for variant matrix extraction.

### 3. Build the Figma variant matrix table

From `get_design_context` response, iterate `COMPONENT_SET.children`. For each
variant, emit a row to your working notes:

```
| Variant key                          | fill        | stroke         | radius | textColor | fontSize | padding | effects |
|---                                   |---          |---             |---     |---        |---       |---      |---      |
| Type=Primary,State=Default,Size=xs   | …           | …              | …      | …         | …        | …       | …       |
| ...                                  |             |                |        |           |          |         |         |
```

Rules:
- One row per `(variant, state, size)` combination from Figma. If component
  has 3 variants × 4 sizes × 3 states = **36 rows**.
- Never use `(same)` shortcut — every cell must hold an actual value.
- For state variants (Hover, Focused, Active, Disabled, Pressed), expand each.

### 4. Build the code-derived matrix table

Read [packages/ui/src/&lt;slug&gt;/&lt;slug&gt;.tsx](packages/ui/src/) and
[packages/tokens/src/theme.css](packages/tokens/src/theme.css).

For each `(v, s)` row in step 3, derive the expected CSS values:
- Find `variantClasses[v]` → list classes (e.g. `bg-accent-hover text-accent-fg outline outline-1 outline-accent rounded-lg`).
- Add `sizeClasses[s]` (e.g. `h-9 px-2.5 text-sm`).
- Add `base` class composition.
- Add state modifiers — for each state row in step 3, simulate the modifier:
  - `Hover` row → trace `hover:bg-X` classes
  - `Active` → `active:bg-X`
  - `Disabled` → `disabled:opacity-50` etc.
  - `Focused` → `focus-visible:ring-X`
- Resolve each Tailwind class → CSS variable → hex value (via theme.css `:root` block).

Produce the same table shape as step 3, populated from code.

### 5. Diff — produce mismatch report

Column by column for each row, compare Figma vs code. Build the diff table:

```
| Variant key                         | Property | Figma           | Code (resolved)      | Severity | Suggested fix                                          |
|---                                  |---       |---              |---                   |---       |---                                                     |
| Type=Primary,State=Default,Size=lg  | fill     | #1f71ff         | #15803d              | HIGH     | Add `experiment-primary-test` override scoped to lg    |
| Type=Outline,State=Hover,Size=md    | stroke   | #16a34a 1px     | #e4e4e7 1px          | MED      | Add `hover:outline-accent` to outline variant          |
| Type=Error,State=Default,Size=md    | radius   | 6px             | 8px (rounded-lg)    | LOW      | Change to `rounded-sm` for error variant only          |
```

Severity:
- **HIGH** — visible color/shape difference (fill, stroke, radius, font color)
- **MED** — visible motion / interaction differences (hover state, shadow)
- **LOW** — minor (padding by 2px, font weight 500 vs 600)

### 6. Final report

If diff table empty:
```
✓ <Slug> verified — N cells audited, 0 mismatches.
  Variants: <list>
  Sizes: <list>
  States: <list>
  Properties checked per cell: fill, stroke, radius, textColor, fontSize, padding, effects
```

If mismatches found:
```
⚠ <Slug> verified — N cells audited, X mismatches (HIGH: a, MED: b, LOW: c).

<paste the mismatch table>

NEXT STEPS:
- Run /sync-figma <slug> to apply HIGH-severity fixes (or fix manually).
- Decide per-variant override vs missed sync.
- Re-run /verify-component <slug> after fix.
```

## Forbidden during /verify-component

- ❌ Editing component code (this is audit-only; use /sync-figma for fixes).
- ❌ Skipping rows because "they probably match" — every row gets checked.
- ❌ Using `(same)` shortcut in either table.
- ❌ Touching sacred tokens to "make code match Figma" — if Figma drift is a
  per-variant override, that's an `experiment-*` token + targeted code override,
  not a brand change.
- ❌ Asking the user to confirm before audit — just run it.
- ❌ Modifying `.figma/state/<slug>.json` or running `bless.mjs` (those are
  the sync command's responsibility, not audit's).

## Speed budget

For 36-cell audit (Button-sized): ~2 minutes of agent activity. If audit takes
&gt;5 minutes you're over-explaining each cell. Tabular thinking, not narrative.

## When to use

| Situation | Use |
|---|---|
| Right after `/sync-figma <multi-variant-slug>` | YES — verify the sync was complete |
| User reports "component looks wrong in production" | YES — to localize the failing cell |
| Routine token-only swap (color value change, no shape) | NO — `check.mjs` is enough |
| Brand-new single-variant component | NO — not enough complexity to inference-fail |
| Foundation pages (color/spacing/radius) | NO — those aren't variant matrices |
