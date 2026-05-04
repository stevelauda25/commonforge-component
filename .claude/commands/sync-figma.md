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

### 1. Gather drift context

Run:

```bash
node scripts/figma/check.mjs <slug>
```

Capture which variants drifted and the property-level changes. Use this to
scope your edits — you don't need to regenerate untouched variants.

### 2. Pull Figma context — FAST PATH vs FULL PATH

**FAST PATH (default for token-only drift)** — only call:

1. `mcp__claude_ai_Figma__get_variable_defs` — to enrich variables.json

Skip metadata/screenshot/design_context. Drift output from step 1 already
tells you which variants and properties changed. You don't need rendered
code or pixel reference for token swaps.

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

### 6+7. Build + Bless — SINGLE BATCHED BASH

Combine rebuild + bless + verify into ONE bash invocation. Reduces 3-4
round-trips into 1 call:

```bash
cd packages/tokens && ../../node_modules/.bin/tsup src/index.ts src/tailwind-preset.ts --format cjs,esm --dts --clean 2>&1 | tail -2 && \
cd ../ui && ../../node_modules/.bin/tsup 2>&1 | tail -2 && \
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
lsof -ti :5174 :5175 :5176 :5177 2>/dev/null | xargs -r kill 2>/dev/null && \
sleep 1 && \
rm -rf apps/docs/node_modules/.vite && \
cd apps/docs && ./node_modules/.bin/vite
```

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
