import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createAppAuth } from '@octokit/auth-app';
import { request } from '@octokit/request';
import { timingSafeEqual } from 'node:crypto';

type FigmaWebhookBody = {
  event_type?: string;
  passcode?: string;
  file_key?: string;
  webhook_id?: string;
  timestamp?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = (req.body ?? {}) as FigmaWebhookBody;

  // Figma sends PING when a webhook is first registered. Ack without dispatch.
  if (body.event_type === 'PING') {
    return res.status(200).json({ ok: true, message: 'pong' });
  }

  const expectedPasscode = process.env.FIGMA_WEBHOOK_SECRET;
  if (!expectedPasscode) {
    console.error('FIGMA_WEBHOOK_SECRET is not configured');
    return res.status(500).json({ error: 'Server misconfigured' });
  }
  if (typeof body.passcode !== 'string' || !timingSafeStringEqual(body.passcode, expectedPasscode)) {
    console.warn('Webhook rejected: invalid passcode', { event_type: body.event_type, webhook_id: body.webhook_id });
    return res.status(401).json({ error: 'Invalid passcode' });
  }

  if (body.event_type !== 'LIBRARY_PUBLISH') {
    return res.status(200).json({ ok: true, ignored: body.event_type ?? 'unknown' });
  }

  if (typeof body.file_key !== 'string' || body.file_key.length === 0) {
    return res.status(400).json({ error: 'Missing file_key' });
  }

  const repoFullName = process.env.GITHUB_REPO;
  const appId = process.env.GITHUB_APP_ID;
  const installationId = process.env.GITHUB_INSTALLATION_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

  if (!repoFullName || !appId || !installationId || !privateKey) {
    console.error('GitHub App env vars missing');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const [owner, repo] = repoFullName.split('/');
  if (!owner || !repo) {
    console.error('GITHUB_REPO must be in owner/repo format');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    const auth = createAppAuth({
      appId,
      privateKey,
      installationId: Number(installationId),
    });
    const { token } = await auth({ type: 'installation' });

    const result = await request('POST /repos/{owner}/{repo}/dispatches', {
      owner,
      repo,
      event_type: 'figma-library-published',
      client_payload: {
        fileKey: body.file_key,
        figmaWebhookId: body.webhook_id ?? null,
        figmaTimestamp: body.timestamp ?? null,
      },
      headers: { authorization: `token ${token}` },
    });

    console.log('Dispatched repository_dispatch', { fileKey: body.file_key, status: result.status });
    return res.status(202).json({ ok: true, dispatchStatus: result.status });
  } catch (err) {
    console.error('Failed to dispatch repository_dispatch', err);
    return res.status(502).json({ error: 'Dispatch failed' });
  }
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBuf = encoder.encode(a);
  const bBuf = encoder.encode(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}
