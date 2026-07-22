---
description: Pull a component from Figma and sync tokens, code, and docs in one shot. Sat-set mode.
---

# /sync-figma

**Argument:** `$ARGUMENTS` — a slug (`button`), a Figma URL, a `<fileKey>:<nodeId>` pair, or empty (then fall back to `manifest.json` last-touched).

## Mindset

The user is the design authority. You are not. They saw the drift via
`node scripts/figma/check.mjs` before triggering this command and signed off
by the act of running it. **Execute the full pipeline. Pause only if you
literally cannot complete the work** (Figma 404, file outside scope, etc.).

Anomalies are footnotes in the report. They are not veto reasons. Single
variant changing color → still update accent tokens to match. New token
that "looks experimental" → still wire it through. Drop the second-guessing.

## Speed budget — TARGET: < 30 seconds, < 6KB tokens

Most syncs are token-level (color/binding swaps). For those:

- **FAST PATH** for MCP (1 call instead of 4). See step 2.
- **Skip variables.json refresh** if all binding IDs already in cache. See step 2.5.
- **Single batched bash** for build+bless+verify+restart. See step 6+7.
- **Use Edit (not Write)** for incremental file changes — Write entire files only
  if reformulating from scratch.
- **Skip orphan walkthrough** if `grep "experiment-"` returns 0 matches.

If you find yourself doing 5+ separate bash calls or 10+ file edits for one
sync, you're being slow. Cut.

## Steps (run in order, don't ask between)

### 0. Resolve target

- If `$ARGUMENTS` is a slug → look up `nodeId` in [.figma/manifest.json](.figma/manifest.json).
- If `$ARGUMENTS` is a Figma URL → parse `fileKey` + `nodeId` (convert `-` to `:` in nodeId).
- If `$ARGUMENTS` is `<fileKey>:<nodeId>` → use as-is.
- If empty → list manifest slugs and ask user. Resume on their reply.

### 0.5 FIRST-SYNC GUARD — MANDATORY (this is where you previously fucked up)

Before anything else, decide: is this a **first-sync** for the slug?

A sync is FIRST-SYNC when EITHER condition holds:
1. The slug was just added via `/new-item` and has never been synced
2. `packages/ui/src/<slug>/<slug>.tsx` exists but was hand-written / pre-dates the
   Figma node entering tracking (i.e. code was authored without ever consulting
   `get_design_context`)

If FIRST-SYNC → **FULL PATH is mandatory** (skip FAST PATH entirely). You MUST:

1. Pull `get_design_context` AND `get_screenshot`.
2. Read the design_context output **line by line** and audit existing code against it. Every:
   - `rounded-[Npx]` in design_context → map to the EXACT POD radius token
     (`xxs=2, xs=4, sm=6, md=8, lg=10, xl=12, 2xl=16, 3xl=20, 4xl=24`).
     If you used `rounded-sm` when Figma says `rounded-[4px]` — that's `rounded-xs`. Fix it.
   - `bg-[var(--xxx)]` in design_context → trace to the right semantic token.
     `--background/bg-white` is **NOT** `accent`. `--icon/icon-black` is **NOT** `accent-fg`.
     Inverted-neutral patterns map to `text-primary` / `canvas`, not brand colors.
   - `size-[Npx]` / icon `inset-[X%]` → match dimensions exactly. Lucide
     `h-3 w-3` (12px) for an icon Figma sized at ~7px = wrong. Use `h-2.5 w-2.5`.
   - Every variant branch in design_context (Hover, Focused, Disabled, etc.)
     → confirm code has matching state styles. Missing inner-box / shadow /
     border-ring effects count as drift.
3. **Default assumption: existing code is wrong.** It was written before Figma
   was ground truth. Trust `get_design_context` over `cn(...)` chains.

**Do not bless** until visual audit passes. `bless` only freezes the variable
hash — it does NOT validate visual fidelity. `check.mjs IN SYNC` after a
first-sync without visual audit is a LIE waiting to be discovered by the user.

**FIRST-SYNC variant matrix audit (only when component has >1 variant OR >2 sizes):**

For Button-like components (3v × 4s × 3 states = 36 cells), inference is the
common failure mode. Required ONLY on first-sync (existing-component routine
sync stays FAST PATH, no audit overhead):

