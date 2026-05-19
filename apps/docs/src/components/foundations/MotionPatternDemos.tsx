import { useState } from 'react';

/**
 * Token-driven motion pattern demos for the Motion foundation page.
 * Each demo has a "Replay" affordance so visitors can re-watch the
 * animation without leaving the page. Keyframes live in index.css
 * (motion-shimmer, motion-spin, motion-pop-in, motion-slide-up,
 *  motion-slide-in-right, motion-pulse-dot).
 */

function ReplayWrap({
  label,
  caption,
  children,
}: {
  label: string;
  caption?: string;
  children: (replayKey: number) => React.ReactNode;
}) {
  const [k, setK] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <div className="grid place-items-center min-h-[6rem] rounded-md bg-muted/60 px-6 py-6">
        {children(k)}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">{caption ?? label}</span>
        <button
          type="button"
          onClick={() => setK((v) => v + 1)}
          className="rounded px-2 py-1 text-muted hover:text-default hover:bg-muted transition-colors"
        >
          ↻ Replay
        </button>
      </div>
    </div>
  );
}

function SkeletonShimmer() {
  return (
    <div className="w-full max-w-xs space-y-2">
      <div className="relative h-3 w-3/4 rounded-full overflow-hidden bg-muted">
        <div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-text-muted/15 to-transparent"
          style={{ animation: 'motion-shimmer 1.4s var(--ease-standard) infinite' }}
        />
      </div>
      <div className="relative h-3 w-full rounded-full overflow-hidden bg-muted">
        <div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-text-muted/15 to-transparent"
          style={{ animation: 'motion-shimmer 1.4s var(--ease-standard) 0.15s infinite' }}
        />
      </div>
      <div className="relative h-3 w-5/6 rounded-full overflow-hidden bg-muted">
        <div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-text-muted/15 to-transparent"
          style={{ animation: 'motion-shimmer 1.4s var(--ease-standard) 0.3s infinite' }}
        />
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-6 w-6 rounded-full border-2 border-default border-t-accent"
        style={{ animation: 'motion-spin 0.7s linear infinite' }}
      />
      <span className="text-sm text-muted">Loading…</span>
    </div>
  );
}

function PopIn({ k }: { k: number }) {
  return (
    <div
      key={k}
      className="rounded-md border border-default bg-surface px-4 py-3 text-sm text-default shadow-foundation-md"
      style={{ animation: 'motion-pop-in var(--duration-slow) var(--ease-emphasized) both' }}
    >
      Saved successfully
    </div>
  );
}

function SlideUp({ k }: { k: number }) {
  return (
    <div
      key={k}
      className="rounded-md bg-surface px-4 py-3 text-sm text-default border border-default"
      style={{ animation: 'motion-slide-up var(--duration-base) var(--ease-standard) both' }}
    >
      New notification — fades up
    </div>
  );
}

function SlideInRight({ k }: { k: number }) {
  return (
    <div
      key={k}
      className="rounded-md bg-surface px-4 py-3 text-sm text-default border border-default w-48"
      style={{ animation: 'motion-slide-in-right var(--duration-slow) var(--ease-emphasized) both' }}
    >
      Drawer panel
    </div>
  );
}

function StaggerList({ k }: { k: number }) {
  const items = ['Inbox', 'Reports', 'Settings', 'Help'];
  return (
    <ul key={k} className="w-full max-w-xs space-y-1.5">
      {items.map((label, i) => (
        <li
          key={label}
          className="rounded-md bg-surface px-3 py-2 text-sm text-default border border-default"
          style={{
            animation: 'motion-slide-up var(--duration-base) var(--ease-standard) both',
            animationDelay: `${i * 60}ms`,
          }}
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

function PulseDot() {
  return (
    <div className="flex items-center gap-3">
      <span className="relative inline-flex h-2.5 w-2.5">
        <span
          className="absolute inset-0 rounded-full bg-brand/60"
          style={{ animation: 'motion-pulse-dot 1.4s var(--ease-standard) infinite' }}
        />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
      </span>
      <span className="text-sm text-muted">Live · 3 viewers</span>
    </div>
  );
}

function HoverLift() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {['Card A', 'Card B'].map((t) => (
        <div
          key={t}
          className="cursor-pointer rounded-md border border-default bg-surface px-4 py-3 text-sm text-default transition-[transform,box-shadow] duration-base ease-standard hover:-translate-y-0.5 hover:shadow-foundation-md"
        >
          {t}
          <p className="text-xs text-muted mt-1">Hover me</p>
        </div>
      ))}
    </div>
  );
}

const DEMOS: Record<string, { label: string; caption?: string; render: (k: number) => React.ReactNode }> = {
  shimmer: {
    label: 'Skeleton shimmer',
    caption: 'duration: 1.4s · ease-standard · loops',
    render: () => <SkeletonShimmer />,
  },
  spinner: {
    label: 'Spinner',
    caption: '0.7s · linear · infinite',
    render: () => <Spinner />,
  },
  'pop-in': {
    label: 'Pop in (toast)',
    caption: 'duration-slow · ease-emphasized',
    render: (k) => <PopIn k={k} />,
  },
  'slide-up': {
    label: 'Fade up reveal',
    caption: 'duration-base · ease-standard',
    render: (k) => <SlideUp k={k} />,
  },
  'slide-in-right': {
    label: 'Drawer slide-in',
    caption: 'duration-slow · ease-emphasized',
    render: (k) => <SlideInRight k={k} />,
  },
  stagger: {
    label: 'Stagger list',
    caption: 'duration-base · ease-standard · 60ms step',
    render: (k) => <StaggerList k={k} />,
  },
  'pulse-dot': {
    label: 'Pulse indicator',
    caption: '1.4s · ease-standard · loops',
    render: () => <PulseDot />,
  },
  'hover-lift': {
    label: 'Hover lift',
    caption: 'duration-base · ease-standard · on hover',
    render: () => <HoverLift />,
  },
};

export function MotionPatternDemo({ name }: { name: keyof typeof DEMOS }) {
  const demo = DEMOS[name];
  if (!demo) return <p className="text-sm text-muted">Unknown demo: {name}</p>;
  return <ReplayWrap label={demo.label} caption={demo.caption}>{(k) => demo.render(k)}</ReplayWrap>;
}

export function MotionPatternGrid() {
  const entries = Object.entries(DEMOS) as Array<[string, (typeof DEMOS)[keyof typeof DEMOS]]>;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 not-prose">
      {entries.map(([name, demo]) => (
        <div key={name} className="rounded-lg border border-default bg-surface p-4 flex flex-col gap-2">
          <code className="text-sm font-semibold text-default">{demo.label}</code>
          <ReplayWrap label={demo.label} caption={demo.caption}>
            {(k) => demo.render(k)}
          </ReplayWrap>
        </div>
      ))}
    </div>
  );
}

