import { useEffect, useState } from 'react';
import { Button, Tooltip } from 'pod-test-ui';
import { ExternalLink, RefreshCw, AlertCircle, Check, Clipboard, ClipboardCheck } from 'lucide-react';
import { PageHeader } from '../components/docs/PageHeader.js';

type DisplayValue =
  | { kind: 'empty' }
  | { kind: 'color'; hex: string; css: string; name: string | null }
  | { kind: 'binding'; id: string }
  | { kind: 'object'; json: string }
  | { kind: 'scalar'; text: string };

interface EnrichedChange {
  path: string;
  label: string;
  kind: 'color' | 'binding' | 'scalar' | 'boolean' | 'object';
  beforeDisplay: DisplayValue;
  afterDisplay: DisplayValue;
}

interface ComponentStatus {
  slug: string;
  nodeId: string;
  url: string;
  lastSync: string | null;
  reason?: string;
  diff?: {
    added: string[];
    removed: string[];
    modified: { variant: string; changes: EnrichedChange[] }[];
  } | null;
}

interface DriftStatus {
  drifted: ComponentStatus[];
  inSync: ComponentStatus[];
  errors: { slug: string; message: string }[];
  file: { key: string; name: string };
}

function relativeTime(iso: string | null): string {
  if (!iso) return 'never';
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <Tooltip content={copied ? 'Copied!' : 'Copy command'}>
      <Button
        variant="outline"
        size="xs"
        iconOnly
        leftIcon={copied ? <ClipboardCheck size={14} /> : <Clipboard size={14} />}
        onClick={onCopy}
        aria-label="Copy sync command"
      />
    </Tooltip>
  );
}

