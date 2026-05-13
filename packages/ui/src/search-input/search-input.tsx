import * as React from 'react';
import { Info, Search, X } from 'lucide-react';
import { cn } from '../lib/cn.js';

export type SearchInputSize = 'sm' | 'md';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Visible label above the input. */
  label?: string;
  /** Hint text below the input (info icon prepended). */
  hint?: string;
  /** Error message — replaces hint and applies destructive styling. */
  error?: string;
  /** Input size. `md` = 12px padding, `sm` = 8px padding. */
  size?: SearchInputSize;
  /**
   * Keyboard shortcut keys shown on the right while input is empty.
   * Pass `null` to hide. Default `['⌘', 'K']`. Visual only — wiring the
   * actual shortcut (e.g. focusing on `⌘K`) is the consumer's job.
   */
  shortcutKeys?: string[] | null;
  /**
   * If provided, an `X` clear button appears when the input has a value.
   * Without `onClear`, no clear button renders.
   */
  onClear?: () => void;
  /** Override left icon. Defaults to `<Search />`. */
  leftIcon?: React.ReactNode;
}

/* Focus-ring shadows — literal values from Figma
   (focus-rings/ring-{gray,error}/ring-*-s). Same as TextInput. */
const FOCUS_RING_GRAY = 'focus-within:shadow-[0_0_0_2px_rgba(143,143,143,0.20)]';
const FOCUS_RING_ERROR = 'focus-within:shadow-[0_0_0_2px_rgba(239,73,67,0.24)]';

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      label,
      hint,
      error,
      size = 'md',
      shortcutKeys = ['⌘', 'K'],
      onClear,
      leftIcon,
      disabled,
      className,
      id,
      placeholder = 'Search...',
      value: valueProp,
      defaultValue,
      onChange,
      ...rest
    },
    ref,
  ) {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<string>(
      defaultValue !== undefined ? String(defaultValue) : '',
    );
    const effectiveValue = isControlled ? String(valueProp ?? '') : internalValue;
    const isEmpty = effectiveValue.length === 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) setInternalValue('');
      onClear?.();
    };

    const reactId = React.useId?.() ?? '';
    const inputId = id ?? reactId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-err` : undefined;

    const paddingClass = size === 'sm' ? 'p-2' : 'p-3';
    const showShortcut = !disabled && isEmpty && shortcutKeys != null && shortcutKeys.length > 0;
    const showClear = !disabled && !isEmpty && !!onClear;

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <span className="text-sm font-normal leading-5 text-text-primary">
            {label}
          </span>
        )}

        <div
          className={cn(
            'flex items-center gap-2 rounded-md border bg-canvas shadow-foundation-xs overflow-hidden',
            'transition-[box-shadow,border-color,background-color] duration-fast ease-standard',
            paddingClass,
            error
              ? cn('border-danger', FOCUS_RING_ERROR)
              : cn(
                  'border-border-default',
                  'hover:border-experiment-input-stroke-active',
                  'focus-within:border-experiment-input-stroke-active',
                  'focus-within:bg-experiment-input-bg-focused',
                  FOCUS_RING_GRAY,
                ),
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <span className="shrink-0 text-text-muted" aria-hidden="true">
            {leftIcon ?? <Search className="h-4 w-4" />}
          </span>
          <input
            ref={ref}
            id={inputId}
            type="search"
            value={isControlled ? (valueProp as string | number | readonly string[] | undefined) : undefined}
            defaultValue={!isControlled ? defaultValue : undefined}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId ?? hintId}
            className={cn(
              'min-w-0 flex-1 bg-transparent outline-none',
              'text-[13px] leading-[18px] text-text-primary placeholder:text-text-disabled',
              'disabled:cursor-not-allowed',
              // Suppress browser-native clear button — we render our own controlled variant.
              '[&::-webkit-search-cancel-button]:appearance-none',
            )}
            {...rest}
          />
          {showShortcut && (
            <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
              {shortcutKeys.map((k, i) => (
                <kbd
                  key={`${k}-${i}`}
                  className="inline-flex items-center justify-center rounded-xs bg-experiment-zinc-700 px-1.5 text-[13px] leading-[18px] text-text-muted"
                >
                  {k}
                </kbd>
              ))}
            </div>
          )}
          {showClear && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              aria-label="Clear search"
              className="shrink-0 text-text-muted transition-colors duration-fast ease-standard hover:text-text-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {error ? (
          <span
            id={errorId}
            className="flex items-center gap-1 text-[13px] leading-[18px] text-danger"
          >
            <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </span>
        ) : hint ? (
          <span
            id={hintId}
            className="flex items-center gap-1 text-[13px] leading-[18px] text-text-muted"
          >
            <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {hint}
          </span>
        ) : null}
      </div>
    );
  },
);
