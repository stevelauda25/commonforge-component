# Figma-Native Sync — Button MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the automated Figma → PR pipeline for **Button only**, end-to-end (Phase 0–3 of the design spec). Designer publishes Button in Figma → reviewed PR appears with preview deploy in <5 min (webhook) or <24 h (cron).

**Architecture:** Reuse existing `scripts/figma/check.mjs` + `bless.mjs` as the diff/snapshot engine — they already produce CI-friendly output (`--slugs-only`, exit codes). Wrap with a GitHub Actions workflow that invokes `anthropics/claude-code-action` with the `/sync-figma` slash command per drifted slug, runs validation, then opens a PR. Layer on cron and a separate Vercel webhook receiver for realtime triggers.

**Tech Stack:** GitHub Actions, `anthropics/claude-code-action`, `peter-evans/create-pull-request`, Vercel (for both `apps/docs` previews and webhook receiver), Figma REST API (existing in `_lib.mjs`), Figma webhooks v2.

**Source spec:** [docs/superpowers/specs/2026-04-29-figma-native-sync-design.md](../specs/2026-04-29-figma-native-sync-design.md)

**Scope of this plan:**
- ✅ Phase −1 (pre-flight verification — gating)
- ✅ Phase 0 (Vercel + secrets bootstrap)
- ✅ Phase 1 (`workflow_dispatch`, Button only)
- ✅ Phase 2 (nightly cron)
- ✅ Phase 3 (webhook receiver)
- ❌ Phase 4 (scale to checkbox/search-input/tooltip — separate plan)
- ❌ Phase 5 (CI guardrails, Slack, stale-PR cron — separate plan)

**Existing infrastructure to reuse (do not duplicate):**
- [.figma/manifest.json](../../../.figma/manifest.json) — already has Button entry
- [.figma/snapshots.json](../../../.figma/snapshots.json) — already initialized
- [.figma/README.md](../../../.figma/README.md) — already documents the system
- [scripts/figma/check.mjs](../../../scripts/figma/check.mjs) — supports `--slugs-only` and `--json` for CI piping
- [scripts/figma/bless.mjs](../../../scripts/figma/bless.mjs) — supports per-slug snapshot refresh
- [scripts/figma/_lib.mjs](../../../scripts/figma/_lib.mjs) — `hashComponent`, `summarize`, `diffSummaries`
- [.claude/commands/sync-figma.md](../../../.claude/commands/sync-figma.md) — the engine (one edit needed in Task 3)
- `pnpm figma:check`, `pnpm figma:bless` package scripts

**Spec deviation note:** The design spec calls for new files `scripts/figma/diff-manifest.ts` and `scripts/figma/update-snapshot.ts`. Those are unnecessary — the existing `.mjs` scripts already provide identical functionality. The workflow shells out to them via `node scripts/figma/check.mjs --slugs-only` and `node scripts/figma/bless.mjs <slug>`. Saves ~150 lines and one rewrite cycle.

---

## Phase −1 — Pre-flight Verification (BLOCKING)

The design spec lists three external dependencies that, if invalid, change the architecture. Verify them with a throwaway hello-world workflow before writing production infrastructure. **Do not skip this phase.** A wrong assumption here costs days later.

### Task 1: Verify `anthropics/claude-code-action` exists & supports slash commands + MCP

**Files:**
- Create: `.github/workflows/preflight-claude-action.yml` (throwaway, deleted in Task 3)

- [x] **Step 1.1: Verified externally on 2026-05-01**

