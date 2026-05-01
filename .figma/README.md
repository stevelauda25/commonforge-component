# `.figma/` — Drift Detection State

This folder holds the **mapping** and **last-known state** of the Figma components
this codebase tracks. Drift detection compares the live Figma file against
`snapshots.json`; when they diverge, a developer is told which components changed.

```
.figma/
├── manifest.json      ← hand-edited: which components are tracked
├── snapshots.json     ← auto-managed: last-blessed variable surface per component
└── README.md          ← this file
```

## Files

### `manifest.json`

Hand-edited list of tracked components. Add an entry per Component Set you want
drift-checked.

```json
{
  "version": 1,
  "fileKey": "TCd9exLXTUMciyw1VqnPSK",
  "components": [
    { "slug": "button", "nodeId": "267:355", "status": "ready" }
  ]
}
```

| Field | Meaning |
|---|---|
| `slug` | Internal name. Match the folder name in `packages/ui/src/<slug>/`. |
| `nodeId` | The Component Set's nodeId in Figma. Find via `pnpm figma:discover`. |
| `status` | `ready` (track + sync) · `wip` (in manifest but not yet implemented) · `archived` (do not check). Currently only `ready` is honored by scripts. |

### `snapshots.json`

Auto-managed. Do not hand-edit. Stores the SHA-256 hash of each component's
**variable surface** as last blessed.

```json
{
  "version": 1,
  "syncedAt": "2026-04-30T10:00:00Z",
  "components": {
    "button": {
      "hash": "a3f5c7…",
      "varCount": 23,
      "syncedAt": "2026-04-30T10:00:00Z",
      "nodeId": "267:355"
    }
  }
}
```

The hash is a SHA-256 of the Component Set's normalized subtree JSON
(sorted keys, volatile fields like `absoluteBoundingBox` stripped).

**What the hash detects:**
- Layer add / remove / reorder
- Variable BINDING changes (a property gets bound to a different variable ID)
- Inline value changes (any color / spacing / radius set directly without a variable)
- Variant property add / remove / rename

**What the hash misses (Pro-tier limitation):**
- Pure variable VALUE changes when the binding ID stays the same.
  Example: designer edits `accent-default` from `#16a34a` to `#15803d`
  globally — every component that binds to `accent-default` keeps the same
  variable ID, so the hash is unchanged.

  This limitation exists because Figma gates the `/v1/files/.../variables/local`
  REST endpoint behind **Enterprise tier**. The PAT scope `file_variables:read`
  is not exposed to Pro accounts. To upgrade once on Enterprise, see "Upgrade
  path" below.

## Daily workflow

```bash
pnpm figma:check
```

Output:
```
🔍 Checking 1 component(s) against Figma file TCd9exLXTUMciyw1VqnPSK…

⚠️  1 component(s) drifted:
   • button       (last sync: 5d ago) → variable surface changed

Next steps:
  /sync-figma <slug>            — pull latest, regenerate code
  pnpm figma:bless <slug>       — accept current as in-sync (no code change)
  pnpm figma:bless --all        — bless every drifted component
```

Exit code: `0` when in sync, `1` when drift detected. CI-friendly.

### When drift is real (Figma changed, code needs update)

```bash
/sync-figma button             # in Claude Code — pulls Figma, regenerates code
pnpm figma:bless button        # snapshot the new state
```

### When drift is intentional and code is correct (e.g. designer experimenting)

```bash
pnpm figma:bless button        # accept Figma as the new baseline, no code change
```

### When adding a new tracked component

1. Find the Component Set's nodeId:
   ```bash
   pnpm figma:discover
   ```
2. Add entry to `manifest.json` with `slug`, `nodeId`, `status: "ready"`.
3. Bless to seed its snapshot:
   ```bash
   pnpm figma:bless <new-slug>
   ```

## Setup (first-time)

1. Create `.env.local` at repo root from `.env.local.example`.
2. Generate Figma PAT at https://www.figma.com/settings → Personal access tokens.

   **Required scope**:
   - `file_content:read` (labeled "File content") — for fetching node trees

   That's it. The current Pro-tier strategy uses structure-based hashing
   only, so no Variables scope is needed.
3. Paste PAT into `.env.local` (gitignored — never commit).
4. Bootstrap snapshot:
   ```bash
   pnpm figma:bless --all
   ```

## CI integration (Phase 3 — not yet wired)

The intended pattern is a nightly cron in GitHub Actions:

```yaml
name: figma-drift-check
on:
  schedule:
    - cron: '0 2 * * *'         # 02:00 UTC daily
  workflow_dispatch:
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm figma:check
        env:
          FIGMA_PAT: ${{ secrets.FIGMA_PAT }}
          FIGMA_FILE_KEY: ${{ vars.FIGMA_FILE_KEY }}
```

When `pnpm figma:check` exits 1, the workflow fails — surfacing the drift
via GitHub status checks, Slack notifications, or whatever observability is
already wired to CI.

## What this does NOT do (yet)

- **Auto-sync the code from Figma** — that's Phase 3 of the broader spec, see
  [docs/superpowers/specs/2026-04-29-figma-native-sync-design.md](../docs/superpowers/specs/2026-04-29-figma-native-sync-design.md).
- **Detect pure variable value changes** when the binding ID stays the same
  (Pro-tier limitation — see "What the hash misses" above).
- **Catch component renames or moves**. `nodeId` is the anchor; if the
  Component Set is recreated with a new ID, you'll need to update
  `manifest.json` by hand.

## Upgrade path: Enterprise-tier full variable resolution

Once the workspace is on Figma Enterprise:

1. Regenerate PAT with `file_variables:read` scope added.
2. Replace `hashComponent` in `scripts/figma/_lib.mjs` to call
   `/v1/files/.../variables/local`, build a map of `{ varId → name + valuesByMode }`
   filtered to the IDs found in the Component Set, then hash that map.
3. Re-run `node scripts/figma/bless.mjs --all` to re-bootstrap snapshots
   with the precise variable hash.
4. From that point on, drift detection catches every variable value change
   immediately.

The current implementation is forwards-compatible — manifest, snapshot
schema, and CLI surface stay identical. Only the hashing function changes.
