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

## Steps (run in order, don't ask between)

### 0. Resolve target

- If `$ARGUMENTS` is a slug → look up `nodeId` in [.figma/manifest.json](.figma/manifest.json).
- If `$ARGUMENTS` is a Figma URL → parse `fileKey` + `nodeId` (convert `-` to `:` in nodeId).
- If `$ARGUMENTS` is `<fileKey>:<nodeId>` → use as-is.
- If empty → list manifest slugs and ask user. Resume on their reply.

### 1. Gather drift context

Run:

```bash
node scripts/figma/check.mjs <slug>
```

Capture which variants drifted and the property-level changes. Use this to
scope your edits — you don't need to regenerate untouched variants.

### 2. Pull Figma context

Call the figma MCP tools (server name: `figma`):

1. `mcp__figma__get_figma_data` — fetch the node tree (metadata + bound
   variables in one call). Pass:
   - `fileKey`: from manifest (or argument)
   - `nodeId`: from manifest (or argument)
   - `depth`: `4` (enough for a Component Set with variants and instance refs)

2. `mcp__figma__download_figma_images` — fetch a PNG of the node for visual
   reference. Pass:
   - `fileKey`, `nodeId`
   - `localPath`: `/tmp/<slug>.png`
   - `pngScale`: `2`

The result of step 1 is a YAML tree of layers + bound variables — that's
your input for variable→token mapping in step 4. The screenshot from step 2
is for sanity-checking the visual; you do not generate code from it.

POD has its own component conventions (see [CLAUDE.md](CLAUDE.md) →
"Common edits — patterns") — never copy framework patterns from elsewhere.

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

### 5. Apply edits — granular, one shot

| File | When to touch |
|---|---|
| `packages/tokens/src/theme.css` | Add `--color-experiment-*` (both modes). DO NOT modify sacred tokens. |
| `packages/tokens/src/tailwind-preset.ts` | Expose new `experiment-*` as utility class. |
| `packages/ui/src/<slug>/<slug>.tsx` | Add ONE-LINE override scoped to exact (variant, size) Figma changed. |
| `apps/docs/src/pages/components/<Pascal>.mdx` | Only if variants/sizes/props changed (rare in token-only sync). |
| `apps/docs/src/lib/routes.ts` | Brand-new component only. |

**Granular rule:** if Figma drift says `Type=Primary, Size=Large` only —
your override matches `variant === 'primary' && size === 'lg'` only. No
broader scope. No "while we're at it, let me also update Medium". No.

**MDX preservation rule (CRITICAL — applies whenever you touch a `.mdx`):**

MDX files mix auto-derivable content (variants, sizes, props table) with
hand-authored knowledge (accessibility notes, gotchas, design intent). The
sync command MUST NOT regenerate MDX from scratch. You may only update
auto-derived sections; hand-written sections survive verbatim.

Treat as **AUTO-DERIVED** (safe to update from Figma + component source):
- The hero `<PreviewCard>` + its code block (default usage)
- `## Variants` block
- `## Sizes` block
- `## Props` table (regenerate from the component's TypeScript prop types)

Treat as **HAND-WRITTEN — DO NOT TOUCH** (preserve byte-for-byte):
- `## Accessibility` section, in full
- `## Things to watch` section, in full
- Any prose paragraph between section headings and `<PreviewCard>` blocks
  (e.g. "Hover styling is built in via Tailwind; the disabled prop greys…")
- Any section heading the file has that isn't directly derivable from
  variants/sizes/props (e.g. `## States`, `## Icon only`, `## Loading` —
  these document behavior that variants alone don't express)
- All `import` lines at the top of the file

If you can't classify a section confidently, **PRESERVE**. A stale sentence
is recoverable; deleted authored knowledge usually isn't.

In your final report, list any non-auto-derived text you modified, even
incidentally — the reviewer needs to verify it wasn't an accident.

### 6. Rebuild packages (if any .tsx or theme.css changed)

`packages/ui` and `packages/tokens` ship `dist/` (built via `tsup`), not raw
source. The docs site reads from `dist/`. So if you touched any of:

- `packages/ui/src/<slug>/<slug>.tsx`
- `packages/tokens/src/theme.css`
- `packages/tokens/src/tailwind-preset.ts`

…rebuild before bless:

```bash
cd packages/tokens && ../../node_modules/.bin/tsup src/index.ts src/tailwind-preset.ts --format cjs,esm --dts --clean
cd ../ui && ../../node_modules/.bin/tsup
```

Or, if `pnpm` is on PATH: `pnpm -F pod-test-tokens build && pnpm -F pod-test-ui build`.

Skip rebuild ONLY if changes are limited to `apps/docs/` (MDX, route files) —
those are bundled by the docs Vite directly.

### 7. Auto-bless (MANDATORY, NO EXCEPTIONS)

After edits + rebuild, run:

```bash
node scripts/figma/bless.mjs <slug>
```

This refreshes the snapshot baseline. The user reverts via `git checkout --`
if wrong. **Bless every time.** No "skip if brand-shift", no "skip if caution",
no "wait for designer confirmation". Just bless.

### 8. Verify

```bash
node scripts/figma/check.mjs <slug>
```

Should now report `IN SYNC`. If it still drifts, you missed a property —
investigate, don't move on.

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
