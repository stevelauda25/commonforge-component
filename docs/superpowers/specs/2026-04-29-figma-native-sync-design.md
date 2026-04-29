# Figma-Native Sync — Design Spec

**Date:** 2026-04-29
**Status:** Approved (brainstorming complete, ready for implementation plan)
**Owner:** Steve Lauda

---

## 1. Overview

### Goal

Move from manual `/sync-figma <url>` (developer-driven) to an automated pipeline where Figma changes propagate to the docs site through a reviewed PR — no developer typing required.

### Source of truth

**Figma is the source of truth for visual.** The codebase (`packages/tokens/*`, `packages/ui/*`, `apps/docs/*`) is a projection of Figma. The pipeline rebuilds the projection whenever Figma changes, then asks a human to verify before publishing.

### Service-template note

This design also serves as the reference architecture for offering "AI-native design system" as a service to clients. The reusable IP is: the `/sync-figma` slash command, the diff/snapshot scripts, the GitHub workflow, and the webhook receiver. Per-client variation is limited to: the manifest contents, the secrets, and the Vercel project. Architecture should stay generic — no POD-specific assumptions baked in beyond the existing token vocabulary.

### Non-goals

- Reverse sync (codebase → Figma). One-way only.
- Replacing manual `/sync-figma` for one-off / experimental work; the pipeline runs alongside it.
- Storybook, Tokens Studio, Chromatic/Percy integration.
- Designer-driven Slack commands (out of MVP; reconsider if cron-only fallback feels too laggy).
- Multi-file Figma libraries beyond manifest support (no per-file optimization).

### Success criteria

- Designer publishes a Figma library change → reviewed PR appears in <5 min (webhook path) or <24h (cron fallback).
- Designer or developer can review the diff + open the preview URL + click Merge in <10 min.
- Pipeline runs without manual intervention >90% of the time over a 2-week measurement window.
- Bad LLM output never reaches production (caught by typecheck, build, grep guardrails, and human review).

---

## 2. Locked Decisions

| Dimension | Choice | Rationale |
|---|---|---|
| **Scope** | Full `/sync-figma` (tokens + components + MDX) | Match what the slash command already does; no half-measure. |
| **Trust model** | Auto-PR + preview deploy + manual approve | LLM output too variable for direct-to-main. Preview deploy lets designer "feel" the change. |
| **Trigger** | Figma `LIBRARY_PUBLISH` webhook + nightly cron safety net | Webhook = intentional moment. Cron catches missed events. |
| **Engine** | Claude Code Action (`anthropics/claude-code-action`) | Reuses existing slash command verbatim; no rewrite. |
| **Mapping** | Manifest + snapshot diff | Figma webhook only tells us "library X published"; we need to figure out which components changed. |
| **PR strategy** | One PR per publish | Designer publishes 1 component at a time; one PR is the right granularity. |
| **Hosting** | Vercel for docs + separate Vercel project for webhook receiver | Built-in preview deploys; isolated blast radius. |
| **Failure handling** | Auto-retry 1x → if fail, open PR with red checks anyway | Visibility > silent failures. |
| **Manifest ownership** | Developer maintains `.figma/manifest.json` via PR | Standard dev workflow; manifest is infrastructure. |
| **Bot identity** | Dedicated GitHub App | Clean commit history; scoped permissions. |
| **Webhook receiver** | Separate Vercel project (`apps/webhook-receiver`) | Blast radius isolated from docs project. |
| **MDX preservation** | Surgical — preserve hand-written sections (Accessibility, Things to watch) | Update `/sync-figma` command to be explicit about this. |
| **Empty PR behavior** | Skip PR creation entirely | Snapshot-only PRs are noise. |
| **Repo & preview privacy** | Private | Internal use only; designer needs Vercel access. |

---

## 3. Architecture

### High-level diagram

