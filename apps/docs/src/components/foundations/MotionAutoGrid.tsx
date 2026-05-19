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

const EASING_META: Record<(typeof EASING_NAMES)[number], { use: string; example: string }> = {
  standard: { use: 'Default for everything', example: 'state changes, hover, focus moves' },
  emphasized: { use: 'Dramatic moments', example: 'dialog open, drawer expand, hero transitions' },
  press: { use: 'Tactile feedback', example: 'button press / release, tap response' },
};

const DURATION_META: Record<(typeof DURATION_NAMES)[number], { use: string }> = {
  fast: { use: 'Micro-interactions — hover, focus' },
  base: { use: 'Default UI transitions' },
  slow: { use: 'Layout shifts, dialog, drawer' },
};

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
          className="absolute inset-y-0 left-0 bg-brand"
          style={{
            width: playing ? '100%' : '0%',
            transition: `width var(${entry.cssVar}) var(--ease-standard)`,
          }}
        />
      </div>
      <button
        type="button"
        onClick={trigger}
        className="text-xs text-muted hover:text-default transition-colors"
      >
        ▶ Replay
      </button>
    </div>
  );
}

function EaseCurve({ entry }: { entry: EasingEntry }) {
  if (!entry.cubicBezier) {
    return (
      <div className="h-32 w-full grid place-items-center text-[10px] text-disabled">
        N/A
      </div>
    );
  }
  const [x1, y1, x2, y2] = entry.cubicBezier;
  const size = 100;
  const pad = 10;
  const draw = size - pad * 2;
  const p0x = pad, p0y = size - pad;
  const p3x = size - pad, p3y = pad;
  const p1x = pad + x1 * draw, p1y = size - pad - y1 * draw;
  const p2x = pad + x2 * draw, p2y = size - pad - y2 * draw;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-28 w-full"
      role="img"
      aria-label={`${entry.name} cubic-bezier curve`}
    >
      <line x1={pad} y1={pad} x2={pad} y2={size - pad} stroke="currentColor" className="text-border-subtle" strokeWidth="0.5" />
      <line x1={pad} y1={size - pad} x2={size - pad} y2={size - pad} stroke="currentColor" className="text-border-subtle" strokeWidth="0.5" />
      <path
        d={`M${p0x} ${p0y} L${p3x} ${p3y}`}
        stroke="currentColor"
        className="text-border-default"
        strokeWidth="0.75"
        strokeDasharray="2 3"
      />
      <line x1={p0x} y1={p0y} x2={p1x} y2={p1y} stroke="currentColor" className="text-brand/30" strokeWidth="0.75" />
      <line x1={p3x} y1={p3y} x2={p2x} y2={p2y} stroke="currentColor" className="text-brand/30" strokeWidth="0.75" />
      <path
        d={`M${p0x} ${p0y} C ${p1x} ${p1y}, ${p2x} ${p2y}, ${p3x} ${p3y}`}
        stroke="currentColor"
        className="text-brand"
        strokeWidth="1.75"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={p0x} cy={p0y} r="1.75" fill="currentColor" className="text-muted" />
      <circle cx={p3x} cy={p3y} r="1.75" fill="currentColor" className="text-muted" />
      <circle cx={p1x} cy={p1y} r="2.25" fill="currentColor" className="text-brand" />
      <circle cx={p2x} cy={p2y} r="2.25" fill="currentColor" className="text-brand" />
    </svg>
  );
}

function EaseDemo({ entry, durationVar }: { entry: EasingEntry; durationVar: string }) {
  const [pos, setPos] = useState(0);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    const cycle = () => {
      setPos((p) => (p ? 0 : 1));
      ref.current = window.setTimeout(cycle, 1400) as unknown as number;
    };
    ref.current = window.setTimeout(cycle, 700) as unknown as number;
    return () => { if (ref.current) clearTimeout(ref.current); };
  }, []);
  const replay = () => {
    setPos(0);
    window.setTimeout(() => setPos(1), 60);
  };
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-6 flex-1 rounded-full bg-muted overflow-hidden">
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-brand"
          style={{
            left: pos ? 'calc(100% - 18px)' : '2px',
            transition: `left var(${durationVar}) var(${entry.cssVar})`,
          }}
        />
      </div>
      <button
        type="button"
        onClick={replay}
        aria-label="Replay easing demo"
        className="text-xs text-muted hover:text-default transition-colors px-1.5 py-0.5 rounded"
      >
        ↻
      </button>
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
    if (durations.length === 0) return <p className="text-sm text-muted">Loading…</p>;
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {durations.map((d) => (
          <div key={d.name} className="rounded-lg border border-default bg-surface p-4 flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <code className="text-sm font-semibold text-default">{d.className}</code>
              <code className="text-xs text-subtle tabular-nums">{d.resolvedMs}ms</code>
            </div>
            <p className="text-xs text-muted leading-snug">{DURATION_META[d.name as keyof typeof DURATION_META].use}</p>
            <DurationDemo entry={d} />
          </div>
        ))}
      </div>
    );
  }

  if (easings.length === 0) return <p className="text-sm text-muted">Loading…</p>;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {easings.map((e) => {
        const meta = EASING_META[e.name as keyof typeof EASING_META];
        return (
          <div key={e.name} className="rounded-lg border border-default bg-surface p-4 flex flex-col gap-3">
            <div className="rounded-md bg-canvas/40 px-2 py-1">
              <EaseCurve entry={e} />
            </div>
            <div className="flex flex-col gap-1">
              <code className="text-sm font-semibold text-default">{e.className}</code>
              <code className="text-[11px] text-muted break-all">
                {e.cubicBezier ? `cubic-bezier(${e.cubicBezier.join(', ')})` : e.resolvedFn}
              </code>
            </div>
            <p className="text-xs text-subtle leading-snug">
              <span className="font-medium text-default">{meta.use}.</span>{' '}
              <span className="text-muted">{meta.example}.</span>
            </p>
            <div className="mt-auto pt-1">
              <EaseDemo entry={e} durationVar="--duration-slow" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
