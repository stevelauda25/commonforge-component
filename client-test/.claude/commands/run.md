---
description: Start client-test Vite dev server — idempotent. If already running, just reports URL. Use as "ready my localhost" one-shot.
---

# /run

Start the client-test Vite dev server. Idempotent — different from
`/restart-server` which forces a kill+restart. This one leaves things alone if
already up.

## What it does (sat-set)

1. **Check port** `5173` (Vite default).
2. **If busy** by our `vite` process → skip start, report URL.
3. **If busy** by foreign process → report conflict, suggest `/restart-server`.
4. **If free** → spawn `./node_modules/.bin/vite` in background.
5. **Wait 5s**, tail bg log, grep `Local:` for actual URL, report.

## Bash (when starting fresh)

```bash
lsof -ti :5173 :5174 :5175 :5176 :5177 2>/dev/null | head -1
# If empty → spawn:
./node_modules/.bin/vite
```

Run vite with `run_in_background: true`. After 5s, tail the log and report.

## Final report

```
✓ client-test running at http://localhost:5173/  (started)
```

Or if already up:

```
✓ client-test already running at http://localhost:5173/
```

If Vite fell back to a different port (e.g. 5174 because docs is on 5173),
report the actual port from the log.

## Forbidden

- Don't kill anything (that's `/restart-server`).
- Don't run `npm install` here.
- Don't ask "should I start it?".
- Don't sleep more than once (just `sleep 5` after spawn).
