---
description: Bootstrap a new Figma node (Component Set or foundation page) into the tracked manifest. Auto-pulls metadata, variables, blesses snapshot. After this, /sync-figma <slug> works.
---

# /new-item

**Argument:** `$ARGUMENTS` — formats accepted:
- A Figma URL alone:  `https://figma.com/design/.../?node-id=2346-404`
- `<slug> <url>`:      `search https://figma.com/...`
- `<fileKey>:<nodeId>` (raw):  `TCd9exLXTUMciyw1VqnPSK:2346:404`

## Mindset

Bootstrap a new tracked item. After this finishes, the slug appears in
`.figma/manifest.json`, has its variables cached at
`.figma/variables/<slug>.json`, snapshot blessed, and `check.mjs` includes
it in drift detection. Different from `/sync-figma` (which assumes slug
already exists).

**Sat-set:** parse → add → pull → bless → report. No questions for routine
slug derivation. Pause only on hard blockers (node 404, slug collision,
cross-file mismatch).

## Steps (run in order)

### 0. Parse input

Extract `fileKey`, `nodeId`, and optional `slug`:

- URL form `figma.com/design/:fileKey/:name?node-id=:nodeId` → convert `-` to `:` in nodeId
- `<fileKey>:<nodeId>` raw → use as-is
- `<slug> <url>` → first token is slug, rest is URL/raw pair

If parsing fails or empty input → ask user for valid Figma URL.

### 1. Validate against manifest

Read `.figma/manifest.json`:

- If `manifest.fileKey !== inputFileKey` → ABORT.
  Multi-file tracking not supported. Tell user to use the canonical file
  (`TCd9exLXTUMciyw1VqnPSK` for POD).

- If user-provided slug already exists in `manifest.components[]` → ABORT.
  Tell user to use `/sync-figma <slug>` for refreshes.

### 2. Pull metadata

```
mcp__claude_ai_Figma__get_metadata(fileKey, nodeId)
```

Capture `name`, `type`. Type determines treatment:

| Type | Treatment |
|---|---|
| `COMPONENT_SET` | Tracked component. Future `/sync-figma` will write code under `packages/ui/src/<slug>/`. |
| `COMPONENT` (single) | Same as above. |
| `CANVAS` (page) | Foundation tracking — data only, no code scaffolding. |
| `FRAME` (with subtree) | Treated like a foundation page if not under a Component Set. |
| Anything else (TEXT, LINE, etc.) | ABORT — not trackable. |

### 3. Derive slug (if not provided)

```
slug = kebabCase(metadata.name)
       .toLowerCase()
       .replace(/[^a-z0-9]+/g, '-')
       .replace(/^-+|-+$/g, '')
```

Examples:
- `Button` → `button`
- `Search Input` → `search-input`
- `↳ Buttons` → `buttons`
- `Foundation / Radius` → `foundation-radius`

If derived slug collides with existing manifest entry → append `-2`, `-3`,
etc., until unique.

### 4. Add entry to manifest

Edit `.figma/manifest.json`:

```json
{
  "components": [
    ... existing entries ...,
    { "slug": "<slug>", "nodeId": "<nodeId>", "status": "ready" }
  ]
}
```

Use the Edit tool, splice in just the new entry — don't rewrite the whole
manifest.

### 5. Pull variables → write `.figma/variables/<slug>.json`

```
mcp__claude_ai_Figma__get_variable_defs(fileKey, nodeId)
```

Write to `.figma/variables/<slug>.json` (NOT `.figma/variables.json` —
that's the legacy single-file path):

```json
{
  "version": 1,
  "slug": "<slug>",
  "fileKey": "<fileKey>",
  "nodeId": "<nodeId>",
  "syncedAt": "<ISO timestamp>",
  "comment": "Auto-populated by /new-item via MCP get_variable_defs.",
  "variables": { "<name>": "<value>", ... }
}
```

If `get_variable_defs` returns empty (`{}` or just `{"1": "1"}`) → that's
fine. Empty page or node with no bound vars. Write file with empty
`variables: {}`.

### 6. Bless — seed snapshot + state

```bash
node scripts/figma/bless.mjs <slug>
```

This creates:
- `.figma/snapshots.json[<slug>]` — hash baseline
- `.figma/state/<slug>.json` — full subtree summary

### 7. Verify

```bash
node scripts/figma/check.mjs <slug>
```

Should report `● IN SYNC`. If not, investigate (rare — usually means
something changed in Figma between MCP pull and REST fetch).

### 8. Report — six lines max

```
✓ Added <slug> (<node-type>): "<node-name>"
nodeId: <id> · variables: <N> tokens cached
Status: ● IN SYNC

Next:
  - For component: /sync-figma <slug> when ready to scaffold code
  - For foundation: just kept in dictionary, no code action
```

## When to pause and ask

ONLY these:

- Input is empty or unparseable → "give me a Figma URL"
- Cross-file (`fileKey` differs from manifest's) → unsupported, ABORT
- Slug already in manifest → tell user to use `/sync-figma <slug>` for refresh
- Node 404 / metadata empty → unrecoverable, ABORT
- Node type not trackable (TEXT, LINE, RECTANGLE without children) → ABORT

For everything else (slug derivation, empty variables, foundation vs
component) → execute and report. No options, no confirmations.

## What this command does NOT do

- ❌ Generate component code (`packages/ui/src/<slug>/<slug>.tsx`).
  That's `/sync-figma <slug>` after this. Code generation needs design judgment.
- ❌ Add docs MDX page automatically. Same reason.
- ❌ Touch `apps/docs/src/lib/routes.ts`. Manual addition when ready.

`/new-item` = data layer only (manifest + variables + snapshot).
`/sync-figma` = code layer (tokens + components + docs).

Two-step flow: bootstrap with `/new-item`, then sync code with `/sync-figma`.
