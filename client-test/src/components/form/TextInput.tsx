import * as React from 'react';
import { cn } from 'pod-test-ui';

// LOCAL — pod-test-ui has no generic <Input>. Built here per CLAUDE.md Rule 10
// using POD semantic tokens (bg-surface, border-border-default, text-text-primary).
// Promote upstream once design system ships an Input primitive.

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
  invalid?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ prefix, suffix, error, invalid, className, disabled, ...rest }, ref) {
    const isInvalid = invalid || !!error;

    return (
      <div
        className={cn(
          'flex h-9 items-center gap-2 rounded-md border bg-surface px-3',
          'text-sm text-text-primary',
          'transition-colors duration-fast ease-standard',
          'focus-within:border-border-focus focus-within:ring-2 focus-within:ring-border-focus/30',
          isInvalid
            ? 'border-danger focus-within:border-danger focus-within:ring-danger/30'
            : 'border-border-default hover:border-border-strong',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
      >
        {prefix && (
          <span className="shrink-0 text-text-muted text-sm" aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          className={cn(
            'min-w-0 flex-1 bg-transparent outline-none',
            'placeholder:text-text-disabled',
            'disabled:cursor-not-allowed',
          )}
          {...rest}
        />
        {suffix && (
          <span className="shrink-0 text-text-muted text-sm" aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
    );
  },
);
