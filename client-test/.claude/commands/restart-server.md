---
description: Kill Vite dev server in client-test, clear cache, restart fresh. Use when UI doesn't reflect changes (especially after `npm install` of new pod-test-ui version).
---

# /restart-server

Sat-set restart of client-test's Vite dev server. Common reasons to run:
- Just did `npm install pod-test-ui@<new>` — old version still cached in browser/Vite.
- Edited code but page won't hot-reload.
- Tailwind classes appear missing — `.vite` cache stale.

## What it does (ONE bash, sat-set)

1. Kill any process on Vite ports `5173 5174 5175 5176 5177`.
2. Clear `node_modules/.vite` cache.
3. Restart `vite` in background.
4. Wait 5s, parse log for URL, report.

## Bash

```bash
lsof -ti :5173 :5174 :5175 :5176 :5177 2>/dev/null | xargs -r kill 2>/dev/null; \
sleep 1; \
rm -rf node_modules/.vite; \
./node_modules/.bin/vite
```

Run with `run_in_background: true`. After 5s, read the bg log and report the URL.

## Final report

```
✓ client-test restarted → http://localhost:5173/  (hard refresh: Cmd+Shift+R)
```

If port differs, report the actual one. If pod-test-ui version changed recently,
remind user to hard-refresh browser too (Vite may serve stale JS without it).

## Forbidden

- Don't ask "should I restart?" — that's the whole point.
- Don't run `npm install` here — separate concern.
- Don't tail beyond what's needed for the URL line.
