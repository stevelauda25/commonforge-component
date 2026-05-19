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

/* Per-variant input formatters. Strip invalid chars + apply mask. Idempotent. */
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  return `${digits.slice(0, 2)} / ${digits.slice(2, 4)} / ${digits.slice(4)}`;
}

function formatAmount(raw: string): string {
  let cleaned = raw.replace(/[^\d.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot !== -1) {
    cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
  }
  const [integer = '', decimal = ''] = cleaned.split('.');
  const formattedInt = integer.slice(0, 15).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (firstDot === -1) return formattedInt;
  return `${formattedInt}.${decimal.slice(0, 2)}`;
}

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
      className="shrink-0 text-muted hover:text-default disabled:cursor-not-allowed"
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
        'flex shrink-0 items-center gap-2 text-[13px] leading-[18px] text-default',
        'disabled:cursor-not-allowed',
        paddingClass,
      )}
      aria-label={`${label} (selection coming with Select primitive)`}
    >
      <span aria-hidden="true">{flag}</span>
      <span>{label}</span>
      <ChevronDown className="h-3 w-3 text-muted" aria-hidden="true" />
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
      value: valueProp,
      defaultValue,
      onChange: onChangeProp,
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

    const formatter =
      variant === 'phone'  ? formatPhone  :
      variant === 'date'   ? formatDate   :
      variant === 'amount' ? formatAmount :
      null;

    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<string>(() => {
      if (!formatter) return defaultValue !== undefined ? String(defaultValue) : '';
      return defaultValue !== undefined ? formatter(String(defaultValue)) : '';
    });

    const valueProps = formatter
      ? {
          value: formatter(String(isControlled ? valueProp ?? '' : internalValue)),
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const formatted = formatter(e.target.value);
            if (!isControlled) setInternalValue(formatted);
            if (onChangeProp) {
              e.target.value = formatted;
              onChangeProp(e);
            }
          },
        }
      : {
          value: valueProp,
          defaultValue,
          onChange: onChangeProp,
        };

    const inputMode: React.InputHTMLAttributes<HTMLInputElement>['inputMode'] =
      variant === 'phone'  ? 'tel'      :
      variant === 'date'   ? 'numeric'  :
      variant === 'amount' ? 'decimal'  :
      undefined;

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
          'border-default',
          'hover:border-subtle',
          'focus-within:border-subtle',
          'focus-within:bg-subtle',
          FOCUS_RING_GRAY,
        );

    const containerLayout = isCompound
      ? 'items-stretch'
      : cn('items-center gap-2', paddingClass);

    const inputClassName = cn(
      'min-w-0 flex-1 bg-transparent outline-none',
      'text-[13px] leading-[18px] text-default placeholder:text-disabled',
      'disabled:cursor-not-allowed',
    );

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <div className="flex items-center gap-px">
            <span className="text-sm font-normal leading-5 text-default">
              {label}
            </span>
            {required && (
              <span className="text-sm font-normal leading-5 text-destructive">*</span>
            )}
            {sublabel && (
              <span className="text-sm font-normal leading-5 text-muted">
                {sublabel}
              </span>
            )}
            {labelInfo && (
              <Info className="ml-0.5 h-3 w-3 text-muted" aria-hidden="true" />
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
                  'flex flex-1 min-w-0 items-center gap-2 border-l border-default',
                  paddingClass,
                )}
              >
                <input
                  ref={ref}
                  id={inputId}
                  type={effectiveType}
                  inputMode={inputMode}
                  disabled={disabled}
                  placeholder={effectivePlaceholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={errorId ?? hintId}
                  className={inputClassName}
                  {...rest}
                  {...valueProps}
                />
              </div>
            </>
          )}

          {variant === 'amount' && (
            <>
              <div
                className={cn(
                  'flex flex-1 min-w-0 items-center gap-2 border-r border-default',
                  paddingClass,
                )}
              >
                <span
                  className="shrink-0 text-[13px] leading-[18px] text-muted"
                  aria-hidden="true"
                >
                  $
                </span>
                <input
                  ref={ref}
                  id={inputId}
                  type={effectiveType}
                  inputMode={inputMode}
                  disabled={disabled}
                  placeholder={effectivePlaceholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={errorId ?? hintId}
                  className={inputClassName}
                  {...rest}
                  {...valueProps}
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
                <span className="shrink-0 text-muted">
                  {effectiveLeftIcon}
                </span>
              )}
              <input
                ref={ref}
                id={inputId}
                type={effectiveType}
                inputMode={inputMode}
                disabled={disabled}
                placeholder={effectivePlaceholder}
                aria-invalid={error ? true : undefined}
                aria-describedby={errorId ?? hintId}
                className={inputClassName}
                {...rest}
                {...valueProps}
              />
              {effectiveRightIcon && (
                <span className="shrink-0 text-muted">
                  {effectiveRightIcon}
                </span>
              )}
            </>
          )}
        </div>

        {error ? (
          <span id={errorId} className="flex items-center gap-1 text-[13px] leading-[18px] text-destructive">
            <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </span>
        ) : hint ? (
          <span id={hintId} className="flex items-center gap-1 text-[13px] leading-[18px] text-muted">
            <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {hint}
          </span>
        ) : null}
      </div>
    );
  },
);