function StatusBadge({ kind }: { kind: 'sync' | 'drift' | 'error' | 'never' }) {
  const map = {
    sync:  { color: 'bg-success/15 text-success border-success/30', icon: <Check size={12} />, label: 'IN SYNC' },
    drift: { color: 'bg-warning/15 text-warning border-warning/40', icon: <AlertCircle size={12} />, label: 'DRIFTED' },
    error: { color: 'bg-danger/15 text-danger border-danger/40',    icon: <AlertCircle size={12} />, label: 'ERROR' },
    never: { color: 'bg-muted text-text-muted border-border-default', icon: <AlertCircle size={12} />, label: 'NEVER BLESSED' },
  } as const;
  const { color, icon, label } = map[kind];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${color}`}>
      {icon}
      {label}
    </span>
  );
}

function DisplayCell({ v }: { v: DisplayValue }) {
  if (v.kind === 'empty')  return <span className="text-text-disabled">∅</span>;
  if (v.kind === 'color')  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block h-4 w-6 rounded border border-border-default" style={{ background: v.css }} />
      <code className="text-xs font-medium">{v.hex}</code>
      {v.name && <span className="text-xs text-text-muted">({v.name})</span>}
    </span>
  );
  if (v.kind === 'binding') return <code className="text-xs">id {v.id}</code>;
  if (v.kind === 'object')  return <code className="text-xs text-text-muted truncate max-w-[280px] block">{v.json}</code>;
  return <code className="text-xs">{v.text}</code>;
}

function ChangeRow({ ch }: { ch: EnrichedChange }) {
  return (
    <div className="grid grid-cols-[140px_1fr_auto_1fr] items-center gap-3 py-1 text-sm">
      <span className="text-accent">{ch.label}</span>
      <DisplayCell v={ch.beforeDisplay} />
      <span className="text-text-disabled">→</span>
      <DisplayCell v={ch.afterDisplay} />
    </div>
  );
}

function DriftedCard({ comp }: { comp: ComponentStatus }) {
  const [expanded, setExpanded] = useState(false);
  const counts = comp.diff
    ? { add: comp.diff.added.length, mod: comp.diff.modified.length, rem: comp.diff.removed.length }
    : { add: 0, mod: 0, rem: 0 };

  return (
    <div className="rounded-xl border border-border-default bg-surface overflow-hidden">
      <div className="flex items-start justify-between gap-4 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{comp.slug}</h3>
            <StatusBadge kind={comp.lastSync ? 'drift' : 'never'} />
          </div>
          <div className="text-sm text-text-muted space-y-0.5">
            <div>Last sync: <span className="text-text-secondary">{relativeTime(comp.lastSync)}</span></div>
            <div>NodeId: <code className="text-xs">{comp.nodeId}</code></div>
            {comp.diff && (
              <div className="flex gap-3 mt-1">
                {counts.add > 0 && <span className="text-success">+{counts.add} added</span>}
                {counts.mod > 0 && <span className="text-warning">~{counts.mod} modified</span>}
                {counts.rem > 0 && <span className="text-danger">−{counts.rem} removed</span>}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Tooltip content="Open in Figma">
            <a
              href={comp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border-default text-text-muted hover:text-text-primary hover:bg-muted transition-colors"
              aria-label="Open in Figma"
            >
              <ExternalLink size={14} />
            </a>
          </Tooltip>
          <CopyButton text={`/sync-figma ${comp.slug}`} />
        </div>
      </div>

      {comp.diff && (counts.mod > 0 || counts.add > 0 || counts.rem > 0) && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="w-full border-t border-border-default px-4 py-2 text-left text-xs text-text-muted hover:bg-muted transition-colors"
          >
            {expanded ? '▾ Hide changes' : '▸ Show changes'}
          </button>
          {expanded && (
            <div className="border-t border-border-default px-4 py-3 space-y-4">
              {comp.diff.added.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-success mb-2">Added ({comp.diff.added.length})</h4>
                  <ul className="space-y-1 text-sm">
                    {comp.diff.added.map((v) => <li key={v} className="text-text-secondary">+ {v}</li>)}
                  </ul>
                </div>
              )}
              {comp.diff.removed.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-danger mb-2">Removed ({comp.diff.removed.length})</h4>
                  <ul className="space-y-1 text-sm">
                    {comp.diff.removed.map((v) => <li key={v} className="text-text-secondary">− {v}</li>)}
                  </ul>
                </div>
              )}
              {comp.diff.modified.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-warning mb-2">Modified ({comp.diff.modified.length})</h4>
                  <div className="space-y-3">
                    {comp.diff.modified.map((m) => (
                      <div key={m.variant}>
                        <div className="text-xs font-medium text-text-secondary mb-1">{m.variant}</div>
                        <div className="pl-3 border-l-2 border-warning/40">
                          {m.changes.map((ch, i) => <ChangeRow key={i} ch={ch} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function InSyncCard({ comp }: { comp: ComponentStatus }) {
  return (
    <div className="rounded-xl border border-border-default bg-surface p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <StatusBadge kind="sync" />
        <div>
          <div className="font-semibold">{comp.slug}</div>
          <div className="text-xs text-text-muted">
            Last sync: {relativeTime(comp.lastSync)} · <code>{comp.nodeId}</code>
          </div>
        </div>
      </div>
      <Tooltip content="Open in Figma">
        <a
          href={comp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border-default text-text-muted hover:text-text-primary hover:bg-muted transition-colors"
          aria-label="Open in Figma"
        >
          <ExternalLink size={14} />
        </a>
      </Tooltip>
    </div>
  );
}

export default function FigmaStatus() {
  const [status, setStatus] = useState<DriftStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const load = (live = false) => {
    setLoading(true);
    // Live = hit the Vite endpoint that runs check.mjs fresh.
    // Static = read the JSON file (snapshot from last `pnpm figma:status`).
    const url = live ? '/api/figma-check?t=' + Date.now() : '/figma-status.json?t=' + Date.now();
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setStatus(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(true); }, []);

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <div className="flex items-start justify-between gap-6 mb-8">
        <PageHeader
          title="Figma Sync Status"
          description={status?.file ? `${status.file.name} (${status.file.key})` : 'Tracking drift between Figma and code'}
        />
        <div className="flex items-center gap-2 pt-2">
          <Tooltip content="Run check.mjs against live Figma">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<RefreshCw size={14} />}
              onClick={() => load(true)}
              loading={loading}
            >
              Check now
            </Button>
          </Tooltip>
        </div>
      </div>

      {loading && <div className="text-text-muted">Loading…</div>}

      {!loading && !status && (
        <div className="rounded-xl border border-dashed border-border-default p-8 text-center text-text-muted">
          <AlertCircle size={32} className="mx-auto mb-3 opacity-50" />
          <p>No status data found.</p>
          <p className="text-xs mt-2">Generate by running: <code className="rounded bg-muted px-2 py-0.5">node scripts/figma/check.mjs --json &gt; apps/docs/public/figma-status.json</code></p>
        </div>
      )}

      {!loading && status && (
        <div className="space-y-6">
          {status.drifted.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-warning mb-3">
                Drifted ({status.drifted.length})
              </h2>
              <div className="space-y-3">
                {status.drifted.map((c) => <DriftedCard key={c.slug} comp={c} />)}
              </div>
            </section>
          )}

          {status.inSync.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-success mb-3">
                In sync ({status.inSync.length})
              </h2>
              <div className="space-y-2">
                {status.inSync.map((c) => <InSyncCard key={c.slug} comp={c} />)}
              </div>
            </section>
          )}

          {status.errors.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-danger mb-3">
                Errors ({status.errors.length})
              </h2>
              <div className="space-y-2">
                {status.errors.map((e) => (
                  <div key={e.slug} className="rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm">
                    <span className="font-medium">{e.slug}</span> — {e.message}
                  </div>
                ))}
              </div>
            </section>
          )}

          {status.drifted.length === 0 && status.errors.length === 0 && (
            <div className="rounded-xl border border-success/30 bg-success/10 p-6 text-center">
              <Check size={32} className="mx-auto mb-2 text-success" />
              <p className="font-medium text-success">All tracked components are in sync.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
