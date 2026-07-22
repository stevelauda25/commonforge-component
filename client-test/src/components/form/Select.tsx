import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from 'cf-ui';

// LOCAL — cf-ui has no <Select>. Built here per CLAUDE.md Rule 10
// using POD semantic tokens. Native <select> for now (no listbox / search).
// Promote upstream once design system ships a Select primitive with floating menu.

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ options, placeholder, error, className, disabled, value, ...rest }, ref) {
    const isInvalid = !!error;
    const isPlaceholder = !value;

    return (
      <div
        className={cn(
          'relative flex h-9 items-center rounded-md border bg-surface',
          'transition-colors duration-fast ease-standard',
          'focus-within:border-border-focus focus-within:ring-2 focus-within:ring-border-focus/30',
          isInvalid
            ? 'border-danger focus-within:border-danger focus-within:ring-danger/30'
            : 'border-border-default hover:border-border-strong',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
      >
        <select
          ref={ref}
          value={value ?? ''}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          className={cn(
            'h-full w-full appearance-none bg-transparent pl-3 pr-9 text-sm outline-none',
            'disabled:cursor-not-allowed',
            isPlaceholder ? 'text-text-disabled' : 'text-text-primary',
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 text-text-muted"
          aria-hidden="true"
        />
      </div>
    );
  },
);
