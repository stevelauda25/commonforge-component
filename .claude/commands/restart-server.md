---
description: Kill dev servers (docs, centernode), clear caches, restart in background. Use when UI doesn't reflect file changes after sync/edits.
---

# /restart-server

Sat-set restart of POD repo dev servers. Common reason to run:
- Docs page didn't update after `/sync-figma`.
- Centernode canvas doesn't reflect a fresh `tsup` rebuild.
- Vite or Turbopack reports stale module / HMR confusion.

## Argument

- `/restart-server`         → restart **docs only** (most common case)
- `/restart-server docs`    → same as above
- `/restart-server centernode` → restart **centernode only**
- `/restart-server all`     → restart **both** docs and centernode

If user types `/restart-server` alone (no arg), default to `docs`.

## What it does (sat-set, no questions)

For each target, ONE batched bash invocation:

1. **Kill any process holding the relevant port.**
   - Docs: ports `5173 5174 5175 5176 5177` (Vite default + 4 fallbacks).
   - Centernode: ports `3000 3001 3002`.
2. **Clear cache.**
   - Docs: `apps/docs/node_modules/.vite`.
   - Centernode: `centernode/.next`.
3. **Restart dev server in background.**
   - Docs: `cd apps/docs && ./node_modules/.bin/vite`
   - Centernode: `cd centernode && npx next dev`
4. **Wait ~5s, parse log for the URL, report back.**

Use `run_in_background: true` for the dev server. Don't sleep-poll — wait once with `sleep 5` then `tail` the log.

## Example bash (target=docs)

```bash
lsof -ti :5173 :5174 :5175 :5176 :5177 2>/dev/null | xargs -r kill 2>/dev/null; \
sleep 1; \
rm -rf apps/docs/node_modules/.vite; \
cd apps/docs && ./node_modules/.bin/vite
```

Run with `run_in_background: true`. After 5s, read the bg task log and report
the URL (typically `http://localhost:5173/` or 5174 if 5173 is taken).

## Example bash (target=centernode)

```bash
lsof -ti :3000 :3001 :3002 2>/dev/null | xargs -r kill 2>/dev/null; \
sleep 1; \
rm -rf centernode/.next; \
cd centernode && npx next dev
```

## Example bash (target=all)

Run both backgrounds in parallel. Report both URLs.

## Final report

Concise, one of:
```
✓ docs restarted → http://localhost:5174/  (cache cleared, hard refresh: Cmd+Shift+R)
✓ centernode restarted → http://localhost:3000/
✓ all restarted → docs http://localhost:5174/ | centernode http://localhost:3000/
```

## Forbidden

- Don't ask "which server?" — default to docs, or read the arg.
- Don't ask permission to kill — that's literally the point of the command.
- Don't run multiple `sleep` chains. One `sleep 5` after spawning is enough.
- Don't tail beyond what's needed for the URL line.
