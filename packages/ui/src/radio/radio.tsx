import * as React from 'react';
import { cn } from '../lib/cn.js';

export type RadioSize = 'sm' | 'md';

export interface RadioProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size' | 'onChange'
  > {
  size?: RadioSize;
  label?: React.ReactNode;
  description?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}

let radioIdCounter = 0;
const nextId = () => `pod-radio-${++radioIdCounter}`;

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio(
    {
      size = 'sm',
      label,
      description,
      disabled,
      id,
      className,
      onCheckedChange,
      ...rest
    },
    ref,
  ) {
    const reactId = React.useId?.() ?? '';
    const inputId = React.useMemo(() => id ?? reactId ?? nextId(), [id, reactId]);
    const descriptionId = description ? `${inputId}-desc` : undefined;

    const isMd = size === 'md';

    return (
      <div
        className={cn(
          'flex items-start',
          isMd ? 'gap-3' : 'gap-2',
          className,
        )}
      >
        <span className="relative inline-flex shrink-0 items-center justify-center pt-0.5">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            disabled={disabled}
            aria-describedby={descriptionId}
            onChange={(event) => onCheckedChange?.(event.target.checked)}
            className={cn(
              'peer appearance-none shrink-0 rounded-full border',
              'transition-colors duration-fast ease-standard',
              isMd ? 'h-5 w-5' : 'h-4 w-4',
              'bg-canvas border-subtle',
              'hover:bg-muted hover:border-inverse',
              'checked:bg-canvas checked:border-inverse',
              'checked:hover:bg-muted',
              'focus-visible:outline-none focus-visible:border-inverse',
              'focus-visible:shadow-[0_0_0_4px_rgba(143,143,143,0.2)]',
              'disabled:bg-disabled disabled:border-disabled disabled:cursor-not-allowed',
              'disabled:hover:bg-disabled disabled:hover:border-disabled',
              'checked:disabled:bg-canvas',
            )}
            {...rest}
          />
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute rounded-full bg-inverse',
              'opacity-0 transition-opacity duration-fast ease-standard',
              'peer-checked:opacity-100',
              'peer-disabled:peer-checked:bg-[rgb(var(--color-text-disabled))]',
              isMd ? 'h-2 w-2' : 'h-1.5 w-1.5',
            )}
          />
        </span>

        {(label || description) && (
          <div className="flex min-w-0 flex-col gap-0.5">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  'select-none font-medium',
                  isMd ? 'text-base leading-5' : 'text-sm leading-[18px]',
                  disabled ? 'cursor-not-allowed text-disabled' : 'cursor-pointer text-strong',
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <span
                id={descriptionId}
                className={cn(
                  isMd ? 'text-sm leading-5' : 'text-xs leading-[18px]',
                  disabled ? 'text-disabled' : 'text-muted',
                )}
              >
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);
