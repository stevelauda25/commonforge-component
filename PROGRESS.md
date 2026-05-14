# POD Design System — Progress

Snapshot per **2026-05-12**. Updated manually; not auto-synced.

This file is a session-spanning reference. Read this first when picking up the
project after a break. Items here reflect actual state on this date; verify
against current code/registry before acting on stale claims.

---

## Stack identity

- **Source of truth:** Figma file `TCd9exLXTUMciyw1VqnPSK` (POD Design System 1.1)
- **Code packages:** `pod-test-tokens` + `pod-test-ui` (published to npm, owner `hixelation`)
- **Consumer test:** `client-test/` (React + Vite + TS, consumes via npm)
- **Drift-detection state:** `.figma/` (manifest, snapshots, state, variables)
- **Docs site:** `apps/docs/` (MDX + Vite at `localhost:5174`)

---

## 1. Functions / modules delivered

### Packages (npm published)

| Package | Version | Contents |
|---|---|---|
| `pod-test-tokens` | **0.1.2** | `theme.css` (CSS vars light + dark), `tailwind-preset.ts` (utility mapping) |
| `pod-test-ui` | **0.1.3** | `Button`, `Checkbox`, `SearchInput`, `Tooltip`, `cn()` helper, `AGENTS.md` manifest |

`AGENTS.md` is shipped in the npm tarball — auto-syncs to consumer's
`node_modules/pod-test-ui/AGENTS.md` on `npm update`. Consumer CLAUDE.md
references this for current component / token list. No manual CLAUDE.md
update needed per release.

### Tokens available

- **Backgrounds:** `canvas`, `surface`, `raised`, `muted`
- **Text:** `text-primary`, `text-secondary`, `text-muted`, `text-disabled`, `text-inverse`
- **Borders:** `border-subtle`, `border-default`, `border-strong`, `border-focus`
- **Brand (sacred):** `accent`, `accent-hover`, `accent-active`, `accent-fg`, `accent-subtle`
- **Feedback:** `danger`, `warning`, `success`, `info` (each w/ `-hover`, `-active`, `-fg`, `-subtle`)
- **Radius:** `rounded-none | xxs | xs | sm | md | lg | xl | 2xl | 3xl | 4xl | full` (0/2/4/6/8/10/12/16/20/24/9999)
- **Shadow (drop):** `shadow-foundation-xs | sm | md | lg | xl | 2xl | 3xl`
- **Shadow (brand glow):** `shadow-glow-accent-inset[-strong]`, `shadow-glow-danger-inset[-strong]`, `shadow-glow-accent-text`
- **Motion:** `duration-{fast,base,slow}` (120/180/240ms), `ease-{standard,emphasized,press}`
- **Experimental:** `bg-experiment-{orange,zinc-700,primary-test}` (time-bounded)
- **Removed in 0.1.0:** legacy `shadow-{sm,md,lg}` (non-prefixed). Migrate to `shadow-foundation-*`.

### Drift detection (`scripts/figma/`)

| Script | Purpose | Notable |
|---|---|---|
| `check.mjs` | Detect drift vs Figma | **Bulk fetch** (1 API call per up to 50 components) + 429 retry-backoff |
| `bless.mjs` | Snapshot baseline | Single or `--all` / `--prune` modes |
| `discover.mjs` | List untracked nodes | Scan file for Component Sets not in manifest |
| `_lib.mjs` | Shared (env, fetch, hash) | `figmaFetch` w/ exp backoff; `hashComponentsBulk` chunked at 50 |
| `_ui.mjs` | Terminal formatting | Color-coded output |

### Docs site (`apps/docs/`)

- **Pages:** `/components/{button,checkbox,...}` + `/foundations/{color,typography,spacing,radius,elevation,motion}` + `/figma-status` + `/getting-started` + `/changelog`
- **MDX globals (no import needed):** `<PageHeader>`, `<PreviewCard>`, `<PropsTable>`, `<EmptyComponentState>`, `<Swatch>`, `<SwatchGrid>`, `<TokenAutoGrid>`, `<MotionAutoGrid>`
- **TOC sidebar:** auto-shows on `/components/*` + `/foundations/*`
- **7-section docs structure mandatory:** Hero → Variants → Sizes → States → Props → Accessibility → Things to watch
- **Vite middleware endpoints:**
  - `GET /api/figma-manifest` — instant local manifest (skeleton trigger)
  - `GET /api/figma-check[?slug=X]` — drift check w/ 30s in-memory cache, `X-Cache: HIT|MISS` header
- **FigmaStatus page:** tabs (Component / Foundation), skeleton cards while loading, "Check now" w/ 30s cache awareness

### Client-test app (`client-test/`)

