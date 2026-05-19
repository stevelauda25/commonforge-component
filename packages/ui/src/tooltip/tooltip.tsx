import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/cn.js';

export type TooltipVariant = 'default' | 'info' | 'warning' | 'error';
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  variant?: TooltipVariant;
  side?: TooltipSide;
  sideOffset?: number;
  delayDuration?: number;
  /** Render tooltip content even if disabled (still won't trigger on disabled buttons). */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const variantStyles: Record<TooltipVariant, string> = {
  default:
    'bg-inverse text-inverse',
  info:
    'bg-info text-on-info',
  warning:
    'bg-warning text-on-warning',
  error:
    'bg-destructive text-on-destructive',
};

const variantIcon: Record<TooltipVariant, React.ReactNode | null> = {
  default: null,
  info:    <Info className="h-3.5 w-3.5" />,
  warning: <AlertTriangle className="h-3.5 w-3.5" />,
  error:   <AlertCircle className="h-3.5 w-3.5" />,
};

/**
 * Tooltip wrapper over Radix primitives. Must wrap a single focusable element
 * (button, anchor, etc). Accessibility — keyboard focus & Escape — is handled
 * by Radix. We only style.
 */
export function Tooltip({
  content,
  children,
  variant = 'default',
  side = 'top',
  sideOffset = 6,
  delayDuration = 200,
  defaultOpen,
  open,
  onOpenChange,
}: TooltipProps) {
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
            sideOffset={sideOffset}
            className={cn(
              'z-50 max-w-xs',
              'rounded-md px-2.5 py-1.5 text-xs font-medium leading-snug',
              'shadow-foundation-md',
              'inline-flex items-center gap-1.5',
              'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0',
              'data-[state=delayed-open]:zoom-in-95 data-[state=closed]:zoom-out-95',
              'duration-fast ease-standard',
              variantStyles[variant],
            )}
          >
            {variantIcon[variant] && (
              <span aria-hidden="true" className="shrink-0">
                {variantIcon[variant]}
              </span>
            )}
            <span>{content}</span>
            <RadixTooltip.Arrow
              className={cn(
                'fill-current',
                variant === 'default' && 'text-default',
                variant === 'info' && 'text-info',
                variant === 'warning' && 'text-warning',
                variant === 'error' && 'text-destructive',
              )}
              width={10}
              height={5}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
