# CLAUDE.md — POD Design System

Project context for AI agents working in this repo.

## Project identity

Token-driven, dark-mode-aware React design system. Source of truth =
**Figma file `TCd9exLXTUMciyw1VqnPSK`** (POD Design System 1.1). The codebase
is a projection of Figma; drift detection at [scripts/figma/](scripts/figma/)
keeps them honest.

```
packages/tokens   → CSS variables + Tailwind preset
packages/ui       → React components (token-only, no hex)
apps/docs         → MDX docs site (the review surface)
.figma/           → drift-detection state (manifest, snapshots, state)
scripts/figma/    → check / bless / discover / _lib / _ui
client-test/      → standalone consumer testbed for npm packages
```

## Trust premise — sat-set mode (HARD RULE)

The user has already audited drift via `node scripts/figma/check.mjs` BEFORE
triggering sync. They are the design authority, not you. **You do not have
veto power over Figma changes.** Execute, don't deliberate.

When the user says any of these:

- "sync figma <slug>"
- "sync <slug> dari figma"
- "/sync-figma <slug>"
- "update <slug> dari figma terbaru"
- "sync <slug>"
- pastes a Figma URL alone
- anything semantically equivalent

→ Trigger full autonomous sync per `.claude/commands/sync-figma.md`. **No
questions, no proposals, no "should I…", no "would you prefer…". Just do.**

### THE ONLY DECISION TREE YOU GET

```
Figma changed → identify EXACT scope (which variant + which property)
              → if new color outside brand palette:
                  add  --color-experiment-<name>  to theme.css
                  expose 'experiment-<name>' in tailwind-preset.ts
                  override JUST the affected variant in component .tsx
              → if existing brand token value swap (rare, requires explicit user signal):
                  update brand token value in BOTH :root + .dark
              → auto-bless
              → done
```

**SACRED TOKENS — NEVER MODIFY.** These define POD's brand identity. Touching
them = production breakage:

```
accent-default · accent-hover · accent-active · accent-fg · accent-subtle
danger-default · danger-hover · danger-active · danger-fg · danger-subtle
warning-default · warning-fg · warning-subtle
success-default · success-fg · success-subtle
info-default · info-fg · info-subtle
border-focus
shadow-glow-accent-* · shadow-glow-danger-* · shadow-glow-accent-text
```

If Figma introduces a color outside these tokens, the answer is **always**:
`experiment-<name>` token + targeted variant override. **Never** "rebrand the
whole accent system to match Figma's experiment". One drifted variant ≠ brand
shift. Even ten drifted variants ≠ brand shift. Brand shift only happens when
the user explicitly says "rebrand to <color>".

### Multi-variant fidelity — applies ONLY when adding a new component

**Trigger condition:** You're in FIRST-SYNC GUARD path (component just added
via `/new-item`, or scaffolding code from scratch for a tracked component
that had no prior `.tsx`). And the component has >1 variant OR >2 sizes.

**Does NOT apply to:** routine `/sync-figma` runs on already-validated code
(token swap, single-variant color change). Those stay FAST PATH — adding an
audit there would bloat every sync and waste tokens. Use `/verify-component
<slug>` standalone if you suspect drift in an existing component.