| File | Purpose |
|---|---|
| `CLAUDE.md` | Hard rule PAKEM — every UI must use POD primitives + tokens. Coverage map, removed-shadow notes, AGENTS.md pointer for live truth |
| `CLIENT-PROMPT.md` | Setup guide (Tailwind v3, PostCSS, theme order, common pitfalls) |
| `COMPONENT-RECIPES.md` | 10 ready-to-paste patterns (header, toolbar, settings, confirmation, etc.) |
| `src/components/AddIncomeForm.tsx` | Proof-of-concept Indonesian finance form |
| `src/components/form/{Field,TextInput,Select}.tsx` | Local primitives (Rule 10 — missing in pod-test-ui yet) |
| `src/lib/pod-agentation.ts` | Enriches `agentation` annotation output with POD context |

### `.figma/` — drift state

Tracked items (6):
- `button` (267:355)
- `search` (2346:404 — docs `SearchInput`)
- `checkbox` (2351:151)
- `foundation-radius` (2352:3173 — docs `Radius`)
- `foundation-shadows` (2352:159 — docs `Elevation`)
- `foundation-spacing` (2360:239 — docs `Spacing`)

All tokens: font family auto-coerced "SF Pro" → "Inter" on every sync
(rule retained as idempotent safety guard; designer Figma already migrated).

---

## 2. Slash commands

### Custom (`.claude/commands/`)

| Command | Arg | Behavior |
|---|---|---|
| **`/new-item`** | `<figma-url>` | Bootstrap node → manifest + variables + bless. No code gen. |
| **`/sync-figma`** | `<slug>` or URL | Full pull-and-apply. **FIRST-SYNC GUARD** for code that pre-dates Figma tracking (FULL PATH mandatory). **Sacred-namespace boundary** enforced (no `accent-* ↔ danger-*` cross-mapping). Font family coerce SF Pro → Inter idempotent. Auto-create 7-section docs MDX if missing. Auto-bless after success. |
| **`/refresh-vars`** | `[slug]` | Lightweight `.figma/variables/<slug>.json` refresh only. No code, no bless, no rebuild. |
| **`/publish`** | `[patch\|minor\|major\|x.y.z]` | Pre-flight: clean tree + drift in sync + npm whoami + no version conflict. Typecheck → build (tokens first) → bump lockstep → **PAUSE for "confirm"** → publish → local git tag (no auto-push). |

### Pre-allowed bash (no prompt)

```bash
node scripts/figma/check.mjs [slug] [--json|--slugs-only|--urls-only]
node scripts/figma/bless.mjs <slug> [--all] [--prune]
node scripts/figma/discover.mjs
node_modules/.bin/tsup
```

### Built-in skills referenced
`/loop`, `/schedule`, `/review`, `/security-review`, `/init`,
`/fewer-permission-prompts`, `/simplify`, `update-config`

---

## 3. Memory entries (cross-session)

Located at `~/.claude/projects/-Users-helmiismail-Documents-Component-pod-native-design-system/memory/`.

- `user_language.md` — User communicates in Indonesian; reply in same.
- `feedback_npm_publish_otp.md` — Account `hixelation` uses WebAuthn (security key "hixel"), not TOTP. Recovery codes (64-char hex) consumed single-use even on failed attempts. Track consumed codes; suggest regen at `npmjs.com/settings/hixelation/account-info` (not `/tokens` — that's for access tokens).

---

## 4. Today's notable incidents + lessons

1. **Primary hover rendered maroon (0.1.0–0.1.2)**
   - Root cause: previous sync mapped `surface-primary-hover` (Figma `#15803d`) to `hover:bg-danger-hover` (`#991b1b`) — cross-namespace sacred violation.
   - Fix: removed override (0.1.3). Now `shadow-glow-accent-inset-strong` carries hover affordance.
   - Spec hardened: `/sync-figma` step 4 explicit boundary table + grep guard pre-commit.

2. **0.1.2 shipped stale dist**
   - Root cause: permission hook intercepted whole bash chain (build + publish); build step never ran; publish used last-built dist.
   - Fix: 0.1.3 re-publish after explicit force-rebuild. Verified `grep` on dist before pack.
   - Lesson: spec should add **mandatory dist-vs-source verify before publish**. Open TODO below.

3. **Recovery codes consumed unexpectedly**
   - Codes 1 + 2 from original 5-code batch rejected on first try yesterday. Re-trying today still rejected.
   - Reason: NPM marks recovery codes consumed on FAILED attempts too (anti-replay).
   - Lesson: cycle through codes, don't retry rejected ones. Track via memory.

4. **Vite cache invalidation gotcha**
   - After `npm update pod-test-ui`, vite kept serving old optimized deps.
   - Fix: `rm -rf node_modules/.vite && vite --force`.
   - Lesson: when consumer updates package version, always `--force` re-optimize.

---

## 5. Open ideas / backlog (prioritized)

Inspired by today's findings. Sorted by impact-to-effort ratio.

### High impact, low effort (≤ 1 day each)
- **P1)** Add **dist-vs-source verify** to `/publish` spec — grep critical class names in dist after rebuild, fail pre-publish if divergent.
- **P2)** Convert `AGENTS.md` to **`agents.json`** structured manifest. Smaller token count for Claude context, programmatic-queryable.
- **P3)** Wire **Renovate** in `client-test/` — auto-PR on every POD release.
- **P4)** **CI auto-drift-check on PR** — GitHub Action runs `check.mjs --json`, posts comment table.
- **P5)** Public **AGENTS.md viewable** — symlink to `apps/docs/public/AGENTS.md` for external consumer reference URL.

