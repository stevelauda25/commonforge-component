import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn.js';

export type BadgeColor =
  | 'orange'
  | 'lime'
  | 'purple'
  | 'green'
  | 'indigo'
  | 'sky'
  | 'blue'
  | 'red'
  | 'yellow'
  | 'soft-gray'
  | 'dark-gray';

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Visual color treatment. Default `green`. */
  color?: BadgeColor;
  /** Render trailing × icon. Default `true`. */
  closable?: boolean;
  /**
   * Click handler for the × icon. When provided, × renders as a real button.
   * On click, the badge plays the POD exit motion (opacity + blur + scale +
   * width-collapse over 280ms) BEFORE calling this — consumers can update
   * their state instantly inside `onClose` (e.g. `setItems(prev => prev.filter(...))`)
   * and the animation still completes smoothly because the badge animates
   * its own DOM presence during the transition window.
   */
  onClose?: () => void;
  /**
   * Opt out of the built-in exit animation. Use only when you need
   * instant removal (e.g. bulk-clear, programmatic teardown). Default `false`.
   */
  instantRemove?: boolean;
}

const EXIT_MS = 280;

interface BadgeColorTokens {
  bg: string;
  tag: string;
  fg: string;
}

const colorTokens: Record<BadgeColor, BadgeColorTokens> = {
  orange: {
    bg: 'bg-experiment-badge-orange-bg',
    tag: 'bg-experiment-badge-orange-tag',
    fg: 'text-experiment-badge-orange-fg',
  },
  lime: {
    bg: 'bg-experiment-badge-lime-bg',
    tag: 'bg-experiment-badge-lime-tag',
    fg: 'text-experiment-badge-lime-fg',
  },
  purple: {
    bg: 'bg-experiment-badge-purple-bg',
    tag: 'bg-experiment-badge-purple-tag',
    fg: 'text-experiment-badge-purple-fg',
  },
  green: {
    bg: 'bg-experiment-badge-green-bg',
    tag: 'bg-experiment-badge-green-tag',
    fg: 'text-experiment-badge-green-fg',
  },
  indigo: {
    bg: 'bg-experiment-badge-indigo-bg',
    tag: 'bg-experiment-badge-indigo-tag',
    fg: 'text-experiment-badge-indigo-fg',
  },
  sky: {
    bg: 'bg-experiment-badge-sky-bg',
    tag: 'bg-experiment-badge-sky-tag',
    fg: 'text-experiment-badge-sky-fg',
  },
  blue: {
    bg: 'bg-experiment-badge-blue-bg',
    tag: 'bg-experiment-badge-blue-tag',
    fg: 'text-experiment-badge-blue-fg',
  },
  red: {
    bg: 'bg-experiment-badge-red-bg',
    tag: 'bg-experiment-badge-red-tag',
    fg: 'text-experiment-badge-red-fg',
  },
  yellow: {
    bg: 'bg-experiment-badge-yellow-bg',
    tag: 'bg-experiment-badge-yellow-tag',
    fg: 'text-experiment-badge-yellow-fg',
  },
  // Gray variants reuse experiment-tab-* tokens — same Figma bindings.
  'soft-gray': {
    bg: 'bg-experiment-tab-chip',
    tag: 'bg-experiment-tab-text-disabled',
    fg: 'text-experiment-tab-text',
  },
  'dark-gray': {
    bg: 'bg-experiment-tab-base border border-experiment-tab-border',
    tag: 'bg-experiment-tab-text-disabled',
    fg: 'text-experiment-tab-text',
  },
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    color = 'green',
    closable = true,
    onClose,
    instantRemove = false,
    children,
    className,
    style,
    ...rest
  },
  ref,
) {
  const c = colorTokens[color];

  // Built-in exit motion uses a two-phase pattern so that the normal
  // (idle) state has zero layout constraints — no maxWidth, no overflow
  // clipping. The phases:
  //   1. `idle`     — natural sizing, no inline style, no transitions
  //   2. `closing`  — width locked to measured pixel value + overflow:hidden,
  //                   set in one render with no transition (so the lock is
  //                   instantaneous, not animated from `auto`)
  //   3. `exiting`  — same locked frame transitioned to 0 (and opacity/blur/
  //                   scale animate in parallel). Browser interpolates from
  //                   `closing` snapshot to `exiting` target.
  // The phase flip happens across a requestAnimationFrame so the browser
  // commits the `closing` styles before the transition kicks in.
  type Phase = 'idle' | 'closing' | 'exiting';
  const [phase, setPhase] = React.useState<Phase>('idle');
  const internalRef = React.useRef<HTMLSpanElement | null>(null);
  const measuredWidthRef = React.useRef<number | undefined>(undefined);

  const setRefs = React.useCallback(
    (node: HTMLSpanElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
    },
    [ref],
  );

  const handleClose = React.useCallback(() => {
    if (phase !== 'idle' || !onClose) return;
    if (instantRemove) {
      onClose();
      return;
    }
    // Capture the live width at click time so a font-swap or reflow that
    // happened after mount doesn't leave us with a stale measurement.
    if (internalRef.current) {
      measuredWidthRef.current = internalRef.current.offsetWidth;
    }
    setPhase('closing');
    requestAnimationFrame(() => {
      setPhase('exiting');
      window.setTimeout(() => onClose(), EXIT_MS);
    });
  }, [phase, instantRemove, onClose]);

  const animationStyle: React.CSSProperties =
    phase === 'exiting'
      ? {
          maxWidth: 0,
          marginRight: 0,
          marginLeft: 0,
          paddingLeft: 0,
          paddingRight: 0,
          opacity: 0,
          filter: 'blur(4px)',
          transform: 'scale(0.85)',
          transformOrigin: 'center',
          overflow: 'hidden',
          transition: `max-width ${EXIT_MS}ms cubic-bezier(0.4, 0, 0.2, 1), margin ${EXIT_MS}ms cubic-bezier(0.4, 0, 0.2, 1), padding ${EXIT_MS}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${Math.round(EXIT_MS * 0.75)}ms ease-out, filter ${Math.round(EXIT_MS * 0.75)}ms ease-out, transform ${Math.round(EXIT_MS * 0.85)}ms ease-out`,
          willChange: 'opacity, transform, filter, max-width',
          pointerEvents: 'none',
        }
      : phase === 'closing' && measuredWidthRef.current != null
        ? {
            // One-frame snapshot: lock width to the just-measured value with
            // overflow hidden so the exiting transition has a numeric `from`.
            maxWidth: `${measuredWidthRef.current}px`,
            overflow: 'hidden',
          }
        : {};

  return (
    <span
      ref={setRefs}
      className={cn(
        'inline-flex items-center gap-0.5 px-1 py-0.5 rounded-xs',
        'font-medium text-[13px] leading-4 [font-family:"IBM_Plex_Mono",ui-monospace,monospace]',
        c.bg,
        c.fg,
        className,
      )}
      style={{ ...animationStyle, ...style }}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={cn('shrink-0 w-[3px] h-2.5 rounded-full', c.tag)}
      />
      <span>{children}</span>
      {closable &&
        (onClose ? (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Remove"
            className="shrink-0 inline-flex items-center justify-center opacity-80 hover:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-border-focus/60 [&>svg]:h-3.5 [&>svg]:w-3.5"
          >
            <X />
          </button>
        ) : (
          <span
            aria-hidden="true"
            className="shrink-0 inline-flex items-center justify-center [&>svg]:h-3.5 [&>svg]:w-3.5"
          >
            <X />
          </span>
        ))}
    </span>
  );
});