```
┌────────────────┐
│  Designer      │
│  klik          │
│  "Publish      │
│   library"     │
└───────┬────────┘
        │ webhook (LIBRARY_PUBLISH)
        ▼
┌────────────────────────────┐         ┌────────────────────────┐
│  Vercel Function           │         │  GitHub Actions        │
│  /api/figma-webhook        │ ──────▶ │  (cron: nightly)       │
│  (separate Vercel project) │ disp.   │                        │
│                            │         │  Same workflow,        │
│  - verify webhook secret   │         │  triggered by schedule │
│  - fire repository_dispatch│         │                        │
└────────────────────────────┘         └────────────┬───────────┘
                                                    │
                                                    ▼
                              ┌──────────────────────────────────────┐
                              │  GitHub Action: figma-sync.yml       │
                              │  ──────────────────────────────       │
                              │  1. Load .figma/manifest.json        │
                              │  2. Diff each entry vs snapshot      │
                              │  3. For each changed slug:           │
                              │     - run Claude Code Action with    │
                              │       /sync-figma <fileKey>:<nodeId> │
                              │     - retry 1x on transient fail     │
                              │  4. Update .figma/snapshots.json     │
                              │  5. pnpm typecheck + pnpm build      │
                              │     (captured, doesn't fail run)     │
                              │  6. Open PR (figma-sync/<run_id>)    │
                              │     - red checks if (5) failed       │
                              │     - body = changelog summary       │
                              │  Concurrency group: figma-sync       │
                              └────────────┬─────────────────────────┘
                                           │
                                           ▼
                              ┌──────────────────────────────┐
                              │  Vercel preview deploy       │
                              │  per PR (built-in)           │
                              │  Bot comments preview URL    │
                              └────────────┬─────────────────┘
                                           │
                                           ▼
                              ┌──────────────────────────────┐
                              │  Designer / dev review:      │
                              │  - read diff                 │
                              │  - open preview URL          │
                              │  - merge OR close            │
                              └────────────┬─────────────────┘
                                           │ on merge
                                           ▼
                              ┌──────────────────────────────┐
                              │  Vercel production deploy    │
                              │  → docs site live            │
                              └──────────────────────────────┘
```

### Existing pieces reused as-is

- `.claude/commands/sync-figma.md` — engine. One small edit needed (Section 7) to be explicit about MDX preservation.
- `packages/tokens/*` — write target.
- `packages/ui/src/<slug>/*.tsx` — write target.
- `apps/docs/src/pages/components/*.mdx` — write target.
- `apps/docs/src/lib/routes.ts` — write target (only when adding brand-new components, which is rare in auto-sync).
- `pnpm typecheck` + `pnpm build` — validation gates.

---

## 4. Components & Responsibilities

### 4.1 Manifest — `.figma/manifest.json`

**Purpose:** Single source of truth for "which components are track-able from Figma."

**Schema:**
```json
{
  "version": 1,
  "components": [
    { "slug": "button",   "fileKey": "abc123", "nodeId": "12:34", "status": "ready" },
    { "slug": "checkbox", "fileKey": "abc123", "nodeId": "12:56", "status": "ready" }
  ]
}
```

**Read by:** diff script, `/sync-figma` (lookup nodeId by slug for cron triggers), manual debugging.
**Written by:** developer manually via PR when adding a new component.
**Depends on:** nothing (pure data).

### 4.2 Snapshot — `.figma/snapshots.json`

**Purpose:** Remember the Figma state from last sync, so we can detect drift.

**Schema:**
```json
{
  "version": 1,
  "syncedAt": "2026-04-29T10:00:00Z",
  "components": {
    "button":   { "varDefsHash": "sha256:abcd...", "syncedAt": "2026-04-29T10:00:00Z" },
    "checkbox": { "varDefsHash": "sha256:efgh...", "syncedAt": "2026-04-28T15:30:00Z" }
  }
}
```

**Read by:** diff script.
**Written by:** GitHub Action at the end of each successful sync (committed to the same branch as the code changes).
**Depends on:** nothing (pure data).

### 4.3 Webhook receiver — `apps/webhook-receiver/api/figma-webhook.ts`

**Purpose:** Receive Figma webhook, verify HMAC, fire GitHub `repository_dispatch`.