**Why this matters at add-time only:** new components are scaffolded from
zero. AI commonly infers patterns ("all sizes share radius", "outline hover
is just darker") and misses per-variant overrides in Figma. Routine sync of
already-correct code doesn't have this risk.

**Add-time protocol** (Button = 3v × 4s × 3 states = 36 cells):

1. From Figma `get_design_context.COMPONENT_SET.children`, emit a markdown
   table — one row per `(variant, state, size)`. Columns: fill, stroke,
   radius, textColor, fontSize, fontWeight, padding, effects.
2. Map each row to `variantClasses[v]` + `sizeClasses[s]` + state modifiers
   in your scaffolded `.tsx`. Resolve every class → hex.
3. Diff cell by cell. Inference forbidden: "probably same as md", "all sizes
   share radius", "outline hover is just darker".
4. Per-variant overrides (e.g. `Primary/lg = #1f71ff` non-brand) → add
   `experiment-<name>` token + targeted `variant === 'X' && size === 'Y'`
   override. NEVER touch sacred brand tokens.
5. State variants (hover/active/disabled/focus) = real audit rows.

### Granular execution

Scope your edits to exactly what Figma changed. Read the `check.mjs` output
carefully — it tells you which variant + which property:

```
Type=Primary, State=Default, Size=Large    ← ONLY this variant changed
   fill color  #15803d → #3b82f6           ← ONLY fill color
```

→ Override **only** primary + lg. Use Tailwind's `!` important modifier so the
override beats the variant base class. Do NOT touch primary's other sizes,
do NOT touch outline/error variants, do NOT touch the underlying accent token.

Override pattern in component:
```tsx
className={cn(
  base,
  focusRing,
  variantClasses[variant],
  sizeClasses[size],
  variant === 'primary' && size === 'lg' && '!bg-experiment-<name>',
  className,
)}
```

Single targeted line. Done.

### Mandatory auto-bless

After every successful sync, ALWAYS run `node scripts/figma/bless.mjs <slug>`.
There are no exceptions. If the user wanted to keep the drift visible, they
wouldn't have triggered sync. They'll revert via `git checkout --` if wrong.

### Forbidden behaviors (these are bugs, not features)

- ❌ Modifying any token from the SACRED list above. EVER.
- ❌ Rebranding the whole accent/danger/etc system to match a single Figma
  variant. That is a production-breaking incident, not a sync.
- ❌ Proposing 3 paths labeled "A / B / C" and asking which to pick.
- ❌ Adding a token under `/* Experimental */` and refusing to wire it.
- ❌ Skipping `auto-bless` because of a "caution".
- ❌ Saying "I held back because…" — you should not have held back.
- ❌ Asking "should I proceed with the brand shift?" — NEVER do brand shifts.
- ❌ Touching variants Figma did not change.

### Speed budget

If your sync run takes more than ~5 minutes of thinking, you're doing it
wrong. The flow is mechanical:

```
check.mjs (10s) → MCP pull (15s) → identify scope (30s) → 3 file edits (60s)
→ bless (5s) → verify (10s) → 6-line report (30s)
```

Total: under 3 minutes of agent activity. Anything more = you're deliberating.
Stop deliberating. Execute.

The `⚠ Caution` block in your final report is for **noting things the user
might want to follow up on with the designer**, not for justifying inaction.

### When you ARE allowed to pause

Only these — and only these:

- The change would touch a file outside `packages/tokens/`, `packages/ui/`,
  `apps/docs/`, `.figma/` (i.e. config, build, infra). Pause + ask.
- Figma data is missing or corrupt (404, empty subtree, ID mismatch).
- The user explicitly typed "wait" or "stop" or equivalent.
- Auto-bless would overwrite an already-uncommitted manual edit
  (`git status` shows local changes to `.figma/state/<slug>.json`).

In every other case: execute.

## Auto-run scripts (no confirmation needed)

These commands are pre-allowed in `.claude/settings.json` and should be
executed without permission prompts whenever invoked or implied:

- `node scripts/figma/check.mjs [slug]`
- `node scripts/figma/check.mjs --json` / `--slugs-only` / `--urls-only`
- `node scripts/figma/bless.mjs <slug>` / `--all` / `--prune`
- `node scripts/figma/discover.mjs`
- `node_modules/.bin/tsup …` (rebuilding packages after sync)

When the user pastes one of these, just run it and report stdout.

## Slash commands available

- **`/new-item <figma-url>`** — BOOTSTRAP a new Figma node into tracking.
  Parses URL → adds to manifest → pulls variables → blesses snapshot. Run
  this once per new component/foundation page. Then `/sync-figma <slug>`
  for ongoing work. See `.claude/commands/new-item.md`.
- **`/sync-figma <slug>`** — pull from Figma, apply edits, bless, verify. See
  `.claude/commands/sync-figma.md`. Sat-set; never modifies sacred tokens.
  Also refreshes `.figma/variables/<slug>.json` dictionary. Requires slug
  to exist in manifest (use /new-item first if it doesn't).
- **`/refresh-vars [slug]`** — lightweight: ONLY refresh
  `.figma/variables/<slug>.json` via MCP. No code changes, no bless. Use
  when `check.mjs` shows raw IDs you want resolved to names.
- **`/publish [patch|minor|major|x.y.z]`** — verify in-sync + clean tree → build →
  bump → PAUSE for confirmation → npm publish → tag locally. See
  `.claude/commands/publish.md`. Pauses ONCE before actual publish.

## Common edits — patterns

**Token value change** → edit [packages/tokens/src/theme.css](packages/tokens/src/theme.css)
in BOTH `:root` AND `.dark` blocks. Components pick up the change automatically;
no need to touch component code.

**New token** → add to `theme.css` (light + dark) AND
[packages/tokens/src/tailwind-preset.ts](packages/tokens/src/tailwind-preset.ts)
to expose as utility class.

**Component shape change** → edit
[packages/ui/src/<slug>/<slug>.tsx](packages/ui/src/). Keep:
- `forwardRef` with named function
- Variant/size as `Record<…, string>` (not `cva`)
- `cn(base, focusRing, variantClasses[v], sizeClasses[s], className)`
- Semantic Tailwind classes only (`bg-accent`, NOT `bg-[#…]`)
- ESM imports use `.js` extensions (`import { cn } from '../lib/cn.js'`)

**Docs change** → edit
[apps/docs/src/pages/components/<Pascal>.mdx](apps/docs/src/pages/components/).
Use pre-registered MDX globals (`PageHeader`, `PreviewCard`, `PropsTable`,
`StatusBadge`) — no import needed.

**New component** (e.g. Switch) → create 3 files, then run canvas-sync:
1. `packages/ui/src/switch/switch.tsx` — component code
2. `packages/ui/src/switch/index.ts` — `export { Switch } from './switch.js';`
3. `packages/ui/src/switch/canvas.ts` — exports `switchCanvas` ([CanvasComponent](packages/ui/src/canvas-types.ts)):
   ```ts
   import type { CanvasComponent } from '../canvas-types.js';
   export const switchCanvas: CanvasComponent = {
     name: 'Switch',
     importFrom: 'pod-test-ui/switch',
     variants: ['default'],
     sizes: ['sm', 'md'],
     defaultProps: { checked: false },
   };
   ```
Then `node scripts/canvas/sync.mjs` (or `npm run build` in packages/ui).
The script auto-updates: `tsup.config.ts` entries, `package.json` exports,
`src/canvas.ts` aggregator, `centernode/src/utils/podRuntime.js`. Centernode
sidebar picks it up automatically. No manual file edits needed.

> **Important — centernode consumes pod-test-ui via npm, NOT file: link.**
> Local edits to `packages/ui` show up in `apps/docs` instantly (pnpm
> workspace) but **NOT in centernode**. To see component changes in
> centernode (local OR Vercel), you must `/publish` a new npm version
> first — that command bumps centernode/package.json automatically as
> part of the release flow. See "Deploy targets" below.

## Deploy targets — Vercel auto-deploy on push to main

Three apps, one repo, each as its own Vercel project (different Root
Directory). One `git push origin main` → all auto-rebuild in parallel.

| App | Vercel project | Root Directory | Local dev source |
|---|---|---|---|
| `apps/docs` | `pod-docs.vercel.app` | `apps/docs` | pnpm workspace (file resolution, instant) |
| `centernode` | `pod-centernode` (TBD URL) | `centernode` | npm version `pod-test-ui@^x.y.z` (needs republish to update) |
| `client-test` | not deployed (local-only) | `client-test` | npm version (same caveat as centernode) |

Each app has its own `vercel.json` with build commands. Don't override
in dashboard — vercel.json wins. To update centernode/client-test with
latest pod-test-ui changes: `/publish` (auto-bumps both consumers).

## Verification (always run after sync)

```bash
node scripts/figma/check.mjs <slug>    # confirm in-sync after bless
pnpm typecheck                          # if you touched .tsx
pnpm dev                                # only if user explicitly asks for visual check
```

Never start `pnpm dev` proactively unless asked — it blocks the terminal.

## What NOT to do

- ❌ Don't ask "should I proceed?" — they triggered sync.
- ❌ Don't propose paths A/B/C. Pick the reasonable one. Execute.
- ❌ Don't re-implement primitives when a token change suffices.
- ❌ Don't hardcode hex / rgb in `packages/ui/src/`.
- ❌ Don't auto-commit / auto-push. User commits.
- ❌ Don't skip auto-bless. Bless after every successful sync.
- ❌ Don't add tokens under `/* Experimental */` and leave them dangling. Wire
  them through to where Figma uses them, even if "only one variant" is affected.

## What TO do

- ✅ Run `check.mjs` first to gather drift data.
- ✅ Pull Figma context via MCP (metadata, variable defs, design context, screenshot).
- ✅ Apply changes to tokens / component / docs in one shot.
- ✅ Auto-bless. Always. Every time.
- ✅ Verify with `check.mjs` — must report IN SYNC before you reply.
- ✅ Report concise: files touched, anomalies (footnote only), what's next for designer.
- ✅ If the user pastes a Figma URL alone, treat as `sync this`.
