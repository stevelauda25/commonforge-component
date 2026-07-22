# Figma webhook receiver

Single-function Vercel project. Receives Figma `LIBRARY_PUBLISH` webhooks,
verifies the passcode, and fires a `repository_dispatch` event of type
`figma-library-published` into the design-system repo.

That dispatch wakes [.github/workflows/figma-sync.yml](../../.github/workflows/figma-sync.yml),
which runs the Claude Code Action sync.

> **Important — separate Vercel project.** This is intentionally NOT the same
> Vercel project as the docs site. Blast radius isolation per the design spec.

## Setup (one-time)

### 1. Create a GitHub App

1. Go to https://github.com/settings/apps/new
2. **Name:** `pod-figma-sync-bot` (or similar)
3. **Homepage URL:** repo URL
4. **Webhook:** uncheck "Active" (we don't receive GitHub events here)
5. **Permissions** → Repository:
   - Contents: **Read & write** (needed for `peter-evans/create-pull-request` later if migrated to App auth; safe to grant)
   - Pull requests: **Read & write**
   - Metadata: **Read**
6. **Where can this GitHub App be installed?** Only on this account
7. Click **Create GitHub App**
8. On the App settings page:
   - Note the **App ID** (top of page)
   - Generate a **private key** (PEM file downloads — keep safe)
9. Click **Install App** (left sidebar) → install on `stevelauda25/pod-native-design-system` only
10. After install, the URL becomes `https://github.com/settings/installations/<INSTALLATION_ID>` — note the ID

### 2. Create the Vercel project

1. Vercel dashboard → **Add New** → **Project** → import `stevelauda25/pod-native-design-system`
2. **Project name:** `pod-figma-webhook-receiver` (must differ from docs site)
3. **Root Directory:** `apps/webhook-receiver`
4. Framework preset: **Other**
5. Build/Output: leave defaults (vercel.json handles it)
6. Add Environment Variables (all four required) — see [.env.example](.env.example)
7. Deploy. Note the production URL — you'll register it with Figma below.

### 3. Register the webhook with Figma

Figma webhooks v2 are managed via REST API. Pick a passcode (random string),
save it as `FIGMA_WEBHOOK_SECRET` in Vercel, then:

```bash
# Replace placeholders before running.
curl -X POST https://api.figma.com/v2/webhooks \
  -H "X-Figma-Token: <your FIGMA_PAT>" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "LIBRARY_PUBLISH",
    "team_id": "<TEAM_ID containing the design system file>",
    "endpoint": "https://<your-vercel-url>/api/figma-webhook",
    "passcode": "<same value as FIGMA_WEBHOOK_SECRET>",
    "description": "CF Design System sync"
  }'
```

Figma will fire a `PING` event on registration — the handler responds 200,
confirming the endpoint is live. You'll see the PING in Vercel function logs.

To list registered webhooks:
```bash
curl https://api.figma.com/v2/teams/<TEAM_ID>/webhooks \
  -H "X-Figma-Token: <your FIGMA_PAT>"
```

To delete a webhook:
```bash
curl -X DELETE https://api.figma.com/v2/webhooks/<WEBHOOK_ID> \
  -H "X-Figma-Token: <your FIGMA_PAT>"
```

## Local development

```bash
pnpm install
pnpm typecheck
```

Vercel CLI dev is possible but the webhook needs a public URL to be useful.
Easier: deploy to a Vercel preview, point a temp Figma webhook at it, then tear
down. Or use `ngrok` to tunnel localhost.

## How it works

```
Figma "Publish library" → POST to /api/figma-webhook
  → verify body.passcode (timing-safe)
  → if event_type=PING → return 200
  → if event_type=LIBRARY_PUBLISH:
      mint GitHub App installation token
      POST /repos/<owner>/<repo>/dispatches
        type=figma-library-published
        client_payload={ fileKey, figmaWebhookId, figmaTimestamp }
      → return 202
```

`figma-sync.yml` listens on `repository_dispatch` (type `figma-library-published`)
and runs its existing drift-detect → sync → PR pipeline.

## Failure modes

| Scenario | Status | Notes |
|---|---|---|
| Bad/missing passcode | 401 | Figma will retry 3x then mark delivery failed |
| Non-LIBRARY_PUBLISH event | 200 | Ack but skip dispatch (e.g. PING, FILE_UPDATE) |
| Missing file_key | 400 | Body shape unexpected — likely Figma API change |
| GitHub auth fail | 502 | Check App ID / installation ID / PEM in Vercel env |
| GITHUB_*/FIGMA_* env unset | 500 | Vercel project misconfigured |