**Input:** HTTP POST from Figma. Body: `{ event_type: "LIBRARY_PUBLISH", file_key, ... }`. Header: `X-Figma-Signature`.

**Output:** HTTP POST to `https://api.github.com/repos/<owner>/<repo>/dispatches` with body `{ event_type: "figma-library-published", client_payload: { fileKey } }`.

**Logic:** ~30 lines. Verify HMAC, validate event_type, post to GitHub, return 2xx/4xx. Fail-fast on bad signature (401).

**Deployment:** Separate Vercel project. Single function, no other code.

**Env vars:**
- `FIGMA_WEBHOOK_SECRET` — for HMAC verification
- `GITHUB_APP_PRIVATE_KEY` + `GITHUB_APP_ID` + `GITHUB_INSTALLATION_ID` — for dispatching as the GitHub App
- `GITHUB_REPO` — `stevelauda25/pod-native-design-system`

### 4.4 Diff script — `scripts/figma/diff-manifest.ts`

**Purpose:** Determine which components changed since last sync.

**Input:** `.figma/manifest.json` + `.figma/snapshots.json` + `FIGMA_PAT` env.

**Output:** JSON array of changed slugs to stdout.

**Logic:**
1. Load manifest + snapshot.
2. For each entry: fetch current `get_variable_defs` equivalent from Figma REST API.
3. Hash response (canonical-JSON, sorted keys).
4. Compare to snapshot hash.
5. Output: `["button", "checkbox"]`.

**Edge cases:**
- Figma API 404 (node deleted) → emit warning to step summary, exclude from output, don't fail.
- Figma API 429 → backoff 30s, retry 1x, then skip slug for this run (cron will catch).

**Depends on:** Figma REST API, `node:fetch`.

### 4.5 Update-snapshot script — `scripts/figma/update-snapshot.ts`

**Purpose:** Refresh hashes in snapshot file after a successful sync.

**Input:** Array of synced slugs (CLI args) OR `--all` flag for bootstrap, + current `.figma/snapshots.json`.

**Output:** Atomic rewrite of `.figma/snapshots.json`.

**Logic:**
1. For each input slug: re-fetch Figma, re-hash.
2. Update `components[slug].varDefsHash` and `components[slug].syncedAt`.
3. Update top-level `syncedAt`.
4. Write to temp file, rename atomic.

**Depends on:** Figma REST API, `node:fs`.

### 4.6 GitHub Action — `.github/workflows/figma-sync.yml`

**Purpose:** Orchestrator.

**Triggers:**
- `repository_dispatch` (type: `figma-library-published`) — from webhook
- `schedule` — nightly cron at 02:00 UTC
- `workflow_dispatch` — manual button (for testing & manual rollback recovery)

**Concurrency:**
```yaml
concurrency:
  group: figma-sync
  cancel-in-progress: false
```

**Steps (high-level):**
1. Checkout main, setup pnpm, install deps.
2. Run diff script → `CHANGED_SLUGS` env.
3. If empty, exit 0.
4. For each slug in `CHANGED_SLUGS`:
   - Invoke `anthropics/claude-code-action` with prompt `/sync-figma <fileKey>:<nodeId>`.
   - On transient error (429, 503, network): sleep 30s, retry 1x.
5. Run update-snapshot script for synced slugs.
6. Run `pnpm typecheck` + `pnpm build` (capture exit codes, do not fail step).
7. Run grep guardrails (no hex in `packages/ui/src/`, light/dark parity, token bridge — see Section 5.3).
8. If `git status --porcelain` empty, exit 0 (no PR).
9. Open PR via `peter-evans/create-pull-request`:
   - Branch: `figma-sync/<run_id>`
   - Title: `Figma sync: <comma-separated slugs>`
   - Body: changelog template (see 4.8)
   - Labels: `figma-sync`, `figma-sync-broken` if validation failed.

**Secrets:**
- `ANTHROPIC_API_KEY`
- `FIGMA_PAT`
- `BOT_GITHUB_APP_PRIVATE_KEY` + `BOT_GITHUB_APP_ID` (for PR creation)

### 4.7 Claude Code Action invocation

**Purpose:** Run `/sync-figma` in the runner.

