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
  /** Click handler for the × icon. When provided, × renders as a real button. */
  onClose?: () => void;
}

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
  { color = 'green', closable = true, onClose, children, className, ...rest },
  ref,
) {
  const c = colorTokens[color];
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-0.5 px-1 py-0.5 rounded-xs',
        'font-medium text-[13px] leading-4 [font-family:"IBM_Plex_Mono",ui-monospace,monospace]',
        c.bg,
        c.fg,
        className,
      )}
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
            onClick={onClose}
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