1. From `get_design_context.COMPONENT_SET.children`, emit ONE row per
   `(variant, state, size)` combo as a markdown table with columns:
   `fill | stroke | radius | textColor | fontSize | fontWeight | padding | effects`.
2. Trace each row to the generated `variantClasses[v]` + `sizeClasses[s]` +
   state modifiers in your scaffolded `.tsx`. Resolve every Tailwind class
   → theme.css → hex.
3. Diff. Forbidden statements: "probably same as md", "all sizes share radius",
   "outline hover is just a darker variant". Every row gets its own check.
4. Per-variant overrides (e.g. `Primary/lg` = a non-brand color) → add
   `experiment-<name>` token + targeted `variant === 'X' && size === 'Y'`
   override. NEVER touch sacred tokens.
5. Final report adds: `Variant matrix audited: N cells, M mismatches → fixed`.

If you suspect drift in an already-validated component (user reports "looks
wrong"), don't re-audit in `/sync-figma` — use `/verify-component <slug>` as
a standalone audit instead. Keeps routine sync fast.

**Forbidden rationalizations:**
- ❌ "Existing code uses `accent`, probably the designer meant brand color" — NO.
  Figma is ground truth. Read what it says, not what feels semantically clean.
- ❌ "`rounded-sm` is close enough to 4px" — NO. 6px vs 4px is a 50% radius
  delta. User WILL notice.
- ❌ "I'll skip get_design_context, the variables tell me everything" — NO.
  Variables tell you colors. design_context tells you geometry, structure, states.
- ❌ "Bless first, fix visuals later" — NO. Bless is a commitment that the
  current code matches Figma. If it doesn't, you're publishing a lie.

If NOT first-sync (slug has been synced visually before, drift is just token
swap on already-correct code) → FAST PATH from step 2 is fine.

### 1. Gather drift context

Run:

```bash
node scripts/figma/check.mjs <slug>
```

Capture which variants drifted and the property-level changes. Use this to
scope your edits — you don't need to regenerate untouched variants.

### 2. Pull Figma context — FAST PATH vs FULL PATH

**FAST PATH (default for token-only drift on already-validated code)** — only call:

1. `mcp__claude_ai_Figma__get_variable_defs` — to enrich variables.json

Skip metadata/screenshot/design_context. Drift output from step 1 already
tells you which variants and properties changed. You don't need rendered
code or pixel reference for token swaps.

**FAST PATH IS BANNED IF FIRST-SYNC GUARD (step 0.5) TRIPPED.** No exceptions.

**FULL PATH (only when needed)** — call all 4 MCP tools:

1. `mcp__claude_ai_Figma__get_metadata`
2. `mcp__claude_ai_Figma__get_variable_defs`
3. `mcp__claude_ai_Figma__get_design_context`
4. `mcp__claude_ai_Figma__get_screenshot`

Use FULL PATH only when:
- Brand-new component (no existing code to reference)
- Drift involves structural change (variant added/removed, layer shape changed)
- You're unsure how to render the change in code

For routine color/binding changes: **FAST PATH wins**. Skips ~5KB of MCP output
and 3 seconds.

### 2.5 Update `.figma/variables/<slug>.json` — per-component, only if needed

**Skip this step if** the drift output (step 1) shows binding IDs that
ALREADY appear in the dictionary. No new IDs = no new tokens = cache fresh.

**Otherwise**, FULL REPLACE `.figma/variables/<slug>.json` (per-component
file) with the result of `get_variable_defs`. Also bump `syncedAt`.

**Mandatory post-process — Font family safety coerce (idempotent):**

Before writing the variables file, run this sed-style transform on EVERY value:

```
Font(family: "SF Pro", ...)  →  Font(family: "Inter", ...)
Font(family: "SF-Pro", ...)  →  Font(family: "Inter", ...)
```

**Status (2026-05-11):** Designer has migrated Figma composites to Inter. This
rule is currently a **no-op** in practice — every sync passes through unchanged.

**Why we keep it as a guard:** If designer accidentally introduces SF Pro again
in a new composite token, the rule catches it before it pollutes the snapshot
dictionary. Cost = zero (idempotent string scan). Benefit = standardization
enforcement at sync-time.

When you can finally delete this rule: after 6 weeks with zero coercion triggers
(track via grep below), the safety guard isn't earning its keep. Until then, keep.

Track via:

```bash
grep -r "SF Pro\|SF-Pro" .figma/variables/  # should be empty post-coercion
```

Per-component files prevent foundation tokens (radius/shadow) from being
overwritten when /sync-figma button refreshes button-scoped variables.
`_lib.mjs loadVariableDictionary()` merges ALL files in `.figma/variables/`.

File schema:

```json
{
  "version": 1,
  "slug": "button",
  "fileKey": "TCd9exLXTUMciyw1VqnPSK",
  "nodeId": "267:355",
  "syncedAt": "2026-05-02T00:00:00Z",
  "variables": { "name": "value", ... }
}
```

**Why full replace per-component (not merge globally)**:
- Designer renames/deletes Figma variables. Merge keeps stale entries.
- get_variable_defs(slug) returns complete set for that subtree.

This dictionary is what `check.mjs` uses to enrich diff output — so a
binding ID shows as `components/button/surface-primary (id 16:853)`
instead of raw `16:853`.

> **Foundation tokens note**: radius/shadow tokens are stored in
> `.figma/variables/foundation-radius.json` and `foundation-shadows.json`
> respectively. They're manually maintained (not tied to a specific
> Component Set) — refresh them only if designer changes the foundation
> scale, via `/sync-figma foundation-radius` or `foundation-shadows`.