**Setup:**
- Mount Figma MCP server (verify it works headlessly in Phase 0).
- Pass `--prompt "/sync-figma <fileKey>:<nodeId>"`.
- Set max turns to bound run time.
- Capture stdout/stderr to step summary.

**The slash command needs one edit before Phase 1** (see Section 7): explicitly preserve hand-written MDX sections.

### 4.8 PR body template

```markdown
## Figma sync — <ISO timestamp>

**Triggered by:** webhook (LIBRARY_PUBLISH) | nightly cron | manual
**Components synced:** button, checkbox

### Changes
- `button`: tokens updated (accent-default), 2 variant classes adjusted
- `checkbox`: tokens unchanged, MDX example updated

### Validation
- [x] typecheck passed
- [x] build passed
- [x] no hex colors in packages/ui/src/
- [x] light/dark parity ok
- [x] token bridge ok

### Preview
🔗 (Vercel bot will comment with preview URL when build completes)

### How to merge
Open the preview URL, walk through the affected component pages,
verify visual matches Figma, then merge.

---
*If checks failed:* the diff still represents Claude's attempt.
Either fix issues directly on this branch and re-push, or close
the PR and run `/sync-figma` locally to investigate.
```

---

## 5. Error Handling, Retries & Edge Cases

### 5.1 Failure mode matrix

| Layer | Failure | Detection | Handling |
|---|---|---|---|
| Webhook | Bad signature | HMAC mismatch | 401, log, no dispatch |
| Webhook | Vercel cold start timeout | Figma marks delivery failed | Figma auto-retries; cron is the safety net |
| Webhook | Duplicate webhook | Same `webhook_id` | Allow; concurrency group + diff script de-duplicate |
| Webhook → GH | `repository_dispatch` 5xx | Non-2xx response | Log, return 502 to Figma (Figma retries) |
| Diff | Figma API 429 | Status code | Backoff 30s, retry 1x, then skip slug |
| Diff | Figma API 404 (node deleted) | Status code | Warn in step summary, exclude from sync list |
| Diff | Manifest refers to deleted node | 404 from Figma | Same as above. PR body: "⚠️ button: nodeId not found" |
| Sync | Anthropic 429/503 | Status code | Retry 1x with 30s sleep |
| Sync | Claude run timeout | GitHub Action timeout | Mark slug failed, continue |
| Sync | Invalid TS generated | `pnpm typecheck` fails | PR opens with red checks |
| Sync | Invalid MDX generated | `pnpm build` fails | PR opens with red checks |
| Sync | Hex value introduced | grep guardrail | PR opens with red checks |
| Sync | Token renamed silently | No automated detection | Caught at human review (mitigation: add "tokens removed" diff in PR body) |
| Sync | Empty diff | `git status` | Skip PR, log "no-op" |
| Snapshot | Concurrent writes | N/A | Concurrency group prevents |
| PR | Branch already exists | `git push` fails | Append `-retry`; or no-op if same content |
| PR | Stale (>14 days) | Separate cron | Auto-comment + label `stale`. Don't auto-close. |

### 5.2 Concurrency

`concurrency: { group: figma-sync, cancel-in-progress: false }` ensures two webhooks back-to-back queue rather than race. Snapshot file integrity preserved.

### 5.3 Guardrails (CI checks)

Runs after sync, before PR:

```bash
# 1. No hex in components
grep -rE '#[0-9a-fA-F]{3,8}' packages/ui/src/ && exit 1 || true

# 2. Token bridge: every CSS var in theme.css must have a Tailwind preset entry
tsx scripts/figma/verify-token-bridge.ts

# 3. Light/dark parity: every var in :root must exist in .dark
tsx scripts/figma/verify-light-dark-parity.ts
```

Each guard is 30-50 lines, pure verification. Faster than human diff review.

### 5.4 Idempotency

- Branch naming: `figma-sync/<run_id>` — unique per workflow run.
- Snapshot writes: temp file + rename (atomic).
- Webhook deduplication: implicit. If two dispatches fire within seconds, the first run updates the snapshot; the second run's diff returns `[]` and exits.

