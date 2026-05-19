import { cn } from 'pod-test-ui';

interface SwatchProps {
  /**
   * EITHER a Tailwind background class (e.g. `bg-brand`)
   * OR a CSS variable reference starting with `--` (e.g. `--color-text-default`).
   * Use the CSS variable form when the token belongs to a non-background family
   * (text-*, border-*, icon-*, fg-*) and the per-utility Tailwind preset
   * doesn't expose it as a `bg-*` class.
   */
  bg: string;
  name: string;
  value: string;
  /** Optional foreground class for the visible label inside the chip. */
  fg?: string;
}

export function Swatch({ bg, name, value, fg = 'text-default' }: SwatchProps) {
  const isCssVar = bg.startsWith('--');
  return (
    <div className="flex items-center gap-3 rounded-md border border-default bg-surface p-3">
      <div
        className={cn(
          'h-10 w-10 shrink-0 rounded-md border border-subtle',
          !isCssVar && bg,
        )}
        style={isCssVar ? { backgroundColor: `rgb(var(${bg}))` } : undefined}
        aria-hidden="true"
      />
      <div className={cn('flex min-w-0 flex-col', fg)}>
        <span className="font-mono text-xs">{name}</span>
        <span className="text-[11px] text-muted">{value}</span>
      </div>
    </div>
  );
}

interface SwatchGridProps {
  children: React.ReactNode;
}

export function SwatchGrid({ children }: SwatchGridProps) {
  return (
    <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
