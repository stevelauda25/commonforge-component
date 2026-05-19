import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/cn.js';

export type TooltipVariant = 'default' | 'info' | 'warning' | 'error';
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';

export interface TooltipProps {
  /** Bold title row (top). Optional — omit for a single-row tooltip. */
  title?: React.ReactNode;
  /** Body row. Required. Renders alone if no `title` is set. */
  content: React.ReactNode;
  children: React.ReactElement;
  variant?: TooltipVariant;
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  delayDuration?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const variantStyles: Record<TooltipVariant, string> = {
  default: 'bg-surface',
  info:    'bg-info',
  warning: 'bg-warning',
  error:   'bg-destructive',
};

const variantTitleColor: Record<TooltipVariant, string> = {
  default: 'text-strong',
  info:    'text-on-info',
  warning: 'text-on-warning',
  error:   'text-on-destructive',
};

const variantBodyColor: Record<TooltipVariant, string> = {
  default: 'text-muted',
  info:    'text-on-info',
  warning: 'text-on-warning',
  error:   'text-on-destructive',
};

const variantArrowFill: Record<TooltipVariant, string> = {
  default: 'fill-[rgb(var(--color-bg-surface))]',
  info:    'fill-[rgb(var(--color-bg-info))]',
  warning: 'fill-[rgb(var(--color-bg-warning))]',
  error:   'fill-[rgb(var(--color-bg-destructive))]',
};

const variantIcon: Record<TooltipVariant, React.ReactNode | null> = {
  default: null,
  info:    <Info className="h-3.5 w-3.5" />,
  warning: <AlertTriangle className="h-3.5 w-3.5" />,
  error:   <AlertCircle className="h-3.5 w-3.5" />,
};

export function Tooltip({
  title,
  content,
  children,
  variant = 'default',
  side = 'top',
  align = 'center',
  sideOffset = 6,
  delayDuration = 200,
  defaultOpen,
  open,
  onOpenChange,
}: TooltipProps) {
  const hasTitle = title != null && title !== '';

  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
      >
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            className={cn(
              'z-50 max-w-xs',
              'rounded-sm px-4 py-2 text-xs leading-4',
              'shadow-foundation-md',
              'inline-flex items-start gap-1.5',
              'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0',
              'data-[state=delayed-open]:zoom-in-95 data-[state=closed]:zoom-out-95',
              'duration-fast ease-standard',
              variantStyles[variant],
            )}
          >
            {variantIcon[variant] && (
              <span aria-hidden="true" className={cn('shrink-0 pt-px', variantTitleColor[variant])}>
                {variantIcon[variant]}
              </span>
            )}
            <span className="flex min-w-0 flex-col gap-0.5">
              {hasTitle && (
                <span className={cn('font-medium', variantTitleColor[variant])}>
                  {title}
                </span>
              )}
              <span className={cn(hasTitle ? variantBodyColor[variant] : variantTitleColor[variant])}>
                {content}
              </span>
            </span>
            <RadixTooltip.Arrow
              className={cn('drop-shadow-sm', variantArrowFill[variant])}
              width={12}
              height={6}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