### 5.5 Observability

| Signal | Where |
|---|---|
| Webhook received | Vercel function logs |
| Dispatch sent to GitHub | Vercel function logs |
| Workflow run started | GitHub Actions UI + Slack notification |
| Per-component sync result | GitHub Actions step summary (`$GITHUB_STEP_SUMMARY`) |
| Anthropic cost per run | Step summary (parsed from Action output) |
| PR opened | GitHub notification + Slack |
| PR with red checks | Slack with `🚨` prefix |
| Stale PRs | Daily cron, posts to Slack |

### 5.6 Rollback

- Bad merge: revert PR via GitHub UI ("Revert" button).
- Snapshot reverts too — next sync re-detects "change" and re-attempts. If designer also reverted in Figma, no loop. If not, designer needs to re-publish to clear it.

### 5.7 Cost & rate limit budget

| Resource | Limit | Expected usage |
|---|---|---|
| Anthropic API | depends on plan | ~$0.5–2 per component sync. ~1 sync/day → $30–60/mo. |
| Figma REST API | 60 req/min/user | ~60 req/day. Safe. |
| GitHub Actions minutes | 2000/mo (private free) | ~1050 min/mo. Within free tier. |
| Vercel function invocations | 100k/mo free | ~150/mo. Trivial. |
| Vercel preview deploys | Unlimited free | ~150/mo. Fine. |

---

## 6. MVP Phasing

Principle: prove each layer in isolation. Start with one component (Button).

### Phase 0 — Bootstrap (~2-4 hours)

- Vercel project for `apps/docs`, connected to repo.
- Verify production deploy from main + PR preview deploys.
- GitHub repo secrets: `ANTHROPIC_API_KEY`, `FIGMA_PAT`.
- New file: `.figma/manifest.json` (Button only).
- New file: `.figma/snapshots.json` (initialize with one-shot lokal script).
- New file: `.figma/README.md` (when & how to edit manifest).

### Phase 1 — Manual sync via workflow_dispatch (Button only) (~4-8 hours)

PROVES: LLM-in-CI loop produces valid PRs.

- New: `scripts/figma/diff-manifest.ts`, `scripts/figma/update-snapshot.ts`.
- New: `.github/workflows/figma-sync.yml` with **only `workflow_dispatch` trigger**.
- Test: designer publishes Button change → dev triggers workflow manually → PR appears, reviewable.
- **Stop condition:** loop works at least 3x in a row for Button. If Claude consistently produces invalid output (typecheck fails >50% runs), STOP and re-evaluate engine choice.

### Phase 2 — Add cron (~30 min)

PROVES: diff loop autonomous.

- Edit `figma-sync.yml`: add `schedule: - cron: '0 2 * * *'`.
- **Stop condition:** cron fires 5 nights, 0 false positives, 0 false negatives.

### Phase 3 — Webhook receiver (~4-6 hours)

PROVES: realtime loop, latency <5min.

- New: `apps/webhook-receiver/` (separate Vercel project).
- New: `apps/webhook-receiver/api/figma-webhook.ts`.
- Edit `figma-sync.yml`: add `repository_dispatch` trigger.
- Configure Figma webhook via REST API to point to Vercel function.
- Vercel env vars: `FIGMA_WEBHOOK_SECRET`, GitHub App credentials, `GITHUB_REPO`.
- **Stop condition:** 3 successful webhook → PR cycles, latency <5min.

### Phase 4 — Scale to all ready components (~1 hour)

- Add `checkbox`, `search-input`, `tooltip` to `.figma/manifest.json`.
- Re-run `tsx scripts/figma/update-snapshot.ts --all` locally, commit.

### Phase 5 — Hardening (~4-8 hours, ship incrementally)

- CI guardrails (no-hex, light/dark parity, token bridge).
- Concurrency group.
- Slack notifications.
- Stale PR cron.
- Cost monitoring.

### Total to functional MVP (P0–P3)

~2 working days for solo dev.

---

## 7. Pre-flight Checklist (verify before Phase 0)