### 3. Detect anomalies (don't block on them)

Flag for the report (but proceed):

- Token name contains `test`, `draft`, `tmp`, `temp`, `wip`, `experiment`.
- Single-variant change for a property typically applied universally
  (e.g. only `Primary/Default/Large` changed when other Primary variants
  didn't — possible A/B test in production file).
- New token that doesn't fit the existing semantic naming pattern
  (e.g. `primary-test-500` vs the established `accent-default`/`accent-hover`).
- Brand-shift heuristics: hue change > 30° on accent token while other tokens
  unchanged — likely experimental.

Add each to a `⚠ Caution` list in the final report. Continue.

### 4. Map variables → tokens (THIS IS WHERE YOU NORMALLY FUCK UP — READ CAREFULLY)

Walk every Figma variable and decide:

- **Already mapped to a SACRED token** (e.g. `components/button/surface-primary`
  ↔ `--color-accent-hover`) → reuse. **Do NOT update the sacred token's value
  even if Figma's value differs.** A single Figma variant changing color is
  NEVER a reason to alter the sacred token. See `CLAUDE.md` "Sacred tokens".

- **New color outside brand palette** (anything where Figma uses a primitive
  like `blue/500`, `purple/300`, or a one-off hex) → add `--color-experiment-<descriptive-name>`
  to `theme.css` (both `:root` and `.dark`), expose in `tailwind-preset.ts`,
  then wire to the affected variant via targeted override in component code.

- **Genuine token rename** (e.g. `radius-md` value Figma now reports differently
  but token still semantically the same) → update value in theme.css. Rare.

If you ever find yourself thinking "should I just update accent-default to
match Figma's blue?" — STOP. The answer is no. Always experiment-* + targeted
override.

#### Sacred token namespace map — ENFORCEABLE BOUNDARY

Each sacred namespace has a STRICT semantic role. Cross-namespace mapping is
**FORBIDDEN**, even when hex values coincidentally look similar.

| Figma variable prefix | ONLY maps to | NEVER maps to |
|---|---|---|
| `components/<x>/surface-primary*` | `accent-default`, `accent-hover`, `accent-active`, `accent-subtle` | `danger-*`, `warning-*`, `success-*`, `info-*` |
| `components/<x>/text-primary*` / `icon-primary*` | `accent-fg`, `text-text-*` | `danger-fg`, sacred siblings |
| `components/<x>/surface-error*` | `danger-default`, `danger-hover`, `danger-active`, `danger-subtle` | `accent-*`, `warning-*` |
| `components/<x>/surface-secondary*` / `text-secondary*` | `text-text-secondary`, `bg-surface`, `bg-muted` | sacred brand namespaces |

**Why this matters (a real incident, 2026-05-11):**

A previous sync mapped `components/button/surface-primary-hover` (Figma value
`#15803d`, which equals `accent-hover` value) to `hover:bg-danger-hover`
(`#991b1b`, completely different color, wrong namespace). Result: primary
button hover rendered MAROON in production. The mistake passed code review
because the override "looked like a one-line surgical fix" — but it crossed
the accent → danger boundary. Sacred token boundaries are about SEMANTIC role,
not just protecting hex values.

**Decision protocol when uncertain:**

1. Read the Figma variable name. Identify its semantic role (`primary` →
   accent namespace; `error` → danger namespace; `secondary` → neutral).
2. Pick the POD token from the SAME namespace. Never reach across.
3. If the Figma hex doesn't match any accent-* / danger-* / etc value, that
   means it's a NEW color — go to `experiment-*` rule above.
4. If you ever type `hover:bg-danger-*` while editing a `variant === 'primary'`
   override (or `hover:bg-accent-*` for `variant === 'error'`), STOP. Re-read
   step 4. That edit is the symptom of a namespace violation.

**Grep-able guard** — run before commit:

```bash
grep -nE "variant === 'primary'.*danger-|variant === 'error'.*accent-" packages/ui/src/**/*.tsx
# Expected output: empty. Any match = namespace violation.
```

### 5. Apply edits — granular, one shot

| File | When to touch |
|---|---|
| `packages/tokens/src/theme.css` | Add `--color-experiment-*` (both modes). DO NOT modify sacred tokens. |
| `packages/tokens/src/tailwind-preset.ts` | Expose new `experiment-*` as utility class. |
| `packages/ui/src/<slug>/<slug>.tsx` | Add ONE-LINE override scoped to exact (variant, size) Figma changed. |
| `apps/docs/src/pages/components/<Pascal>.mdx` | Auto-create if missing (see step 5.5). Only edit existing if variants/sizes/props changed (rare). |
| `apps/docs/src/lib/routes.ts` | Brand-new component → auto-add (see step 5.5). Or flip `planned` → `ready`. |

**Granular rule:** if Figma drift says `Type=Primary, Size=Large` only —
your override matches `variant === 'primary' && size === 'lg'` only. No
broader scope. No "while we're at it, let me also update Medium". No.

> **Multi-variant fidelity audit** is folded into **step 0.5 FIRST-SYNC GUARD**
> only — for new components being scaffolded from scratch. Routine sync of
> already-validated code does NOT re-audit every cell (FAST PATH stays fast).
> If you need to spot-check an existing component, use `/verify-component <slug>`
> as a separate, user-triggered audit.

### 5.5 Auto-create docs MDX if missing

After applying code edits, check if the docs page for this slug exists.
If not, scaffold it from a template — every new component must be visible
in the docs site, no orphan tracked components.

**Detect slug type from manifest entry:**
- Slug starts with `foundation-*` → foundation page (uses `TokenAutoGrid`).
- Otherwise → regular component (uses `<Component>`, `PageHeader`, etc).

**Where to write:**

| Slug type | MDX path |
|---|---|
| Component | `apps/docs/src/pages/components/<PascalCase>.mdx` |
| Foundation (`foundation-radius` / `foundation-shadows` / etc.) | Likely already exists at `apps/docs/src/pages/foundations/<Name>.mdx`. Don't auto-create — manually managed. |

**PascalCase derivation:** `search-input` → `SearchInput`, `tooltip` → `Tooltip`,
`button` → `Button`. Use lowercase slug split by `-`, capitalize each word.

**Manifest override** — manifest entry can specify `docsName` and `docsRoute`
to override the default mapping. Use this when Figma node name differs from
codebase docs convention:

```json
{
  "slug": "search",
  "nodeId": "2346:404",
  "status": "ready",
  "docsName": "SearchInput",        // → SearchInput.mdx, not Search.mdx
  "docsRoute": "/components/search-input"  // → match existing route entry
}
```

When checking if MDX exists, prefer `manifest.docsName` over PascalCase(slug).
When inserting/updating routes.ts entry, prefer `manifest.docsRoute` over
default `/components/<slug>`.

**Component MDX — MANDATORY STRUCTURE.**

The `ON THIS PAGE` TOC is auto-built from `<h2>` (`##`) headings. Every component
docs page **must** render the same skeleton so the TOC is consistent across all
components — no orphan pages, no missing sections.

**Required `##` sections — IN THIS ORDER, NO EXCEPTIONS:**

1. (Hero preview, NO `##` heading — opens the page)
2. `## Variants` — required IF component has visual variants. Show every variant from `get_metadata`.
3. `## Sizes` — required IF component has size prop. Show every size.
4. `## States` — required IF component has interaction states (hover, disabled, error, loading, etc.). Show every state.
5. `## Props` — **ALWAYS REQUIRED.** Table extracted from `<PascalName>Props` TS interface.
6. `## Accessibility` — **ALWAYS REQUIRED.** Bullet list covering: keyboard, ARIA, screen reader, focus management.
7. `## Things to watch` — **ALWAYS REQUIRED.** Caveats, common pitfalls, gotchas, edge cases. Min 2 bullets.

**Component-specific extra sections** (insert BEFORE `## Props`, after `## States`):
- Button → `## Icon only`, `## Loading`
- Input/Form fields → `## With description`, `## Error`
- Anything Figma shows as a distinct configuration mode

**Forbidden:**
- ❌ Skipping `## Accessibility` because "the component is simple"
- ❌ Skipping `## Things to watch` because "no caveats come to mind" — there are ALWAYS caveats
- ❌ Reordering sections (TOC consistency = mental model consistency)
- ❌ Using `###` for what should be `##` (only `##` shows in TOC)
- ❌ Empty section with `<!-- TODO -->` placeholder shipped to docs site
- ❌ Hero preview without code block underneath (every preview MUST be paired with a copyable `tsx` block)

**Pattern for every preview block** — preview + code block, always:

```mdx
<PreviewCard>
  <Component prop="x" />
</PreviewCard>

\`\`\`tsx
<Component prop="x" />
\`\`\`
```

The `tsx` block must be copy-pastable as-is. No pseudo-code, no `...` truncation.

**Template (write only if file doesn't exist):**

```mdx
import { <PascalName> } from 'cf-ui';

<PageHeader
  title="<Display Name>"
  description="<one-line description derived from get_design_context or get_metadata>"
  status="ready"
/>

<PreviewCard>
  <<PascalName>>Default</<PascalName>>
</PreviewCard>

\`\`\`tsx
<<PascalName>>Default</<PascalName>>
\`\`\`

## Variants

<PreviewCard>
  <div className="flex flex-wrap gap-3">
    {/* one <PascalName> per variant from get_metadata */}
  </div>
</PreviewCard>

\`\`\`tsx
<<PascalName> variant="primary" />
<<PascalName> variant="outline" />
\`\`\`

## Sizes

<PreviewCard>
  <div className="flex flex-wrap items-end gap-3">
    {/* one <PascalName> per size */}
  </div>
</PreviewCard>

\`\`\`tsx
<<PascalName> size="sm" />
<<PascalName> size="md" />
\`\`\`

## States

<PreviewCard>
  <div className="flex flex-wrap items-end gap-3">
    {/* default, hover (described in copy), disabled, error/loading if applicable */}
  </div>
</PreviewCard>

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| (extracted from <PascalName>Props — every prop, every type) |

Extends all native `<element>` HTMLAttributes (omit overridden ones).

## Accessibility

- Native `<element>` under the hood — keyboard / form / SR comes for free.
- ARIA: which attributes are auto-set, which require consumer.
- Focus: visible ring on `:focus-visible`, never on click.
- (More bullets per component reality.)

## Things to watch

- Edge case 1 (e.g. controlled-only API, no internal state).
- Edge case 2 (e.g. `iconOnly` requires `aria-label`).
- (Min 2 bullets. Be specific — "be careful" is not a caveat.)
```

**Route registration:**

After creating MDX, ensure `apps/docs/src/lib/routes.ts` has an entry:

```ts
{
  path: '/components/<slug>',
  label: '<Display Name>',
  category: 'component',
  status: 'ready',
  description: '<one-line>',
  load: () => import('../pages/components/<PascalName>.mdx')
}
```

If entry already exists with `status: 'planned'` → flip to `'ready'`.
If entry doesn't exist → insert under the `// Components — ready` block.

**Fill TODO placeholders only if you have data:**
- get_metadata returns variant property keys → list them in `## Variants`.
- get_design_context may return prop info → put in Props table.
- Don't invent. Leave `TODO` if no source — user fills later.

**Do NOT auto-create:**
- Foundation MDX (`foundations/Radius.mdx`, `foundations/Elevation.mdx`) —
  manually maintained, use `TokenAutoGrid` already.
- Sidebar entries — `routes.ts` is the source; sidebar reads from it.

### 6+7. Build + Bless — SINGLE BATCHED BASH

Combine canvas-sync + rebuild + bless + verify into ONE bash invocation.
Canvas-sync regenerates the playground manifest, tsup entries, package.json
exports, and centernode runtime registry — keeps consumers (centernode,
client-test) in sync without manual file edits.

```bash
cd packages/tokens && ../../node_modules/.bin/tsup src/index.ts src/tailwind-preset.ts --format cjs,esm --dts --clean 2>&1 | tail -2 && \
cd ../.. && node scripts/canvas/sync.mjs 2>&1 | tail -5 && \
cd packages/ui && ../../node_modules/.bin/tsup 2>&1 | tail -2 && \
../../apps/docs/node_modules/.bin/tailwindcss -c tailwind.config.ts -i styles/build.css -o dist/styles.css --minify 2>&1 | tail -2 && \
cd ../.. && node scripts/figma/bless.mjs <slug> 2>&1 | tail -2 && \
node scripts/figma/check.mjs <slug> 2>&1 | tail -5
```

Skip rebuild ONLY if changes are limited to `apps/docs/` (MDX/route files).

Auto-bless is **mandatory, no exceptions**. The user reverts via
`git checkout --` if wrong.

### 8. Verify (already done in step 6+7 batch — just check output)

The batched bash above ran `check.mjs <slug>`. Confirm output shows
`● IN SYNC`. If still drifts, you missed a property — investigate.

**Edge case — "DRIFTED + Changes: no changes":**
Hash differs but diffSummaries finds nothing. Means subtree changed in a
field NOT captured by `summarize()` (layer reorder, blend mode, `locked`
flag, etc). No code action needed — just bless to update baseline:
```bash
node scripts/figma/bless.mjs <slug>
```
Safe because semantic visible properties are unchanged.

**Orphan check (FAST):**

```bash
grep -E "experiment-[a-z0-9-]+" packages/ui/src/<slug>/<slug>.tsx | head -10
```

For each `experiment-*` keyword found, confirm the corresponding Figma
state still uses that color. Skip orphan check if zero matches.

If orphans detected → remove the override line in the same bash batch
above (re-run build + bless after removing).

### 8.5 Restart docs dev server — only if dist changed

If you ran the build batch above (step 6+7), restart vite. Otherwise skip.

```bash
lsof -ti :5173 :5174 :5175 :5176 :5177 2>/dev/null | xargs -r kill 2>/dev/null && \
sleep 1 && \
rm -rf apps/docs/node_modules/.vite && \
cd apps/docs && ./node_modules/.bin/vite
```

Same logic available as standalone slash command `/restart-server` — use that
when docs render doesn't update after edits outside `/sync-figma`.

Run in background. Report new port + "hard refresh (Cmd+Shift+R)" to user.

### 9. Report — six lines max, no fluff

```
✓ Synced <slug>: <one-line scope, e.g. "Primary/Large fill green→experiment-blue">

Files: theme.css (+experiment-blue), tailwind-preset.ts (expose), button.tsx (lg override)
Status: ● IN SYNC

⚠ <slug>-experiment-<name>: prototype-only, talk to designer before promoting.

Next: pnpm dev · git diff packages/ · git commit
```

If you write more than 6 lines of report, you're being slow. Cut.

## When to pause and ask the user

Only these — and only these:

- Edit would touch a file outside `packages/tokens/`, `packages/ui/`,
  `apps/docs/`, `.figma/` (config / infra / build files).
- Figma data is missing or corrupt (404, empty subtree, ID mismatch).
- Drift is `null` (no state file yet) — bootstrap first via `bless --all`.
- `git status` shows uncommitted changes to `.figma/state/<slug>.json` that
  aren't yours (would overwrite user's manual edit on bless).
- User explicitly types "stop" or "wait" mid-execution.

For anything else — including:
- Single-variant color changes
- Brand shifts (green → blue, etc.)
- Tokens with "test"/"draft"/"wip" in their name
- Brand-new components (auto-create route, MDX, code; bless; report)
- Figma variable count changes
- Multiple component files touched

→ **execute and report.** No questions. No options.