Action `anthropics/claude-code-action@v1` confirmed:
- ✅ v1.0 stable (released 2025-08-26), 175 releases, actively maintained.
- ✅ Accepts `prompt` input.
- ✅ Accepts `anthropic_api_key` input.
- ✅ MCP supported — but **NOT** via `mcp_config` input (doesn't exist). Use `claude_args: --mcp-config '{...}'` instead.
- ❓ Slash command auto-loading from `.claude/commands/*.md` is NOT documented. Needs empirical verification in Step 1.4. Fallback: inline the command body into the prompt.
- ❌ No `max_turns` input. Set via `claude_args: --max-turns N` if Claude CLI supports it.

**Implication for plan:** All `mcp_config:` blocks below must be rewritten as `claude_args: |\n  --mcp-config '...'`.

- [ ] **Step 1.2: Create throwaway preflight workflow**

Path: `.github/workflows/preflight-claude-action.yml`

```yaml
name: preflight-claude-action
on:
  workflow_dispatch:

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Claude with a trivial prompt
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "List the files in scripts/figma/ and report their byte sizes. End with the line: PREFLIGHT-1-PASSED"
          claude_args: --max-turns 3
```

- [ ] **Step 1.3: Add `ANTHROPIC_API_KEY` to repo secrets**

**[USER ACTION REQUIRED]** GitHub UI → Settings → Secrets and variables → Actions → New repository secret:
- Name: `ANTHROPIC_API_KEY`
- Value: existing Anthropic key

Confirm in chat: "secret added".

- [ ] **Step 1.4: Trigger preflight, observe**

GitHub UI → Actions → preflight-claude-action → Run workflow → main.

Expected: green check. Step summary contains `PREFLIGHT-1-PASSED` and a list including `check.mjs`, `bless.mjs`, `_lib.mjs`.

If failure: read logs, decide whether the action's invocation surface differs from spec assumptions. If unfixable in <30 min, **STOP and reconsider Phase 1 engine choice**.

- [ ] **Step 1.5: Commit the preflight workflow**

```bash
git add .github/workflows/preflight-claude-action.yml
git commit -m "ci(preflight): verify claude-code-action invocation"
```

### Task 2: Verify Figma MCP server runs headlessly in the runner

**Files:**
- Modify: `.github/workflows/preflight-claude-action.yml`

- [ ] **Step 2.1: Add `FIGMA_PAT` and `FIGMA_FILE_KEY` to repo secrets**

**[USER ACTION REQUIRED]** GitHub UI → Settings → Secrets and variables → Actions:
- Secret: `FIGMA_PAT` (value from local `.env.local`)
- Secret: `FIGMA_FILE_KEY` = `TCd9exLXTUMciyw1VqnPSK`

Confirm in chat: "figma secrets added".

- [ ] **Step 2.2: Extend preflight workflow to mount Figma MCP**

Edit `.github/workflows/preflight-claude-action.yml`. Replace the `prompt` and add `mcp_config`:

```yaml
name: preflight-claude-action
on:
  workflow_dispatch:

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Write MCP config to runner temp
        run: |
          cat > "$RUNNER_TEMP/mcp-config.json" <<JSON
          {
            "mcpServers": {
              "claude_ai_Figma": {
                "command": "npx",
                "args": ["-y", "@figma/mcp-server"],
                "env": { "FIGMA_API_KEY": "${{ secrets.FIGMA_PAT }}" }
              }
            }
          }
          JSON

      - name: Run Claude with Figma MCP mounted
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Use mcp__claude_ai_Figma__get_metadata to fetch metadata for
            fileKey=${{ secrets.FIGMA_FILE_KEY }}, nodeId=267:355.
            Report the node's name and type.
            End with: PREFLIGHT-2-PASSED if metadata returned, PREFLIGHT-2-FAILED otherwise.
          claude_args: --max-turns 5 --mcp-config ${{ runner.temp }}/mcp-config.json
```

> Note: the exact MCP server package name (`@figma/mcp-server` vs `@claude/figma-mcp` vs other) depends on what the official Figma MCP ships as. If `npx -y <pkg>` fails, fall back to invoking the Figma REST API directly within the prompt. Verify the package name during Step 2.3.

- [ ] **Step 2.3: Trigger and observe**

Run workflow. Expected: step summary contains `PREFLIGHT-2-PASSED` plus the Button component set's name (something like "Button" or matching the design system).

**On failure paths:**
- Package not found → swap `mcp_config` to point at the correct npm package (search Figma's official MCP repo).
- MCP server crashes on cold start → try `npx -p <pkg> <command>` or pin a specific version.
- Slash commands aren't loaded → check whether the action auto-loads `.claude/commands/*.md`. If not, the prompt in production will need to inline the sync logic.

If MCP cannot be made to work in <2 hours, **document the fallback decision** in this plan: production workflow will use a prompt that calls the Figma REST API directly via Bash (since `_lib.mjs` already has `figmaFetch`). This is lower-fidelity (no screenshot, no design-context hints) but unblocks Phase 1.

- [ ] **Step 2.4: Commit**

```bash
git add .github/workflows/preflight-claude-action.yml
git commit -m "ci(preflight): verify figma mcp headless in runner"
```

### Task 3: Update `/sync-figma` to specify MDX preservation

**Files:**
- Modify: `.claude/commands/sync-figma.md`

The slash command currently doesn't explicitly say "preserve hand-written MDX sections." When run by a fresh CI invocation (no conversation history to anchor on), Claude may regenerate the entire MDX file and clobber the `Accessibility` and `Things to watch` sections that the docs author added by hand.

- [ ] **Step 3.1: Add MDX preservation rule to Step 5 of the slash command**

Open `.claude/commands/sync-figma.md`. Find Step 5 ("Apply edits — granular, one shot"), specifically the row for `apps/docs/src/pages/components/<Pascal>.mdx`.

Replace that row with:

```markdown
| `apps/docs/src/pages/components/<Pascal>.mdx` | Only if variants/sizes/props changed (rare in token-only sync). **PRESERVE hand-written sections.** Read the existing MDX first; only edit the auto-generated sections (`<PreviewCard>` props, `<PropsTable rows={...}>`, variant tables). Hand-written prose (`## Accessibility`, `## Things to watch`, intro paragraphs without `<PageHeader>` wrapper) MUST be kept verbatim. If unsure whether a section is auto or hand, leave it. |
```

- [ ] **Step 3.2: Add an explicit "What is auto-generated" subsection**

Below Step 5's table, add a new subsection:

````markdown
**MDX boundary rules:**

Auto-generated (you may regenerate from Figma):
- `<PageHeader>` block (title, description from Figma metadata)
- `<PreviewCard>` content showing variants × sizes
- `<PropsTable rows={...}>` (props derived from component .tsx)
- Variant matrices and code examples

Hand-written (NEVER touch unless user explicitly says "regenerate"):
- `## Accessibility` section
- `## Things to watch` section
- Any prose paragraph between sections that doesn't reference Figma-derived data
- `<StatusBadge>` annotations placed by the docs author

If the file already has hand-written sections and you're updating an auto-generated section, use `Edit` (string replace) — not `Write` (full overwrite).
````

- [ ] **Step 3.3: Verify the file still parses (no broken markdown)**

```bash
node -e "console.log(require('fs').readFileSync('.claude/commands/sync-figma.md','utf8').length)"
```

Expected: prints a number > previous size (we added content). No errors.

- [ ] **Step 3.4: Commit**

```bash
git add .claude/commands/sync-figma.md
git commit -m "docs(sync-figma): require MDX hand-section preservation"
```

### Phase −1 GO/NO-GO Gate

**Decision required from user before Phase 0.** Confirm in chat:

- [ ] Task 1 passed (claude-code-action invokes correctly).
- [ ] Task 2 passed (Figma MCP works headlessly) — OR — fallback to REST-only mode is acceptable.
- [ ] Task 3 committed.
- [ ] Plan section "Phase 1 prompt" (Task 11 below) updated to match whichever invocation surface won (MCP vs REST fallback).

If any task failed and the fallback isn't acceptable, **STOP** and re-spec the engine choice.

---

## Phase 0 — Bootstrap Wrap-up

Most of Phase 0 from the spec is already done (`.figma/` artifacts exist, `pnpm figma:*` scripts work). Remaining: hook up Vercel for `apps/docs` and verify preview deploys.

### Task 4: Connect Vercel to `apps/docs` for preview deploys

**Files:**
- Possibly create: `apps/docs/vercel.json` (only if root install doesn't auto-detect)

- [ ] **Step 4.1: USER ACTION — Create Vercel project for docs**

**[USER ACTION REQUIRED]** Vercel dashboard → Add New → Project → Import Git Repository → select `pod-native-design-system`.

Settings:
- **Root directory:** `apps/docs`
- **Build command:** `cd ../.. && pnpm install --frozen-lockfile && pnpm -F cf-tokens build && pnpm -F cf-ui build && pnpm -F docs build`
- **Output directory:** `dist`
- **Install command:** (leave default; root install handled in build command)
- **Framework preset:** Vite
- **Production branch:** `main`
- **Privacy:** Private (per spec §2)

Deploy. Confirm production URL works (lands on docs landing page).

Confirm in chat: "vercel docs project created, prod URL is <url>".

- [ ] **Step 4.2: Verify PR previews work**

**[USER ACTION REQUIRED]** Open a no-op PR (e.g. add a comment to `apps/docs/README.md` if it exists, or create a draft PR with just a whitespace tweak). Vercel bot should comment with a preview URL within 2-3 minutes.

Confirm in chat: "preview URL appeared on test PR".

If preview doesn't appear: check Vercel project settings → Git → "Comments" enabled, and "Preview deployment" enabled for all branches.

Close the no-op PR after verifying.

- [ ] **Step 4.3: Commit any vercel.json adjustments**

If Vercel needed a `vercel.json` config to make builds work:

```bash
git add apps/docs/vercel.json
git commit -m "chore(docs): vercel build config"
```

If no file changes were needed, skip this step.

### Task 5: Verify local build still passes (regression check)

- [ ] **Step 5.1: Clean install + full build**

```bash
pnpm install
pnpm -F cf-tokens build
pnpm -F cf-ui build
pnpm -F docs build
```

Expected: all three exit 0. `apps/docs/dist/` contains `index.html`.

- [ ] **Step 5.2: Run typecheck**

```bash
pnpm typecheck
```

Expected: exit 0.

If anything fails, fix before continuing — Phase 1's CI gates depend on this.

---

## Phase 1 — workflow_dispatch (Button only)

Build the orchestration workflow with manual trigger only. Validate end-to-end: human clicks "Run workflow" → Claude syncs Button → PR appears with preview deploy.

**Stop condition (per spec):** workflow runs successfully 3 times in a row for Button. If `pnpm typecheck` fails in >50% of runs, stop and re-evaluate engine choice.

### Task 6: Create skeleton workflow

**Files:**
- Create: `.github/workflows/figma-sync.yml`

- [ ] **Step 6.1: Write skeleton with `workflow_dispatch` only**

Path: `.github/workflows/figma-sync.yml`

```yaml
name: figma-sync
on:
  workflow_dispatch:
    inputs:
      slugs:
        description: "Comma-separated slugs to sync (default: auto-detect drift)"
        required: false
        default: ""

jobs:
  sync:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: pnpm/action-setup@v4
        with:
          version: 9.7.0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile

      - name: Identify which slugs to sync
        id: drift
        env:
          FIGMA_PAT: ${{ secrets.FIGMA_PAT }}
          FIGMA_FILE_KEY: ${{ secrets.FIGMA_FILE_KEY }}
        run: |
          # `.env.local` is what _lib.mjs expects. Synthesize from secrets.
          printf 'FIGMA_PAT=%s\nFIGMA_FILE_KEY=%s\n' "$FIGMA_PAT" "$FIGMA_FILE_KEY" > .env.local

          if [ -n "${{ inputs.slugs }}" ]; then
            echo "slugs=$(echo '${{ inputs.slugs }}' | tr ',' ' ')" >> "$GITHUB_OUTPUT"
            echo "source=manual-input" >> "$GITHUB_OUTPUT"
          else
            DRIFTED=$(node scripts/figma/check.mjs --slugs-only || true)
            DRIFTED_FLAT=$(echo "$DRIFTED" | tr '\n' ' ' | xargs)
            echo "slugs=$DRIFTED_FLAT" >> "$GITHUB_OUTPUT"
            echo "source=drift-detected" >> "$GITHUB_OUTPUT"
          fi

      - name: Exit early if nothing to do
        if: steps.drift.outputs.slugs == ''
        run: |
          echo "::notice::No drift detected and no manual slugs specified. Exiting clean."
          echo "NO_OP=true" >> "$GITHUB_ENV"

      - name: Show plan
        if: env.NO_OP != 'true'
        run: |
          echo "::notice::Will sync slugs: ${{ steps.drift.outputs.slugs }} (source: ${{ steps.drift.outputs.source }})"
```

- [ ] **Step 6.2: Trigger via UI; verify skeleton runs**

GitHub UI → Actions → figma-sync → Run workflow → main → leave slugs empty → Run.

Expected:
- Job succeeds (green).
- Step summary shows either "No drift detected" (if Button is in sync) or "Will sync slugs: button" (if drifted).

- [ ] **Step 6.3: Force a drift, verify detection**

Edit `.figma/snapshots.json` locally — change Button's `hash` field by one character (e.g. last char). Commit and push to a feature branch, then trigger workflow against that branch. Expected: "Will sync slugs: button".

Revert the snapshot change after verification:

```bash
git checkout -- .figma/snapshots.json
```

- [ ] **Step 6.4: Commit**

```bash
git add .github/workflows/figma-sync.yml
git commit -m "ci(figma-sync): skeleton workflow with drift detection"
```

### Task 7: Add Claude Code Action invocation per slug

**Files:**
- Modify: `.github/workflows/figma-sync.yml`

- [ ] **Step 7.1: Add sync step that loops over drifted slugs**

Append to `.github/workflows/figma-sync.yml`, after the "Show plan" step:

```yaml
      - name: Write MCP config to runner temp
        if: env.NO_OP != 'true' && steps.drift.outputs.slugs != ''
        run: |
          cat > "$RUNNER_TEMP/mcp-config.json" <<JSON
          {
            "mcpServers": {
              "claude_ai_Figma": {
                "command": "npx",
                "args": ["-y", "@figma/mcp-server"],
                "env": { "FIGMA_API_KEY": "${{ secrets.FIGMA_PAT }}" }
              }
            }
          }
          JSON

      - name: Run /sync-figma for drifted slugs
        if: env.NO_OP != 'true' && steps.drift.outputs.slugs != ''
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "/sync-figma ${{ steps.drift.outputs.slugs }}"
          claude_args: --max-turns 30 --mcp-config ${{ runner.temp }}/mcp-config.json
        continue-on-error: true
        id: claude-sync
```

> **Slash command pickup is empirical.** Claude CLI auto-loads `.claude/commands/*.md` from cwd, so when the action runs `claude` from the repo root, `/sync-figma` should resolve. Pre-flight Task 2 confirms this. **Fallback** if `/sync-figma` doesn't resolve: replace the `prompt:` value with `cat .claude/commands/sync-figma.md` content inlined, parameterized by `${{ steps.drift.outputs.slugs }}`.
>
> The slash command accepts space-separated slugs (per the command's Step 0), so pass all drifted slugs in one prompt rather than looping.

- [ ] **Step 7.2: Trigger workflow against a deliberately drifted state**

Locally:
```bash
# Tweak the snapshot to force drift
node -e "
  const fs=require('fs');
  const s=JSON.parse(fs.readFileSync('.figma/snapshots.json','utf8'));
  s.components.button.hash='deadbeef'+s.components.button.hash.slice(8);
  fs.writeFileSync('.figma/snapshots.json',JSON.stringify(s,null,2)+'\n');
"
git add .figma/snapshots.json
git commit -m "test: force drift for ci validation (will revert)"
git push origin HEAD
```

Trigger workflow. Watch Claude run in the action logs. Expected:
- Claude reads `.figma/manifest.json`, calls Figma MCP (or REST), edits files in `packages/`/`apps/docs/`, runs `node scripts/figma/bless.mjs button`.
- Workflow reaches end with `git status` showing changed files.

- [ ] **Step 7.3: Revert the test commit**

```bash
git revert HEAD --no-edit
git push origin HEAD
```

- [ ] **Step 7.4: Commit the workflow change**

```bash
git add .github/workflows/figma-sync.yml
git commit -m "ci(figma-sync): invoke claude-code-action with /sync-figma"
```

### Task 8: Add validation gates (typecheck + build) — non-fatal

**Files:**
- Modify: `.github/workflows/figma-sync.yml`

- [ ] **Step 8.1: Add validation steps after sync**

Append after the `Run /sync-figma` step:

```yaml
      - name: Rebuild affected packages
        if: env.NO_OP != 'true'
        continue-on-error: true
        id: rebuild
        run: |
          pnpm -F cf-tokens build
          pnpm -F cf-ui build

      - name: Typecheck
        if: env.NO_OP != 'true'
        continue-on-error: true
        id: typecheck
        run: pnpm typecheck

      - name: Build docs
        if: env.NO_OP != 'true'
        continue-on-error: true
        id: build
        run: pnpm -F docs build

      - name: Validation summary
        if: env.NO_OP != 'true'
        run: |
          echo "## Validation results" >> "$GITHUB_STEP_SUMMARY"
          echo "- Rebuild: ${{ steps.rebuild.outcome }}" >> "$GITHUB_STEP_SUMMARY"
          echo "- Typecheck: ${{ steps.typecheck.outcome }}" >> "$GITHUB_STEP_SUMMARY"
          echo "- Build: ${{ steps.build.outcome }}" >> "$GITHUB_STEP_SUMMARY"
          if [ "${{ steps.typecheck.outcome }}" != "success" ] || \
             [ "${{ steps.build.outcome }}" != "success" ]; then
            echo "VALIDATION_FAILED=true" >> "$GITHUB_ENV"
          fi
```

These steps use `continue-on-error: true` — per spec §5.1, validation failure should still produce a PR (with red checks) so the human can review.

- [ ] **Step 8.2: Commit**

```bash
git add .github/workflows/figma-sync.yml
git commit -m "ci(figma-sync): add typecheck/build validation gates"
```

### Task 9: Open PR via `peter-evans/create-pull-request`

**Files:**
- Modify: `.github/workflows/figma-sync.yml`

- [ ] **Step 9.1: Add PR creation step**

Append after "Validation summary":

```yaml
      - name: Check for changes
        if: env.NO_OP != 'true'
        id: changes
        run: |
          if [ -z "$(git status --porcelain)" ]; then
            echo "has_changes=false" >> "$GITHUB_OUTPUT"
            echo "::notice::Sync ran but produced no file changes. Skipping PR."
          else
            echo "has_changes=true" >> "$GITHUB_OUTPUT"
            git status --short
          fi

      - name: Open PR
        if: env.NO_OP != 'true' && steps.changes.outputs.has_changes == 'true'
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          branch: figma-sync/${{ github.run_id }}
          base: main
          title: "Figma sync: ${{ steps.drift.outputs.slugs }}"
          commit-message: |
            chore(figma-sync): apply Figma changes for ${{ steps.drift.outputs.slugs }}

            Triggered by: ${{ steps.drift.outputs.source }}
            Run: ${{ github.run_id }}
          body: |
            ## Figma sync — ${{ github.run_id }}

            **Triggered by:** ${{ steps.drift.outputs.source }}
            **Components synced:** ${{ steps.drift.outputs.slugs }}

            ### Validation
            - Rebuild: ${{ steps.rebuild.outcome }}
            - Typecheck: ${{ steps.typecheck.outcome }}
            - Build: ${{ steps.build.outcome }}

            ### Preview
            🔗 Vercel will comment with the preview URL when the build completes.

            ### How to merge
            1. Open the preview URL.
            2. Walk through the affected component pages.
            3. Confirm visual matches Figma.
            4. Merge.

            ---
            *If checks failed:* the diff still represents Claude's attempt.
            Either fix issues directly on this branch and push, or close the PR
            and run `/sync-figma <slug>` locally to investigate.
          labels: |
            figma-sync
            ${{ env.VALIDATION_FAILED == 'true' && 'figma-sync-broken' || '' }}
```

> The default `GITHUB_TOKEN` works for opening PRs from the same repo. Phase 3 will swap this for a dedicated GitHub App token (cleaner commit author + scoped permissions). For now, default token is fine.

- [ ] **Step 9.2: Force a drift again, run end-to-end**

```bash
node -e "
  const fs=require('fs');
  const s=JSON.parse(fs.readFileSync('.figma/snapshots.json','utf8'));
  s.components.button.hash='cafebabe'+s.components.button.hash.slice(8);
  fs.writeFileSync('.figma/snapshots.json',JSON.stringify(s,null,2)+'\n');
"
git add .figma/snapshots.json
git commit -m "test: force drift e2e (will revert)"
git push origin HEAD
```

Trigger workflow. Expected outcome (a few minutes later):
- A new PR with branch `figma-sync/<run_id>` exists.
- Vercel bot comments preview URL within 2-3 min.
- Validation summary visible in PR body.

Open the preview URL. Confirm Button page renders.

Close the test PR. Revert the snapshot tweak:
```bash
git revert HEAD --no-edit
git push origin HEAD
```

- [ ] **Step 9.3: Commit the workflow**

```bash
git add .github/workflows/figma-sync.yml
git commit -m "ci(figma-sync): open PR with validation summary and preview"
```

### Task 10: Stop-condition validation — 3 successful runs

- [ ] **Step 10.1: Run 1 — manual drift on snapshot**

Force drift via snapshot tweak (as in Task 9.2). Trigger. Expected: PR opens, builds green, preview works. Close + revert.

- [ ] **Step 10.2: Run 2 — actual Figma change (designer-driven)**

**[USER ACTION REQUIRED]** Designer (or you, in Figma) makes a real change to Button — e.g. change one variant's corner radius from 8 to 10. Do not hand-edit the snapshot; let `check.mjs` detect natural drift.

Trigger workflow with empty slugs. Expected: workflow detects Button drifted, syncs, opens PR.

Verify:
- The committed code matches the Figma change (not random hallucination).
- `pnpm figma:check` would report in-sync after the PR's commits.

If the committed code is wrong (e.g. Claude broke a sacred token, or wired things to the wrong variant): close PR, document what went wrong in `docs/superpowers/specs/2026-04-29-figma-native-sync-design.md` "Risks Summary" section, and fix the slash command before retrying.

- [ ] **Step 10.3: Run 3 — no-op verification**

Trigger workflow with empty slugs while no drift exists. Expected: "No drift detected. Exiting clean." — no PR opened.

- [ ] **Step 10.4: Decision gate**

If 2 of 3 runs failed (Claude hallucinated, MDX clobbered hand sections, sacred tokens edited, etc.): **STOP**. Roll back to local-only `/sync-figma` and re-evaluate. Possible mitigations:
- Tighten slash command rules.
- Add CI guardrails earlier (originally Phase 5).
- Switch from autonomous PR creation to "draft PR + comment review request" model.

If 2 of 3 succeeded: continue to Phase 2.

---

## Phase 2 — Nightly Cron + Concurrency

Now that manual trigger works, add cron so drift gets caught even if a designer forgets to hit a (future) "publish" button.

### Task 11: Add cron schedule and concurrency group

**Files:**
- Modify: `.github/workflows/figma-sync.yml`

- [ ] **Step 11.1: Add `schedule` trigger**

Edit the `on:` block at the top of `.github/workflows/figma-sync.yml`:

```yaml
on:
  workflow_dispatch:
    inputs:
      slugs:
        description: "Comma-separated slugs to sync (default: auto-detect drift)"
        required: false
        default: ""
  schedule:
    # 02:00 UTC daily — quiet hours regardless of timezone
    - cron: '0 2 * * *'
```

- [ ] **Step 11.2: Add concurrency group**

After the `on:` block, before `jobs:`:

```yaml
concurrency:
  group: figma-sync
  cancel-in-progress: false
```

This ensures back-to-back triggers (cron + manual, or webhook + cron) queue rather than race on the snapshot file.

- [ ] **Step 11.3: Commit**

```bash
git add .github/workflows/figma-sync.yml
git commit -m "ci(figma-sync): nightly cron + concurrency group"
```

### Task 12: Observe 5 nights

**Stop condition (per spec):** 5 consecutive nightly runs, 0 false positives, 0 false negatives.

- [ ] **Step 12.1: Set a calendar reminder**

**[USER ACTION REQUIRED]** Set a reminder for 5 days from now. Each morning, check Actions tab → figma-sync runs.

Track in a chat scratchpad:
- Day 1: ran at 02:00 UTC, exit code 0, no PR (no drift) — ✓
- Day 2: ran, exit 0, no PR — ✓
- ...

If a run errors out (e.g. Anthropic 429, Figma API down), record it. >1 transient error in 5 days = re-evaluate timeout/retry logic.

If a run opens a PR for an actual designer change: that's a feature, not a false positive. Note it.

False positive = PR opened when nothing changed in Figma. False negative = Figma changed but cron didn't catch.

- [ ] **Step 12.2: Decision gate**

After 5 nights:
- 0 false positives + 0 false negatives → continue to Phase 3.
- 1+ false positive → debug `check.mjs` hashing (likely a non-deterministic Figma response field). Add the field to `VOLATILE_KEYS` in `_lib.mjs`.
- 1+ false negative → check Pro-tier limitation in `.figma/README.md` (variable-value-only changes aren't caught by structure hash). Decide: live with the limitation, or upgrade Figma to Enterprise.

---

## Phase 3 — Webhook Receiver (Realtime <5min)

Build a separate Vercel project hosting one HTTP function that receives Figma's `LIBRARY_PUBLISH` webhook, verifies HMAC, and fires `repository_dispatch` to GitHub. The existing `figma-sync` workflow gets a new trigger.

**Pre-req:** Figma plan supports webhooks v2 (Pro+). Verify before starting.

### Task 13: Verify Figma plan supports webhooks v2

- [ ] **Step 13.1: Check Figma plan**

**[USER ACTION REQUIRED]** Open https://www.figma.com/pricing/ in a browser. Confirm the workspace's plan is Pro or higher (Webhooks v2 listed under "Professional" and above).

Confirm in chat: "figma plan: <Pro|Organization|Enterprise>".

If Free or Starter: **STOP Phase 3**. Cron-only is the final state until upgrade. Phases 0-2 remain valuable.

### Task 14: Create dedicated GitHub App for the bot identity

The default `GITHUB_TOKEN` in Phase 1/2 commits as `github-actions[bot]`. For a cleaner audit trail and scoped permissions, Phase 3 introduces a dedicated GitHub App.

- [ ] **Step 14.1: USER ACTION — Create the GitHub App**

**[USER ACTION REQUIRED]** Personal account → Settings → Developer settings → GitHub Apps → New GitHub App.

- **Name:** `pod-figma-sync` (or similar; must be globally unique)
- **Homepage URL:** repo URL
- **Webhook:** Inactive (we don't receive webhooks ON the App; the app only acts as identity)
- **Repository permissions:**
  - Contents: Read & write (to push branches)
  - Pull requests: Read & write (to open PRs)
  - Metadata: Read
- **Where can it be installed:** Only on this account
- **Subscribe to events:** none

Click "Create GitHub App". Note the App ID.

- [ ] **Step 14.2: USER ACTION — Generate private key**

On the App's page → Private keys → Generate a private key. Save the `.pem` file securely.

- [ ] **Step 14.3: USER ACTION — Install the App on the repo**

App page → Install App → install on the org/account that owns `pod-native-design-system` → select "Only select repositories" → choose `pod-native-design-system`.

Note the Installation ID (visible in the URL after install: `.../installations/<INSTALLATION_ID>`).

- [ ] **Step 14.4: USER ACTION — Add App credentials to repo secrets**

Repo → Settings → Secrets:
- `BOT_GITHUB_APP_ID` = App ID from Step 14.1
- `BOT_GITHUB_APP_PRIVATE_KEY` = full contents of the `.pem` file
- `BOT_GITHUB_APP_INSTALLATION_ID` = Installation ID from Step 14.3

Confirm in chat: "github app secrets added".

- [ ] **Step 14.5: Swap workflow to use App token**

Edit `.github/workflows/figma-sync.yml`. Find the `peter-evans/create-pull-request` step. Add a token-generation step before it, and update the PR step to use the generated token:

```yaml
      - name: Generate App token
        if: env.NO_OP != 'true' && steps.changes.outputs.has_changes == 'true'
        id: app-token
        uses: actions/create-github-app-token@v1
        with:
          app-id: ${{ secrets.BOT_GITHUB_APP_ID }}
          private-key: ${{ secrets.BOT_GITHUB_APP_PRIVATE_KEY }}

      - name: Open PR
        if: env.NO_OP != 'true' && steps.changes.outputs.has_changes == 'true'
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ steps.app-token.outputs.token }}
          # ... rest unchanged
```

Replace the existing `token: ${{ secrets.GITHUB_TOKEN }}` line with `token: ${{ steps.app-token.outputs.token }}`.

- [ ] **Step 14.6: Test the App token end-to-end**

Force drift, trigger workflow. Expected: PR opens, commit author is `pod-figma-sync[bot]` (not `github-actions[bot]`).

- [ ] **Step 14.7: Commit**

```bash
git add .github/workflows/figma-sync.yml
git commit -m "ci(figma-sync): use dedicated github app for PR identity"
```

### Task 15: Scaffold the webhook receiver

**Files:**
- Create: `apps/webhook-receiver/package.json`
- Create: `apps/webhook-receiver/vercel.json`
- Create: `apps/webhook-receiver/api/figma-webhook.ts`
- Create: `apps/webhook-receiver/api/figma-webhook.test.ts`
- Create: `apps/webhook-receiver/tsconfig.json`
- Create: `apps/webhook-receiver/.gitignore`

- [ ] **Step 15.1: Create directory + package.json**

```bash
mkdir -p apps/webhook-receiver/api
```

Create `apps/webhook-receiver/package.json`:

```json
{
  "name": "figma-webhook-receiver",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test --experimental-strip-types api/figma-webhook.test.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@octokit/auth-app": "^7.1.1",
    "@octokit/rest": "^21.0.2"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "typescript": "^5.5.3"
  },
  "engines": {
    "node": ">=20.6"
  }
}
```

- [ ] **Step 15.2: Create vercel.json**

`apps/webhook-receiver/vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "functions": {
    "api/figma-webhook.ts": {
      "memory": 256,
      "maxDuration": 10
    }
  }
}
```

- [ ] **Step 15.3: Create tsconfig.json**

`apps/webhook-receiver/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["api/**/*.ts"]
}
```

- [ ] **Step 15.4: Create .gitignore**

`apps/webhook-receiver/.gitignore`:

```
node_modules/
.vercel/
.env
.env.local
```

- [ ] **Step 15.5: Install deps**

```bash
cd apps/webhook-receiver && pnpm install
```

Commit lockfile updates.

- [ ] **Step 15.6: Commit scaffolding**

```bash
git add apps/webhook-receiver/
git add pnpm-lock.yaml
git commit -m "feat(webhook-receiver): scaffold separate vercel project"
```

### Task 16: Implement HMAC verification (TDD)

**Files:**
- Create: `apps/webhook-receiver/api/figma-webhook.test.ts`
- Create: `apps/webhook-receiver/api/figma-webhook.ts`

Per Figma's webhook v2 docs, the body is signed with HMAC-SHA256 using a shared secret. Header is `X-Figma-Signature` containing the hex digest.

- [ ] **Step 16.1: Write the failing test for HMAC verification**

Create `apps/webhook-receiver/api/figma-webhook.test.ts`:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { verifyFigmaSignature } from './figma-webhook.ts';

describe('verifyFigmaSignature', () => {
  const secret = 'test-secret';
  const body = '{"event_type":"LIBRARY_PUBLISH","file_key":"abc"}';
  const validSig = createHmac('sha256', secret).update(body).digest('hex');

  it('returns true for a valid signature', () => {
    assert.equal(verifyFigmaSignature(body, validSig, secret), true);
  });

  it('returns false for a tampered body', () => {
    const tampered = body.replace('abc', 'xyz');
    assert.equal(verifyFigmaSignature(tampered, validSig, secret), false);
  });

  it('returns false for an empty signature', () => {
    assert.equal(verifyFigmaSignature(body, '', secret), false);
  });

  it('returns false for an obviously wrong signature', () => {
    assert.equal(verifyFigmaSignature(body, 'cafebabe', secret), false);
  });

  it('uses constant-time comparison (does not throw on length mismatch)', () => {
    // Should not throw even if sig length doesn't match expected
    assert.doesNotThrow(() => verifyFigmaSignature(body, 'short', secret));
  });
});
```

- [ ] **Step 16.2: Run the test, verify it fails**

```bash
cd apps/webhook-receiver && pnpm test
```

Expected: FAIL with "Cannot find module './figma-webhook.ts'" or similar.

- [ ] **Step 16.3: Implement `verifyFigmaSignature`**

Create `apps/webhook-receiver/api/figma-webhook.ts`:

```typescript
import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyFigmaSignature(body: string, signature: string, secret: string): boolean {
  if (!signature) return false;
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  // timingSafeEqual requires equal lengths; pad/truncate by length-checking first.
  if (expected.length !== signature.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}
```

- [ ] **Step 16.4: Run test, verify pass**

```bash
pnpm test
```

Expected: 5 tests pass.

- [ ] **Step 16.5: Commit**

```bash
git add apps/webhook-receiver/api/figma-webhook.ts apps/webhook-receiver/api/figma-webhook.test.ts
git commit -m "feat(webhook-receiver): hmac signature verification"
```

### Task 17: Implement GitHub repository_dispatch (TDD)

**Files:**
- Modify: `apps/webhook-receiver/api/figma-webhook.test.ts`
- Modify: `apps/webhook-receiver/api/figma-webhook.ts`

- [ ] **Step 17.1: Write failing test for the dispatcher**

Append to `apps/webhook-receiver/api/figma-webhook.test.ts`:

```typescript
import { dispatchFigmaSync } from './figma-webhook.ts';

describe('dispatchFigmaSync', () => {
  it('POSTs to the correct GitHub dispatches endpoint with the right payload', async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const mockFetch = (async (url: string | URL, init?: RequestInit) => {
      calls.push({ url: String(url), init: init ?? {} });
      return new Response('', { status: 204 });
    }) as typeof fetch;

    await dispatchFigmaSync({
      repo: 'owner/repo',
      installationToken: 'ghs_xxx',
      fileKey: 'TCd9...',
      fetchImpl: mockFetch,
    });

    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.github.com/repos/owner/repo/dispatches');
    assert.equal(calls[0].init.method, 'POST');
    const body = JSON.parse(calls[0].init.body as string);
    assert.equal(body.event_type, 'figma-library-published');
    assert.equal(body.client_payload.fileKey, 'TCd9...');
    const headers = new Headers(calls[0].init.headers);
    assert.equal(headers.get('authorization'), 'Bearer ghs_xxx');
    assert.equal(headers.get('accept'), 'application/vnd.github+json');
  });

  it('throws if GitHub returns non-2xx', async () => {
    const mockFetch = (async () =>
      new Response('boom', { status: 500 })) as typeof fetch;
    await assert.rejects(
      () =>
        dispatchFigmaSync({
          repo: 'owner/repo',
          installationToken: 'ghs_xxx',
          fileKey: 'abc',
          fetchImpl: mockFetch,
        }),
      /500/,
    );
  });
});
```

- [ ] **Step 17.2: Run, verify fail**

```bash
pnpm test
```

Expected: FAIL with "dispatchFigmaSync is not a function" or import error.

- [ ] **Step 17.3: Implement `dispatchFigmaSync`**

Append to `apps/webhook-receiver/api/figma-webhook.ts`:

```typescript
export interface DispatchOpts {
  repo: string; // "owner/repo"
  installationToken: string;
  fileKey: string;
  fetchImpl?: typeof fetch;
}

export async function dispatchFigmaSync(opts: DispatchOpts): Promise<void> {
  const f = opts.fetchImpl ?? fetch;
  const res = await f(`https://api.github.com/repos/${opts.repo}/dispatches`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${opts.installationToken}`,
      accept: 'application/vnd.github+json',
      'content-type': 'application/json',
      'x-github-api-version': '2022-11-28',
    },
    body: JSON.stringify({
      event_type: 'figma-library-published',
      client_payload: { fileKey: opts.fileKey },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub dispatches API ${res.status}: ${text}`);
  }
}
```

- [ ] **Step 17.4: Run, verify pass**

```bash
pnpm test
```

Expected: 7 tests pass.

- [ ] **Step 17.5: Commit**

```bash
git add apps/webhook-receiver/api/figma-webhook.ts apps/webhook-receiver/api/figma-webhook.test.ts
git commit -m "feat(webhook-receiver): github repository_dispatch helper"
```

### Task 18: Implement the HTTP handler

**Files:**
- Modify: `apps/webhook-receiver/api/figma-webhook.ts`

- [ ] **Step 18.1: Add the Vercel HTTP handler**

Append to `apps/webhook-receiver/api/figma-webhook.ts`:

```typescript
import { createAppAuth } from '@octokit/auth-app';

interface FigmaWebhookBody {
  event_type?: string;
  file_key?: string;
}

async function getInstallationToken(): Promise<string> {
  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    installationId: Number(process.env.GITHUB_INSTALLATION_ID!),
  });
  const { token } = await auth({ type: 'installation' });
  return token;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('method not allowed', { status: 405 });
  }
  const body = await req.text();
  const sig = req.headers.get('x-figma-signature') ?? '';

  if (!verifyFigmaSignature(body, sig, process.env.FIGMA_WEBHOOK_SECRET!)) {
    return new Response('invalid signature', { status: 401 });
  }

  let parsed: FigmaWebhookBody;
  try {
    parsed = JSON.parse(body);
  } catch {
    return new Response('invalid json', { status: 400 });
  }

  if (parsed.event_type !== 'LIBRARY_PUBLISH') {
    return new Response('ignored event_type', { status: 202 });
  }
  if (!parsed.file_key) {
    return new Response('missing file_key', { status: 400 });
  }

  try {
    const token = await getInstallationToken();
    await dispatchFigmaSync({
      repo: process.env.GITHUB_REPO!,
      installationToken: token,
      fileKey: parsed.file_key,
    });
    return new Response('dispatched', { status: 202 });
  } catch (err) {
    console.error('dispatch failure', err);
    return new Response('dispatch failed', { status: 502 });
  }
}
```

- [ ] **Step 18.2: Typecheck**

```bash
cd apps/webhook-receiver && pnpm typecheck
```

Expected: exit 0.

- [ ] **Step 18.3: Re-run unit tests**

```bash
pnpm test
```

Expected: 7 tests still pass (the handler isn't directly tested at this level — it's verified end-to-end in Task 21).

- [ ] **Step 18.4: Commit**

```bash
git add apps/webhook-receiver/api/figma-webhook.ts
git commit -m "feat(webhook-receiver): http handler with hmac + dispatch"
```

### Task 19: Deploy webhook receiver to Vercel

- [ ] **Step 19.1: USER ACTION — Create separate Vercel project**

**[USER ACTION REQUIRED]** Vercel dashboard → Add New → Project → Import Git Repository → select `pod-native-design-system`.

Settings:
- **Project name:** `pod-figma-webhook-receiver` (must differ from the docs project)
- **Root directory:** `apps/webhook-receiver`
- **Framework preset:** Other
- **Build command:** (leave empty — Vercel auto-detects functions in `api/`)
- **Output directory:** (leave default)
- **Production branch:** `main`
- **Privacy:** Private

Deploy. Note the production URL (`https://pod-figma-webhook-receiver.vercel.app/api/figma-webhook` or similar).

Confirm in chat: "webhook receiver deployed at <url>".

- [ ] **Step 19.2: USER ACTION — Set Vercel env vars**

Vercel project → Settings → Environment Variables → add for **Production**:
- `FIGMA_WEBHOOK_SECRET` = generate with `openssl rand -hex 32` and save the value
- `GITHUB_APP_ID` = same as repo secret `BOT_GITHUB_APP_ID`
- `GITHUB_APP_PRIVATE_KEY` = same as repo secret `BOT_GITHUB_APP_PRIVATE_KEY` (paste the whole `.pem`)
- `GITHUB_INSTALLATION_ID` = same as repo secret `BOT_GITHUB_APP_INSTALLATION_ID`
- `GITHUB_REPO` = `<owner>/pod-native-design-system`

Redeploy to pick up env vars.

Confirm in chat: "webhook env vars set, redeployed".

- [ ] **Step 19.3: Smoke test the endpoint**

From local terminal, hit the deployed endpoint with an obviously-wrong signature:

```bash
curl -i -X POST \
  -H 'X-Figma-Signature: deadbeef' \
  -H 'Content-Type: application/json' \
  -d '{"event_type":"LIBRARY_PUBLISH","file_key":"abc"}' \
  https://<your-vercel-url>/api/figma-webhook
```

Expected: `HTTP 401 invalid signature`. (If it returns 500, the function failed to start — check Vercel logs for missing env vars or build errors.)

### Task 20: Configure Figma to send webhooks

- [ ] **Step 20.1: USER ACTION — Register the webhook**

**[USER ACTION REQUIRED]** Figma webhooks v2 are configured via REST. Run from local terminal:

```bash
TEAM_ID=<your-figma-team-id>   # find via Figma URL: figma.com/team/<TEAM_ID>/...
FIGMA_PAT=<your-figma-pat>     # same as in .env.local
WEBHOOK_URL=https://<your-vercel-url>/api/figma-webhook
WEBHOOK_SECRET=<the-secret-set-in-19.2>

curl -X POST 'https://api.figma.com/v2/webhooks' \
  -H "X-Figma-Token: $FIGMA_PAT" \
  -H 'Content-Type: application/json' \
  -d "{
    \"event_type\": \"LIBRARY_PUBLISH\",
    \"team_id\": \"$TEAM_ID\",
    \"endpoint\": \"$WEBHOOK_URL\",
    \"passcode\": \"$WEBHOOK_SECRET\",
    \"description\": \"pod-native-design-system auto-sync\"
  }"
```

Expected: 200 with the new webhook's `id`. Save it (`FIGMA_WEBHOOK_ID`).

> Figma calls the secret `passcode`. It is the same value our receiver uses as the HMAC key.

- [ ] **Step 20.2: USER ACTION — Trigger a real publish**

In Figma: open the design system file → make a tiny change to Button → publish library (top-right "Publish library" button).

Within ~30 seconds:
1. Vercel logs for `pod-figma-webhook-receiver` show a 202 response.
2. GitHub Actions tab shows a new `figma-sync` run triggered by `repository_dispatch`.

Confirm in chat: "figma webhook fired, action triggered".

If nothing happens after 2 minutes:
- Check Figma webhook delivery: `curl 'https://api.figma.com/v2/webhooks/<FIGMA_WEBHOOK_ID>/requests' -H "X-Figma-Token: $FIGMA_PAT"` — look for failed deliveries with reason.
- Check Vercel function logs.
- Check GitHub Action logs (the dispatch may have arrived but the workflow's trigger condition didn't match).

### Task 21: Add `repository_dispatch` trigger to the workflow

**Files:**
- Modify: `.github/workflows/figma-sync.yml`

- [ ] **Step 21.1: Add trigger**

Edit `on:` block in `.github/workflows/figma-sync.yml`. Add `repository_dispatch`:

```yaml
on:
  workflow_dispatch:
    inputs:
      slugs:
        description: "Comma-separated slugs to sync (default: auto-detect drift)"
        required: false
        default: ""
  schedule:
    - cron: '0 2 * * *'
  repository_dispatch:
    types:
      - figma-library-published
```

- [ ] **Step 21.2: Update the "drift source" labeling**

Find the "Identify which slugs to sync" step. Update the conditional so a `repository_dispatch` event also runs auto-detect (no manual slug input). The existing logic (`if [ -n "${{ inputs.slugs }}" ]`) already handles this correctly because `inputs.slugs` is empty for non-`workflow_dispatch` events. Just update the `source` label for clarity:

```bash
          if [ -n "${{ inputs.slugs }}" ]; then
            echo "slugs=$(echo '${{ inputs.slugs }}' | tr ',' ' ')" >> "$GITHUB_OUTPUT"
            echo "source=manual-input" >> "$GITHUB_OUTPUT"
          else
            DRIFTED=$(node scripts/figma/check.mjs --slugs-only || true)
            DRIFTED_FLAT=$(echo "$DRIFTED" | tr '\n' ' ' | xargs)
            echo "slugs=$DRIFTED_FLAT" >> "$GITHUB_OUTPUT"
            case "${{ github.event_name }}" in
              repository_dispatch) echo "source=figma-webhook" >> "$GITHUB_OUTPUT" ;;
              schedule)            echo "source=nightly-cron" >> "$GITHUB_OUTPUT" ;;
              *)                   echo "source=drift-detected" >> "$GITHUB_OUTPUT" ;;
            esac
          fi
```

- [ ] **Step 21.3: Commit**

```bash
git add .github/workflows/figma-sync.yml
git commit -m "ci(figma-sync): accept repository_dispatch from webhook receiver"
```

- [ ] **Step 21.4: End-to-end test the full path**

**[USER ACTION REQUIRED]** In Figma, make a real change to Button (e.g. tweak corner radius). Publish library.

Stopwatch start. Expected within 5 minutes:
1. Webhook receiver logs: 202 dispatched.
2. GitHub Actions: figma-sync run triggered with `event_name=repository_dispatch`.
3. Workflow: detects drift, syncs Button, opens PR.
4. Vercel: comments preview URL on PR.

Open preview URL → verify Button visually matches the Figma change.

If under 5 min and visual matches: ✅ Phase 3 complete.

### Task 22: Run 3 webhook → PR cycles for confidence

- [ ] **Step 22.1: Make 3 small changes in Figma over ~24 hours, observe each cycle**

**[USER ACTION REQUIRED]** Pick 3 trivial changes (e.g. change Button shadow opacity, change border-radius, change text size). Publish each separately. Verify each opens a working PR.

Track latency in chat:
- Cycle 1: <X> minutes from publish to PR open.
- Cycle 2: <Y> minutes.
- Cycle 3: <Z> minutes.

Median should be <5 min. If consistently >5 min, investigate Vercel cold starts or GitHub Action queue depth.

- [ ] **Step 22.2: Decision gate**

If 2+ of 3 cycles succeed within target latency: Phase 3 complete. Proceed to cleanup.

If <2 succeed: re-evaluate. Phases 0–2 remain shipped (cron-only fallback). File issues and revisit Phase 3 when blockers are clearer.

---

## Cleanup

### Task 23: Remove preflight workflow

**Files:**
- Delete: `.github/workflows/preflight-claude-action.yml`

- [ ] **Step 23.1: Delete the file**

```bash
rm .github/workflows/preflight-claude-action.yml
```

- [ ] **Step 23.2: Commit**

```bash
git add -u .github/workflows/
git commit -m "chore: remove preflight workflow now that figma-sync is live"
```

### Task 24: Update `.figma/README.md` to point at the live workflow

**Files:**
- Modify: `.figma/README.md`

- [ ] **Step 24.1: Replace the "Phase 3 — not yet wired" section**

Open `.figma/README.md`. Find the section `## CI integration (Phase 3 — not yet wired)`.

Replace it with:

```markdown
## CI integration (live)

Drift is detected and synced by `.github/workflows/figma-sync.yml`. Triggers:

- **Webhook (realtime):** Figma `LIBRARY_PUBLISH` → Vercel function (`apps/webhook-receiver/`) → `repository_dispatch` → workflow runs.
- **Cron (nightly safety net):** 02:00 UTC every day.
- **Manual:** Actions tab → figma-sync → Run workflow.

Each run produces a PR on branch `figma-sync/<run_id>` with a Vercel preview deploy. The PR's commit author is `pod-figma-sync[bot]` (dedicated GitHub App).

To investigate why a sync produced unexpected output, run `/sync-figma <slug>` locally — same engine, same prompt, full conversation visibility.
```

- [ ] **Step 24.2: Commit**

```bash
git add .figma/README.md
git commit -m "docs(figma): document live CI sync pipeline"
```

---

## Self-Review Checklist (run before declaring plan complete)

- [ ] Pre-flight blockers (claude-code-action + Figma MCP) get verified BEFORE production code is written.
- [ ] Existing scripts (`check.mjs`, `bless.mjs`) are reused, not duplicated.
- [ ] Every USER ACTION is explicitly labeled `[USER ACTION REQUIRED]` with concrete instructions.
- [ ] Webhook receiver has unit tests (HMAC, dispatcher).
- [ ] Stop-conditions are explicit at each phase boundary (Tasks 10, 12, 22).
- [ ] All committed code is reachable from the workflow (no orphan files).
- [ ] No new TS files duplicating existing `.mjs` script functionality.
- [ ] Sacred token rules from `CLAUDE.md` are not violated by any task.

---

## Risks & Mitigations (carry from spec)

- **LLM output variability in CI** → Phase 1 stop condition (3 successful runs) catches this early. If consistent failures: tighten slash command or fall back to local-only.
- **Anthropic cost overrun** → snapshot-based diff prevents redundant runs. Cron only fires when drift exists.
- **Figma MCP headless instability** → pre-flight Task 2; fallback to REST-only is documented.
- **Webhook reliability** → cron is the safety net.
- **Sacred token clobber** → existing slash command has explicit rules (CLAUDE.md "SACRED TOKENS"). Risk increases when running headless without conversation context. Mitigation: hand-review every PR until at least 10 cycles succeed cleanly. Consider adding a CI guardrail script in a follow-up plan that diffs sacred tokens and fails the build if any changed.