These items must be validated before writing code, because they can invalidate parts of the design:

| # | Item | How to verify | If wrong |
|---|---|---|---|
| 1 | Figma plan supports webhooks v2 | Check Figma pricing page; webhook is Pro+ | Skip Phase 3, cron-only |
| 2 | `anthropics/claude-code-action` exists & supports slash commands + MCP | Read docs, run hello-world workflow | Custom Action calling Claude API directly (significant rewrite) |
| 3 | Figma MCP server runnable headlessly in GitHub Actions | Try `npx @claude/figma-mcp` in runner | Use Figma REST API directly via WebFetch (lower fidelity, no screenshot input) |
| 4 | Designer team has library publish access | Ask designer | Cron-only |
| 5 | Update `.claude/commands/sync-figma.md` to specify MDX preservation | Edit + dry run on Button | N/A — required pre-Phase-1 step |

---

## 8. Folder & File Changes Summary

```
NEW:
  .figma/
    manifest.json                              ← hand-edited, Phase 0
    snapshots.json                             ← auto-managed, Phase 0 init
    README.md                                  ← human docs, Phase 0
  scripts/figma/
    diff-manifest.ts                           ← Phase 1
    update-snapshot.ts                         ← Phase 1
    verify-token-bridge.ts                     ← Phase 5
    verify-light-dark-parity.ts                ← Phase 5
  .github/workflows/
    figma-sync.yml                             ← Phase 1, expanded in 2/3/5
    figma-stale-prs.yml                        ← Phase 5
  apps/webhook-receiver/                       ← Phase 3, separate Vercel project
    package.json
    api/figma-webhook.ts
    vercel.json

EDITED:
  .claude/commands/sync-figma.md               ← pre-Phase-1: MDX preservation rule
  .figma/manifest.json                         ← Phase 4: add components

UNCHANGED (write targets only):
  packages/tokens/**
  packages/ui/**
  apps/docs/**
```

---

## 9. Out of Scope (MVP)

- Reverse sync (codebase → Figma).
- Storybook integration.
- Visual regression testing (Chromatic, Percy).
- Tokens Studio integration.
- Designer-driven Slack commands.
- Multi-file Figma libraries (manifest supports it; we don't optimize for it).

---

## 10. Risks Summary

**High:**
- LLM output variability (Claude in CI may produce different code than local). Mitigation: trust model 3 (human review), guardrails, retry-then-fail-soft.
- Anthropic API cost overrun if sync fires too often. Mitigation: cost monitoring, snapshot-based diff prevents redundant runs.

**Medium:**
- Figma webhook reliability (Pro tier required, Figma may have downtime). Mitigation: cron safety net.
- Figma MCP in CI may not work headlessly. Mitigation: pre-flight item #3, fallback to REST.
- Claude renaming a token silently breaks consumers. Mitigation: explicit "tokens removed" section in PR body.

**Low:**
- Stale PR backlog. Mitigation: stale cron in Phase 5.
- Concurrent runs racing on snapshot. Mitigation: concurrency group.

---

## 11. Service-Template Reusability

What's reusable for client engagements (the IP):
- `/sync-figma` slash command (with MDX preservation update)
- `scripts/figma/*` (diff, update-snapshot, verifiers)
- `.github/workflows/figma-sync.yml`
- `apps/webhook-receiver/` template
- This design doc as reference

Per-client variation (the work each engagement requires):
- `.figma/manifest.json` contents
- Tokens vocabulary in client's `theme.css` (different brand, different semantic names)
- Component conventions (their cn helpers, their forwardRef pattern, etc.)
- Secrets (their Anthropic, Figma PAT, GitHub App)
- Vercel projects (their accounts)

The architecture is generic. The slash command is the only piece that has POD-specific assumptions baked in (semantic token names, file layout) — for client work, this needs to be parameterized per client codebase OR rewritten to be project-aware via reading `.claude/commands/sync-figma.md` from the target repo.

---

## 12. Next Steps

1. User reviews this spec.
2. On approval, create implementation plan via `superpowers:writing-plans` skill.
3. Plan execution starts with Phase 0.
