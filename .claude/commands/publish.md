---
description: Publish pod-test-tokens + pod-test-ui to npm. Verify in-sync, build, bump, publish, tag. Sat-set with one safety pause.
---

# /publish

**Argument:** `$ARGUMENTS` — version bump: `patch` (default) · `minor` · `major` · or exact `0.1.0`.

## Mindset

Publish is **irreversible after 72 hours** (npm policy). One pause before
actual `npm publish` — show the user what's about to ship, get a yes/no.
Everything else: execute autonomously.

## Pre-flight (FAIL fast — don't auto-fix)

Run these checks. Any failure → stop, report which one, do NOT attempt to fix.

1. **Git tree clean**: `git status --porcelain` returns empty.
2. **All Figma drift in sync**: `node scripts/figma/check.mjs` exits 0.
   If drift exists, user must `/sync-figma <slug>` first or revert their edits.
3. **Branch acknowledged**: print current branch (`git rev-parse --abbrev-ref HEAD`).
   This project publishes from `testing` (or `main`) — don't enforce, just surface.
   If branch is something else (feature branch, etc.), warn but continue.
4. **Logged into npm**: `npm whoami` succeeds. If not, instruct user to run
   `npm login` and stop.
5. **No version conflict**: target version > current version in both
   `packages/tokens/package.json` and `packages/ui/package.json`.
6. **Latest npm version check**: `npm view pod-test-ui version` and
   `npm view pod-test-tokens version`. Target must be > both. If somebody else
   already published a higher version, stop and tell user.

## Steps

### 1. Determine version

- If `$ARGUMENTS` matches `\d+\.\d+\.\d+` → use as exact version.
- Else if `patch` → bump last segment.
- Else if `minor` → bump middle, reset last to 0.
- Else if `major` → bump first, reset rest to 0.
- Both packages bump in **lockstep** — same version always.

### 2. Typecheck

```bash
node_modules/.bin/tsc --noEmit -p packages/ui/tsconfig.json
node_modules/.bin/tsc --noEmit -p apps/docs/tsconfig.json
```

(`packages/tokens` typically has no .tsx so tsup --dts handles it during build.)

If typecheck fails → stop, surface errors. Don't publish broken code.

### 3. Build packages (tokens first — ui depends on it)

```bash
cd packages/tokens && ../../node_modules/.bin/tsup src/index.ts src/tailwind-preset.ts --format cjs,esm --dts --clean
cd packages/ui && ../../node_modules/.bin/tsup
```

### 4. Bump versions in package.json files

Edit:
- `packages/tokens/package.json` → `version`
- `packages/ui/package.json` → `version` AND `dependencies["pod-test-tokens"]` (lockstep)
- Root `package.json` `version` if it tracks releases (currently `0.0.1`, ok to bump).

### 5. PAUSE — show diff and ask for confirmation

Print exactly this format:

```
═══════════════════════════════════════════════════
  About to publish to npm:

    pod-test-tokens   <old>  →  <new>
    pod-test-ui       <old>  →  <new>

  Files included (from package.json "files"):
    pod-test-tokens: dist/, src/theme.css
    pod-test-ui:     dist/

  Total package size: <X kB> (estimated via npm pack --dry-run)

  Reply "confirm" to publish.
  Reply "abort" or anything else to revert version bump.
═══════════════════════════════════════════════════
```

**Wait for user reply.** Do not run `npm publish` until user types `confirm`.

If user aborts → revert version bumps via `git checkout -- package.json` in
all touched paths. Report aborted.

### 6. Publish (only after confirm)

```bash
cd packages/tokens && npm publish --access public
cd packages/ui && npm publish --access public
```

If either fails → stop. Don't try to "fix" mid-publish (e.g. don't unpublish
the first if second fails). Report exact error, let user resolve.

### 7. Git tag + commit (LOCAL ONLY — do NOT push)

```bash
git add packages/tokens/package.json packages/ui/package.json package.json \
        centernode/package.json centernode/package-lock.json \
        client-test/package.json client-test/package-lock.json
git commit -m "release: pod-test-{ui,tokens}@<new>"
git tag v<new>
```

**Never** `git push` automatically. User pushes manually. (Note: step 8
runs BEFORE step 7's git add — bump consumers first, then stage all
together.)

### 8. Bump in-repo consumers (centernode + client-test)

Both centernode and client-test consume the packages via npm versions
(NOT file: link — see CLAUDE.md "Local dev caveat"). They need a manual
bump after every publish so Vercel deploys + local dev pick up the new
version.

```bash
# Update centernode/package.json
#   "pod-test-tokens": "^<new>"
#   "pod-test-ui":     "^<new>"
cd centernode && npm install --legacy-peer-deps --no-fund --no-audit && cd ..

# Update client-test/package.json (same pattern)
cd client-test && npm install --legacy-peer-deps --no-fund --no-audit && cd ..
```

Add both `package.json` + `package-lock.json` files to the release commit
(extend step 7's `git add`).

If you skip this: local centernode still runs the OLD version, and Vercel
deployments for centernode + client-test stay frozen on the old version
until somebody manually bumps later.

### 9. Report — six lines max

```
✓ Published
  pod-test-tokens@<new>  (was <old>)
  pod-test-ui@<new>      (was <old>)
  centernode + client-test bumped to ^<new>

Git: commit + tag v<new> created locally. NOT pushed.

Next:
  git push --follow-tags     ← triggers Vercel auto-deploy for both apps
```

## Forbidden behaviors

- ❌ Skipping the pre-flight (drift, dirty tree, wrong branch).
- ❌ Auto-pushing to remote (always local-only commit + tag).
- ❌ Running `npm unpublish` for ANY reason. Tell user to publish a new version with the fix.
- ❌ Publishing without the confirmation pause. The pause is non-negotiable.
- ❌ Bumping versions out of lockstep (tokens and ui must always match).
- ❌ Using `npm publish --tag latest` flag — npm defaults to `latest`, no need.
- ❌ Bumping when a higher version exists on npm registry already (use `npm view <pkg> version` to check).

## When to pause and ask the user

- Any pre-flight check failed.
- The mandatory step 5 confirmation.
- Build or typecheck error.
- `npm whoami` shows a user that doesn't own the package.
