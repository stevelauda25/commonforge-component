import * as React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { focusRing } from '../lib/focus-ring.js';

export type CheckboxChecked = boolean | 'indeterminate';

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'checked' | 'onChange' | 'size'
  > {
  checked: CheckboxChecked;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
}

let checkboxIdCounter = 0;
const nextId = () => `pod-checkbox-${++checkboxIdCounter}`;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      checked,
      onCheckedChange,
      label,
      description,
      error,
      disabled,
      id,
      className,
      ...rest
    },
    ref,
  ) {
    const reactId = React.useId?.() ?? '';
    const inputId = React.useMemo(() => id ?? reactId ?? nextId(), [id, reactId]);
    const descriptionId = description ? `${inputId}-desc` : undefined;
    const errorId = error ? `${inputId}-err` : undefined;

    const isIndeterminate = checked === 'indeterminate';
    const isChecked = checked === true;

    const internalRef = React.useRef<HTMLInputElement | null>(null);
    const setRefs = (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = isIndeterminate;
      }
    }, [isIndeterminate]);

    return (
      <div className={cn('flex gap-2.5', description || error ? 'items-start' : 'items-center', className)}>
        <span className="relative inline-flex items-center justify-center">
          <input
            ref={setRefs}
            id={inputId}
            type="checkbox"
            checked={isChecked}
            disabled={disabled}
            aria-describedby={cn(descriptionId, errorId) || undefined}
            aria-invalid={error ? true : undefined}
            onChange={(event) => onCheckedChange?.(event.target.checked)}
            className={cn(
              'peer appearance-none shrink-0',
              'h-4 w-4 rounded-xs border-[1.5px]',
              'transition-colors duration-fast ease-standard',
              'bg-canvas border-strong shadow-foundation-xs',
              'checked:bg-inverse checked:border-inverse checked:shadow-none',
              'indeterminate:bg-inverse indeterminate:border-inverse indeterminate:shadow-none',
              'hover:border-inverse',
              'disabled:bg-disabled disabled:border-disabled disabled:shadow-none disabled:cursor-not-allowed',
              'disabled:hover:border-disabled',
              error && 'border-error hover:border-error',
              focusRing,
            )}
            {...rest}
          />
          {(isChecked || isIndeterminate) && (
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-0 flex items-center justify-center',
                'text-inverse peer-disabled:text-icon-disabled',
              )}
            >
              {isIndeterminate ? (
                <Minus className="h-2.5 w-2.5" strokeWidth={3.5} />
              ) : (
                <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
              )}
            </span>
          )}
        </span>

        {(label || description || error) && (
          <div className="flex min-w-0 flex-col gap-0.5">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  'text-sm leading-none font-medium select-none',
                  disabled ? 'text-disabled cursor-not-allowed' : 'text-default cursor-pointer',
                )}
              >
                {label}
              </label>
            )}
            {description && !error && (
              <span
                id={descriptionId}
                className="text-xs text-muted"
              >
                {description}
              </span>
            )}
            {error && (
              <span id={errorId} className="text-xs text-destructive">
                {error}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);
