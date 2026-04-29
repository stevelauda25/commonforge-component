import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { focusRing } from '../lib/focus-ring.js';

export type SearchInputSize = 'sm' | 'md';

export interface SearchInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size' | 'onChange' | 'value'
  > {
  value: string;
  onValueChange: (value: string) => void;
  clearable?: boolean;
  leftIcon?: React.ReactNode;
  size?: SearchInputSize;
  error?: string;
  clearLabel?: string;
}

const sizeClasses: Record<SearchInputSize, { container: string; input: string }> = {
  sm: { container: 'h-8',  input: 'text-sm' },
  md: { container: 'h-9',  input: 'text-base' },
};

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      value,
      onValueChange,
      clearable = true,
      leftIcon,
      size = 'md',
      error,
      disabled,
      placeholder = 'Search…',
      className,
      clearLabel = 'Clear search',
      id,
      ...rest
    },
    ref,
  ) {
    const reactId = React.useId?.() ?? '';
    const inputId = id ?? reactId;
    const errorId = error ? `${inputId}-err` : undefined;
    const showClear = clearable && value.length > 0 && !disabled;

    const internalRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <div
          className={cn(
            'group flex items-center gap-2',
            'rounded-md border bg-surface',
            'transition-colors duration-fast ease-standard',
            'px-2.5',
            sizeClasses[size].container,
            error
              ? 'border-danger focus-within:ring-2 focus-within:ring-danger focus-within:ring-offset-2 focus-within:ring-offset-canvas'
              : 'border-border-default hover:border-border-strong focus-within:border-border-focus focus-within:ring-2 focus-within:ring-border-focus focus-within:ring-offset-2 focus-within:ring-offset-canvas',
            disabled && 'opacity-50 cursor-not-allowed bg-muted',
          )}
        >
          <span
            aria-hidden="true"
            className="shrink-0 text-text-muted group-focus-within:text-text-secondary"
          >
            {leftIcon ?? <Search className="h-4 w-4" />}
          </span>

          <input
            ref={setRefs}
            id={inputId}
            type="search"
            role="searchbox"
            value={value}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder={placeholder}
            className={cn(
              'min-w-0 flex-1 bg-transparent outline-none',
              'text-text-primary placeholder:text-text-muted',
              'disabled:cursor-not-allowed',
              // Remove the native clear button from `type=search` — we render our own.
              '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
              sizeClasses[size].input,
            )}
            {...rest}
          />

          {showClear && (
            <button
              type="button"
              aria-label={clearLabel}
              onClick={() => {
                onValueChange('');
                internalRef.current?.focus();
              }}
              className={cn(
                'shrink-0 inline-flex items-center justify-center',
                'h-5 w-5 rounded-sm',
                'text-text-muted hover:text-text-primary hover:bg-muted',
                'transition-colors duration-fast ease-standard',
                focusRing,
              )}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {error && (
          <span id={errorId} className="text-xs text-danger">
            {error}
          </span>
        )}
      </div>
    );
  },
);
