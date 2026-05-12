import { useEffect, useRef, useState } from 'react';

/**
 * Auto-renders POD motion tokens (duration + easing) with live demos.
 * Reads `--duration-*` and `--ease-*` CSS variables at mount, so any
 * new motion token added to theme.css picks up automatically.
 */

type Kind = 'duration' | 'easing';

interface DurationEntry {
  name: string;
  cssVar: string;
  className: string;
  resolvedMs: number;
}

interface EasingEntry {
  name: string;
  cssVar: string;
  className: string;
  resolvedFn: string;
  cubicBezier: [number, number, number, number] | null;
}

function parseCubicBezier(fn: string): [number, number, number, number] | null {
  const m = /cubic-bezier\(\s*([\d.\-]+)\s*,\s*([\d.\-]+)\s*,\s*([\d.\-]+)\s*,\s*([\d.\-]+)\s*\)/.exec(fn);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
}

function readVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const DURATION_NAMES = ['fast', 'base', 'slow'] as const;
const EASING_NAMES = ['standard', 'emphasized', 'press'] as const;

function DurationDemo({ entry }: { entry: DurationEntry }) {
  const [playing, setPlaying] = useState(false);
  const trigger = () => {
    setPlaying(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPlaying(true)));
  };
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-2 w-48 overflow-hidden rounded-full bg-muted">
        <div
          key={playing ? 'on' : 'off'}
          className="absolute inset-y-0 left-0 bg-accent"
          style={{
            width: playing ? '100%' : '0%',
            transition: `width var(${entry.cssVar}) var(--ease-standard)`,
          }}
        />
      </div>
      <button
        type="button"
        onClick={trigger}
        className="text-xs text-text-muted hover:text-text-primary transition-colors"
      >
        ▶ Replay
      </button>
    </div>
  );
}

function EaseCurve({ entry }: { entry: EasingEntry }) {
  if (!entry.cubicBezier) {
    return <div className="h-20 w-20 grid place-items-center text-[10px] text-text-disabled">N/A</div>;
  }
  const [x1, y1, x2, y2] = entry.cubicBezier;
  // SVG coord system: 0,0 top-left. Visualize bezier from (0,80) → (80,0).
  // Control points get inverted Y so curve goes "up".
  const size = 80;
  const p0x = 0, p0y = size;
  const p3x = size, p3y = 0;
  const p1x = x1 * size, p1y = size - y1 * size;
  const p2x = x2 * size, p2y = size - y2 * size;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <path
        d={`M0 ${size} L${size} 0`}
        stroke="currentColor"
        className="text-border-default"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <path
        d={`M${p0x} ${p0y} C ${p1x} ${p1y}, ${p2x} ${p2y}, ${p3x} ${p3y}`}
        stroke="currentColor"
        className="text-accent"
        strokeWidth="2"
        fill="none"
      />
      <line x1={p0x} y1={p0y} x2={p1x} y2={p1y} stroke="currentColor" className="text-accent/30" strokeWidth="1" />
      <line x1={p3x} y1={p3y} x2={p2x} y2={p2y} stroke="currentColor" className="text-accent/30" strokeWidth="1" />
      <circle cx={p1x} cy={p1y} r="2" fill="currentColor" className="text-accent" />
      <circle cx={p2x} cy={p2y} r="2" fill="currentColor" className="text-accent" />
    </svg>
  );
}

function EaseDemo({ entry, durationVar }: { entry: EasingEntry; durationVar: string }) {
  const [pos, setPos] = useState(0);
  const flip = () => setPos((p) => (p ? 0 : 1));
  const ref = useRef<number | null>(null);
  useEffect(() => {
    const cycle = () => {
      setPos((p) => (p ? 0 : 1));
      ref.current = window.setTimeout(cycle, 1200) as unknown as number;
    };
    ref.current = window.setTimeout(cycle, 600) as unknown as number;
    return () => { if (ref.current) clearTimeout(ref.current); };
  }, []);
  return (
    <div className="relative h-6 w-48 rounded-full bg-muted overflow-hidden cursor-pointer" onClick={flip}>
      <div
        className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-accent"
        style={{
          left: pos ? 'calc(100% - 18px)' : '2px',
          transition: `left var(${durationVar}) var(${entry.cssVar})`,
        }}
      />
    </div>
  );
}

export function MotionAutoGrid({ kind }: { kind: Kind }) {
  const [durations, setDurations] = useState<DurationEntry[]>([]);
  const [easings, setEasings] = useState<EasingEntry[]>([]);

  useEffect(() => {
    if (kind === 'duration') {
      const entries: DurationEntry[] = DURATION_NAMES.map((name) => {
        const cssVar = `--duration-${name}`;
        const raw = readVar(cssVar);
        const resolvedMs = parseFloat(raw.replace('ms', '')) || 0;
        return { name, cssVar, className: `duration-${name}`, resolvedMs };
      });
      setDurations(entries);
    } else {
      const entries: EasingEntry[] = EASING_NAMES.map((name) => {
        const cssVar = `--ease-${name}`;
        const resolvedFn = readVar(cssVar);
        return {
          name,
          cssVar,
          className: `ease-${name}`,
          resolvedFn,
          cubicBezier: parseCubicBezier(resolvedFn),
        };
      });
      setEasings(entries);
    }
  }, [kind]);

  if (kind === 'duration') {
    if (durations.length === 0) return <p className="text-sm text-text-muted">Loading…</p>;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border-default">
            <tr className="text-left text-xs uppercase tracking-wide text-text-muted">
              <th className="py-2 pr-4 font-medium">Token</th>
              <th className="py-2 pr-4 font-medium">Value</th>
              <th className="py-2 pr-4 font-medium">Class</th>
              <th className="py-2 font-medium">Preview</th>
            </tr>
          </thead>
          <tbody>
            {durations.map((d) => (
              <tr key={d.name} className="border-b border-border-subtle">
                <td className="py-3 pr-4">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{d.cssVar}</code>
                </td>
                <td className="py-3 pr-4">
                  <code className="text-xs text-text-secondary tabular-nums">{d.resolvedMs}ms</code>
                </td>
                <td className="py-3 pr-4">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{d.className}</code>
                </td>
                <td className="py-3">
                  <DurationDemo entry={d} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (easings.length === 0) return <p className="text-sm text-text-muted">Loading…</p>;
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {easings.map((e) => (
        <div key={e.name} className="rounded-lg border border-border-default bg-surface p-4">
          <div className="flex items-start gap-3 mb-3">
            <EaseCurve entry={e} />
            <div className="min-w-0 flex-1">
              <code className="block text-xs font-semibold text-text-primary">{e.className}</code>
              <code className="block text-[10px] text-text-muted mt-1 break-all">
                {e.cubicBezier ? `cubic-bezier(${e.cubicBezier.join(', ')})` : e.resolvedFn}
              </code>
            </div>
          </div>
          <EaseDemo entry={e} durationVar="--duration-slow" />
          <p className="text-[11px] text-text-muted mt-2 text-center">click bar to toggle</p>
        </div>
      ))}
    </div>
  );
}