### High impact, medium effort (2–4 days each)
- **P6)** **Component Playground** — interactive prop editor at `/playground` (already on this week's timeline).
- **P7)** **Visual regression** — Chromatic or Percy snapshot per PR. Would have caught today's "maroon hover" bug.
- **P8)** **MCP server for POD** — expose tokens + components as MCP resources. Claude in consumer projects queries via MCP instead of reading AGENTS.md. Huge token-efficiency win.
- **P9)** **NDJSON streaming** for `/api/figma-check` — render cards as each Figma fetch returns. Worth doing at 30+ components.

### Long-term (week+ effort)
- **P10)** **Figma webhook handler** — real-time invalidation. Deferred until > 50 components tracked. Use Vercel Edge Functions + Vercel KV (Hobby tier sufficient up to 10× growth).
- **P11)** **Figma plugin** — select component in Figma → run `/sync-figma` from plugin. Inverse: select code → highlight Figma node.
- **P12)** **POD review bot** — Claude reads PR diff in client-test, comments POD rule violations before human review.
- **P13)** **Browser extension @-completion** — universal POD autocomplete in any textarea (Agentation, Claude.ai, Cursor, etc.).

### Client-test as testbed (ongoing)
- **P14)** Add 2-3 more forms: `AddExpenseForm`, `BudgetCard`, `TransactionList` — identify primitive gaps.
- **P15)** **A11y audit page** — showcase tab order, screen reader, focus trap, keyboard shortcuts.
- **P16)** **Token playground** — live CSS variable sliders, all rendered components respond.
- **P17)** **Bulk-replace migration tool** — `scripts/migrate-tokens.mjs` scan client code, detect anti-patterns, output patches.

### Operational
- **P18)** **Token deprecation lifecycle** — `@deprecated` JSDoc + console.warn in MINOR, removal in MAJOR. Replaces today's "delete + bump minor" approach.
- **P19)** **Recovery code rotation policy** — regen at npm settings every 90 days.
- **P20)** **Drift health metric** — rolling avg "drift-to-sync time" surfaced on FigmaStatus.

---

## 6. Stack-wide things to know

- **Tailwind v3 only** (preset is JS-style). v4 (`@tailwindcss/postcss`) breaks the preset model silently. Refuse v4 install requests.
- **No `dark:` modifiers** anywhere. Dark mode is token-swapped at CSS variable layer when `.dark` class active on `<html>`.
- **Sacred tokens never modified** by sync: `accent-*`, `danger-*`, `warning-*`, `success-*`, `info-*`, `border-focus`, `shadow-glow-*-*`.
- **Experiment tokens** are time-bounded — keep token def in `theme.css` for opt-in use, but don't auto-apply via component override (today's lesson).
- **Versions in lockstep** for tokens + ui. Always bump together unless emergency hotfix.

---

## 7. Open questions / decisions pending

- **@-mention autocomplete in Agentation comments** — pending design. See Section 8.
- **Foundation typography sync** — Figma typography page not yet bootstrapped via `/new-item`. Existing Typography.mdx manual. Defer decision (Opsi A/B/C) until designer ready.
- **Webhook handler** — deferred. See P10.
- **Bless `--all` parallelization** — currently sequential like old check.mjs was. Could apply same bulk-fetch treatment.
- **Subpath imports** (`pod-test-ui/button`) — exposed in exports map but discouraged in client guide. Decide: keep dual-mode or remove subpath exports.

---

## 8. Pending design decision — @-mention autocomplete in Agentation

User asked (2026-05-12): can we have `@button` autocomplete in Agentation
comment textarea that suggests component variants from the POD package?

Goal: seamless live design flow.

**Pending: thinking through tiers and trade-offs. See chat thread.**
