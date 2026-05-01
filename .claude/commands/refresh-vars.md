---
description: Refresh .figma/variables.json from Figma MCP get_variable_defs. Lightweight — no sync, no bless, no rebuild. For when check.mjs output shows raw IDs you want resolved to names.
---

# /refresh-vars

**Argument:** `$ARGUMENTS` — slug from manifest (default: refresh all tracked components)

## Purpose

`check.mjs` cache `.figma/variables.json` for ID → name resolution. The cache
is normally refreshed during `/sync-figma`. Use this command when you just
want to **refresh the dictionary without applying any code changes** — e.g.:

- Designer added new tokens but no drift to sync yet
- `check.mjs` output shows raw IDs (`id 2274:284`) and you want names
- Variables file looks stale

This is **READ-ONLY** to the codebase — only writes `.figma/variables.json`.

## Steps

### 1. Resolve target

If `$ARGUMENTS` is a slug → look up in manifest.
If empty → loop through all `manifest.json:components[]`.

### 2. Pull MCP get_variable_defs

For each target component:
```
mcp__claude_ai_Figma__get_variable_defs(fileKey, nodeId)
  → returns { name: value, ... }
```

### 3. FULL REPLACE .figma/variables.json

Same logic as `/sync-figma` step 2.5:

- Replace the `variables` key entirely with merged result
- Bump `syncedAt` to current ISO time
- Preserve `version`, `fileKey`, `comment` keys

If multiple components tracked, merge their `get_variable_defs` outputs (they
should mostly overlap on shared tokens). On conflict (same name, different
value), prefer the most recently synced component's value.

### 4. Report — three lines max

```
✓ Refreshed variables.json from <N> component(s)
Tokens: +<added> · ~<changed-value> · −<removed>  (vs previous cache)
```

If no changes: `✓ variables.json already fresh — no Figma changes since last refresh.`

## When NOT to use

- If you actually have drift and want to sync code → use `/sync-figma <slug>`
- If you want to bless current Figma state without code changes → use `node scripts/figma/bless.mjs <slug>`

This command is **strictly for the dictionary cache**. Code unchanged.
