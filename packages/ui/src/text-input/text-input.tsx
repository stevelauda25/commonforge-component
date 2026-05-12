import * as React from 'react';
import { Calendar, ChevronDown, Eye, EyeOff, Info, Lock } from 'lucide-react';
import { cn } from '../lib/cn.js';

export type TextInputSize = 'sm' | 'md';
export type TextInputVariant = 'default' | 'password' | 'phone' | 'date' | 'amount';

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
  /** Icon before the input. Only honored on `default`, `password`, `date` variants. */
  leftIcon?: React.ReactNode;
  /** Icon after the input. Only honored on `default`, `password`, `date` variants. */
  rightIcon?: React.ReactNode;
  /** Input size. `md` = 12px padding, `sm` = 8px padding. */
  size?: TextInputSize;
  /** Semantic variant — sets HTML type + structural adornments + placeholder. */
  variant?: TextInputVariant;
  /** HTML input type. Variant takes precedence for non-default. */
  type?: React.HTMLInputTypeAttribute;
}

/* ──────────────────────────────────────────────────────────────────────────
   Focus-ring shadows — literal values from Figma
   (focus-rings/ring-{gray,error}/ring-*-s).
   ────────────────────────────────────────────────────────────────────────── */
const FOCUS_RING_GRAY  = 'focus-within:shadow-[0_0_0_2px_rgba(143,143,143,0.20)]';
const FOCUS_RING_ERROR = 'focus-within:shadow-[0_0_0_2px_rgba(239,73,67,0.24)]';

function PasswordToggle({
  visible,
  onToggle,
  disabled,
}: {
  visible: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      disabled={disabled}
      aria-label={visible ? 'Hide password' : 'Show password'}
      className="shrink-0 text-text-muted hover:text-text-primary disabled:cursor-not-allowed"
    >
      {visible ? (
        <EyeOff className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Eye className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}

/* Inline pseudo-dropdown cell (Phone country, Amount currency).
   Visual stub — real selection lands when Select primitive ships. */
function CompactSelectCell({
  paddingClass,
  flag,
  label,
  disabled,
}: {
  paddingClass: string;
  flag: string;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      disabled={disabled}
      className={cn(
        'flex shrink-0 items-center gap-2 text-[13px] leading-[18px] text-text-primary',
        'disabled:cursor-not-allowed',
        paddingClass,
      )}
      aria-label={`${label} (selection coming with Select primitive)`}
    >
      <span aria-hidden="true">{flag}</span>
      <span>{label}</span>
      <ChevronDown className="h-3 w-3 text-text-muted" aria-hidden="true" />
    </button>
  );
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
      variant = 'default',
      type,
      disabled,
      className,
      id,
      placeholder,
      ...rest
    },
    ref,
  ) {
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const togglePassword = React.useCallback(
      () => setPasswordVisible((v) => !v),
      [],
    );

    const isCompound = variant === 'phone' || variant === 'amount';
    const paddingClass = size === 'sm' ? 'p-2' : 'p-3';

    const reactId = React.useId?.() ?? '';
    const inputId = id ?? reactId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-err` : undefined;

    // Resolve HTML type + placeholder per variant
    const effectiveType: React.HTMLInputTypeAttribute =
      variant === 'password' ? (passwordVisible ? 'text' : 'password')
      : variant === 'phone'   ? 'tel'
      : variant === 'date'    ? 'text'  // native type='date' ignores `placeholder`; keep text for the DD/MM/YYYY format
      : variant === 'amount'  ? 'text'
      : (type ?? 'text');

    const defaultPlaceholder: string | undefined =
      variant === 'password' ? '••••••••'
      : variant === 'phone'  ? '(555) 000-0000'
      : variant === 'date'   ? 'DD / MM / YYYY'
      : variant === 'amount' ? '0.00'
      : undefined;
    const effectivePlaceholder = placeholder ?? defaultPlaceholder;

    // Default adornments for non-compound variants
    const variantLeftIcon =
      variant === 'password' ? <Lock className="h-4 w-4" aria-hidden="true" /> :
      variant === 'date'     ? <Calendar className="h-4 w-4" aria-hidden="true" /> :
      null;
    const variantRightIcon =
      variant === 'password' ? (
        <PasswordToggle
          visible={passwordVisible}
          onToggle={togglePassword}
          disabled={disabled}
        />
      ) : null;

    const effectiveLeftIcon  = leftIcon  !== undefined ? leftIcon  : variantLeftIcon;
    const effectiveRightIcon = rightIcon !== undefined ? rightIcon : variantRightIcon;

    const containerBase = cn(
      'flex rounded-md border bg-canvas shadow-foundation-xs overflow-hidden',
      'transition-[box-shadow,border-color,background-color] duration-fast ease-standard',
    );

    const containerState = error
      ? cn('border-danger', FOCUS_RING_ERROR)
      : cn(
          'border-experiment-input-stroke-default',
          'hover:border-experiment-input-stroke-active',
          'focus-within:border-experiment-input-stroke-active',
          'focus-within:bg-experiment-input-bg-focused',
          FOCUS_RING_GRAY,
        );

    const containerLayout = isCompound
      ? 'items-stretch'
      : cn('items-center gap-2', paddingClass);

    const inputClassName = cn(
      'min-w-0 flex-1 bg-transparent outline-none',
      'text-[13px] leading-[18px] text-text-primary placeholder:text-text-disabled',
      'disabled:cursor-not-allowed',
    );

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
            containerBase,
            containerState,
            containerLayout,
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          {variant === 'phone' && (
            <>
              <CompactSelectCell
                paddingClass={paddingClass}
                flag="🇺🇸"
                label="+1"
                disabled={disabled}
              />
              <div
                className={cn(
                  'flex flex-1 min-w-0 items-center gap-2 border-l border-experiment-input-stroke-default',
                  paddingClass,
                )}
              >
                <input
                  ref={ref}
                  id={inputId}
                  type={effectiveType}
                  disabled={disabled}
                  placeholder={effectivePlaceholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={errorId ?? hintId}
                  className={inputClassName}
                  {...rest}
                />
              </div>
            </>
          )}

          {variant === 'amount' && (
            <>
              <div
                className={cn(
                  'flex flex-1 min-w-0 items-center gap-2 border-r border-experiment-input-stroke-default',
                  paddingClass,
                )}
              >
                <span
                  className="shrink-0 text-[13px] leading-[18px] text-text-muted"
                  aria-hidden="true"
                >
                  $
                </span>
                <input
                  ref={ref}
                  id={inputId}
                  type={effectiveType}
                  inputMode="decimal"
                  disabled={disabled}
                  placeholder={effectivePlaceholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={errorId ?? hintId}
                  className={inputClassName}
                  {...rest}
                />
              </div>
              <CompactSelectCell
                paddingClass={paddingClass}
                flag="🇺🇸"
                label="USD"
                disabled={disabled}
              />
            </>
          )}

          {!isCompound && (
            <>
              {effectiveLeftIcon && (
                <span className="shrink-0 text-text-muted">
                  {effectiveLeftIcon}
                </span>
              )}
              <input
                ref={ref}
                id={inputId}
                type={effectiveType}
                disabled={disabled}
                placeholder={effectivePlaceholder}
                aria-invalid={error ? true : undefined}
                aria-describedby={errorId ?? hintId}
                className={inputClassName}
                {...rest}
              />
              {effectiveRightIcon && (
                <span className="shrink-0 text-text-muted">
                  {effectiveRightIcon}
                </span>
              )}
            </>
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
