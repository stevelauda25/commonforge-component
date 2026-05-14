---
description: Start dev servers (docs, centernode, client-test) — idempotent. If already running, leave it. If not, spawn in background and report URL.
---

# /run

Idempotent dev-server launcher for the POD workspace. Different from
`/restart-server` — this one does NOT kill anything. If a server is already
up, it just reports the URL.

Use this as the one-command "make my localhost ready" entry point. From the
user's perspective: type `/run`, get URLs, start working.

## Argument

- `/run`              → start ALL (docs + centernode + client-test)
- `/run docs`         → start docs only
- `/run centernode`   → start centernode only
- `/run client-test`  → start client-test only
- `/run all`          → same as no arg

If no arg, assume `all`.

## Server map

| Target       | Cwd                | Port (default)    | Start command                          |
|---           |---                 |---                |---                                     |
| docs         | `apps/docs`        | 5173 (fallback 5174-5177) | `./node_modules/.bin/vite`     |
| centernode   | `centernode`       | 3000 (fallback 3001-3002) | `npx next dev`                 |
| client-test  | `client-test`      | 5173 (fallback 5174-5177) | `./node_modules/.bin/vite`     |

**Port collision note:** docs and client-test both default to Vite port 5173.
If you run BOTH, Vite auto-falls-back. Inspect the bg log to know which port
each picked.

## What it does per target (sat-set, no questions)

1. **Check port.** Use `lsof -ti :<port>` to see if anything listens.
2. **If port busy:**
   - Run `lsof -i :<port>` to peek at the process command.
   - If it's our dev server (vite / next-server / node in that cwd) →
     skip start, report "already running at http://localhost:<port>/".
   - If it's a foreign process → report the conflict, suggest user kill it
     manually or run `/restart-server`. Don't spawn (would just collide).
3. **If port free:**
   - Spawn the start command via Bash `run_in_background: true`.
   - `sleep 5`, then tail the bg task log, grep for `Local:` or
     `http://localhost:` to extract the real URL (Vite/Next may pick a
     different port if 5173/3000 was actually used by another project).
   - Report the URL.

## Final report (concise)

```
✓ docs        → http://localhost:5173/  (started)
✓ centernode  → http://localhost:3000/  (already running)
✓ client-test → http://localhost:5174/  (started, port 5173 taken by docs)
```

Or for single target:

```
✓ docs running at http://localhost:5173/
```

## Forbidden

- Don't ask "should I start it?" — that's the command.
- Don't kill anything (this is `/run`, not `/restart-server`).
- Don't restart a server that's already up — wasteful.
- Don't poll forever for the URL — one `sleep 5` then tail is enough. If log
  still empty after that, report `(starting — check terminal for URL)`.
- Don't run multiple `sleep` rounds. One per server, in parallel if multiple.

## Speed budget

If `/run all` takes more than ~10 seconds of agent activity, you're polling.
Pattern: launch all 3 bg tasks → ONE `sleep 5` → tail all 3 logs → report.

## Pairing with other commands

- After `/sync-figma <slug>` and you want to verify visually → `/run docs`.
- After `npm publish` and updating client-test → `/run client-test`.
- Centernode integration testing → `/run centernode`.
- Working session start → `/run` (everything).
