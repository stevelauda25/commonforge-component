import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn.js';

export type TagColor = 'default' | 'gray';

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  color?: TagColor;
  /** Visual "selected/pressed" state. */
  active?: boolean;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  /** Render trailing × button; calls handler on click. */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  removeLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
  children: React.ReactNode;
}

const containerByColor: Record<TagColor, string> = {
  default: 'bg-surface border-default hover:bg-muted',
  gray:    'bg-muted   border-default hover:bg-muted',
};

const activeByColor: Record<TagColor, string> = {
  default: 'bg-surface border-subtle',
  gray:    'bg-muted   border-subtle',
};

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  function Tag(
    {
      color = 'default',
      active = false,
      disabled = false,
      leadingIcon,
      onRemove,
      removeLabel = 'Remove',
      onClick,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <span
        ref={ref}
        role={onClick && !disabled ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        aria-pressed={onClick ? active : undefined}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onClick}
        onKeyDown={
          onClick && !disabled
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onClick(event as unknown as React.MouseEvent<HTMLSpanElement>);
                }
              }
            : undefined
        }
        className={cn(
          'inline-flex items-center justify-center gap-1',
          'rounded-sm border px-2 py-1 text-xs leading-[18px]',
          'transition-colors duration-fast ease-standard',
          disabled
            ? 'cursor-not-allowed bg-disabled border-default text-disabled'
            : active
              ? cn(activeByColor[color], 'text-strong')
              : cn(containerByColor[color], 'text-muted', onClick && 'cursor-pointer'),
          className,
        )}
        {...rest}
      >
        {leadingIcon && (
          <span aria-hidden="true" className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
            {leadingIcon}
          </span>
        )}
        <span className="inline-flex items-center gap-0.5">
          <span className="whitespace-nowrap">{children}</span>
          {onRemove && (
            <button
              type="button"
              aria-label={removeLabel}
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();
                if (!disabled) onRemove(event);
              }}
              className={cn(
                'inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm',
                'transition-colors duration-fast ease-standard',
                disabled
                  ? 'cursor-not-allowed text-disabled'
                  : 'cursor-pointer text-muted hover:text-strong',
              )}
            >
              <X className="h-3 w-3" strokeWidth={2} />
            </button>
          )}
        </span>
      </span>
    );
  },
);
