import * as React from 'react';
import { Info } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { focusRing } from '../lib/focus-ring.js';

export type TextInputSize = 'sm' | 'md';

export interface TextInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type'
  > {
  /** Visible label above the input. */
  label?: string;
  /** Show a red asterisk next to the label. */
  required?: boolean;
  /** Grey sublabel next to the label, e.g. "(Optional)". */
  sublabel?: string;
  /** Show an info icon next to the label. */
  labelInfo?: boolean;
  /** Hint text below the input. */
  hint?: string;
  /** Error message — replaces hint and applies destructive styling. */
  error?: string;
  /** Icon rendered before the input text. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the input text. */
  rightIcon?: React.ReactNode;
  /** Input size. */
  size?: TextInputSize;
  /** HTML input type. */
  type?: React.HTMLInputTypeAttribute;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      label,
      required,
      sublabel,
      labelInfo,
      hint,
      error,
      leftIcon,
      rightIcon,
      size = 'md',
      type = 'text',
      disabled,
      className,
      id,
      ...rest
    },
    ref,
  ) {
    const reactId = React.useId?.() ?? '';
    const inputId = id ?? reactId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-err` : undefined;

    const paddingClass = size === 'sm' ? 'p-2' : 'p-3';

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <div className="flex items-center gap-px">
            <span className="text-sm font-normal leading-5 text-text-primary">
              {label}
            </span>
            {required && (
              <span className="text-sm font-normal leading-5 text-danger">*</span>
            )}
            {sublabel && (
              <span className="text-sm font-normal leading-5 text-text-muted">
                {sublabel}
              </span>
            )}
            {labelInfo && (
              <Info className="ml-0.5 h-3 w-3 text-text-muted" aria-hidden="true" />
            )}
          </div>
        )}

        <div
          className={cn(
            'group flex items-center gap-2',
            'rounded-md border bg-canvas',
            paddingClass,
            'shadow-foundation-xs',
            'transition-colors duration-fast ease-standard',
            error
              ? 'border-danger focus-within:ring-2 focus-within:ring-danger focus-within:ring-offset-2 focus-within:ring-offset-canvas'
              : 'border-border-default hover:border-border-strong focus-within:border-border-focus focus-within:ring-2 focus-within:ring-border-focus focus-within:ring-offset-2 focus-within:ring-offset-canvas',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          {leftIcon && (
            <span aria-hidden="true" className="shrink-0 text-text-muted">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId ?? hintId}
            className={cn(
              'min-w-0 flex-1 bg-transparent outline-none',
              'text-[13px] leading-[18px] text-text-primary placeholder:text-text-disabled',
              'disabled:cursor-not-allowed',
            )}
            {...rest}
          />

          {rightIcon && (
            <span aria-hidden="true" className="shrink-0 text-text-muted">
              {rightIcon}
            </span>
          )}
        </div>

        {error ? (
          <span id={errorId} className="flex items-center gap-1 text-[13px] leading-[18px] text-danger">
            <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </span>
        ) : hint ? (
          <span id={hintId} className="flex items-center gap-1 text-[13px] leading-[18px] text-text-muted">
            <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {hint}
          </span>
        ) : null}
      </div>
    );
  },
);
