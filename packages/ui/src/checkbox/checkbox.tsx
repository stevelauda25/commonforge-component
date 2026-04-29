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
      <div className={cn('flex items-start gap-2.5', className)}>
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
              'h-4 w-4 rounded-sm border',
              'transition-colors duration-fast ease-standard',
              'bg-surface border-border-strong',
              'checked:bg-accent checked:border-accent',
              'indeterminate:bg-accent indeterminate:border-accent',
              'hover:border-text-secondary',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border-strong',
              error && 'border-danger hover:border-danger',
              focusRing,
            )}
            {...rest}
          />
          {(isChecked || isIndeterminate) && (
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-0 flex items-center justify-center',
                'text-accent-fg',
              )}
            >
              {isIndeterminate ? (
                <Minus className="h-3 w-3" strokeWidth={3} />
              ) : (
                <Check className="h-3 w-3" strokeWidth={3} />
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
                  disabled ? 'text-text-disabled cursor-not-allowed' : 'text-text-primary cursor-pointer',
                )}
              >
                {label}
              </label>
            )}
            {description && !error && (
              <span
                id={descriptionId}
                className="text-xs text-text-muted"
              >
                {description}
              </span>
            )}
            {error && (
              <span id={errorId} className="text-xs text-danger">
                {error}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);
