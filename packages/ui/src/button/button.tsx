import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { focusRing } from '../lib/focus-ring.js';

export type ButtonVariant = 'primary' | 'outline' | 'error';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 ' +
  'font-medium whitespace-nowrap select-none ' +
  'transition-[color,background-color,box-shadow,transform] duration-base ease-press ' +
  'active:scale-[0.96] ' +
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-on-brand ' +
    'outline outline-1 outline-border-brand [outline-offset:-1px] ' +
    'shadow-glow-accent-inset ' +
    'hover:bg-brand-hover ' +
    'hover:shadow-glow-accent-inset-strong ' +
    'active:bg-brand-hover',
  outline:
    'bg-transparent text-muted ' +
    'outline outline-1 outline-border-default [outline-offset:-1px] ' +
    'hover:text-default hover:shadow-glow-accent-inset ' +
    'active:text-default active:shadow-glow-accent-inset',
  // Note: Outline hover bg → see bg-elevated override in className composition below.
  error:
    'bg-destructive text-on-destructive ' +
    'outline outline-1 outline-border-destructive [outline-offset:-1px] ' +
    'shadow-glow-danger-inset ' +
    'hover:shadow-glow-danger-inset-strong ' +
    'active:bg-destructive-hover',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7 px-2 text-xs rounded-lg gap-1',
  sm: 'h-8 px-2.5 text-sm rounded-lg gap-1',
  md: 'h-9 px-2.5 text-sm rounded-lg gap-1',
  lg: 'h-10 px-3 text-base rounded-lg gap-1.5',
};

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7 w-7 p-0 rounded-lg',
  sm: 'h-8 w-8 p-0 rounded-lg',
  md: 'h-9 w-9 p-0 rounded-lg',
  lg: 'h-10 w-10 p-0 rounded-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      iconOnly = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          base,
          focusRing,
          variantClasses[variant],
          iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
          // Outline hover bg = bg-elevated for non-icon-only sizes.
          variant === 'outline' && !iconOnly &&
            'hover:bg-elevated',
          className,
        )}
        {...rest}
      >
        {loading ? (
          <Loader2
            className="h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        ) : (
          leftIcon && (
            <span className="inline-flex shrink-0" aria-hidden="true">
              {leftIcon}
            </span>
          )
        )}
        {!iconOnly && children}
        {iconOnly && !loading && children}
        {!loading && !iconOnly && rightIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);
