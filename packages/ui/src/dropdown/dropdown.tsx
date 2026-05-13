import * as React from 'react';
import { Check, ChevronDown, ChevronUp, Info, X } from 'lucide-react';
import { cn } from '../lib/cn.js';

export type DropdownVariant = 'default' | 'tags';
export type DropdownSize = 'sm' | 'md';

/* ════════════════════════════════════════════════════════════════════
 * DropdownMenu — popover container for dropdown items.
 * Drop next to your trigger inside a relative wrapper, or wire to your
 * preferred floating-ui / popper library.
 * ════════════════════════════════════════════════════════════════════ */

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cap inner scroll area; menu grows up to this height. Default 320px. */
  maxHeight?: number;
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropdownMenu({ children, maxHeight = 320, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="listbox"
        className={cn(
          'overflow-hidden rounded-md border border-border-default bg-canvas shadow-foundation-lg',
          'flex flex-col',
          // POD motion: reveal with quick scale + fade. origin-top so the scale
          // grows down from the trigger edge instead of expanding from center.
          'origin-top animate-menu-in',
          className,
        )}
        {...rest}
      >
        <div className="flex flex-col overflow-y-auto py-1" style={{ maxHeight }}>
          {children}
        </div>
      </div>
    );
  },
);

/* ════════════════════════════════════════════════════════════════════
 * DropdownItem — single row inside a DropdownMenu.
 * Supports: leading adornment (icon / checkbox / badge), label,
 * trailing adornment (e.g. check mark), selected state, disabled,
 * destructive (red text), error.
 * ════════════════════════════════════════════════════════════════════ */

export type DropdownItemState = 'default' | 'selected' | 'disabled' | 'error';

export interface DropdownItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: React.ReactNode;
  /** Visual selected state (e.g. for radio-style picker). Doesn't auto-render a check mark. */
  selected?: boolean;
  /** Red destructive style (e.g. Delete action). */
  destructive?: boolean;
  /** Error variant (red text + lighter red bg). */
  error?: boolean;
  /** Leading adornment — icon, checkbox, or badge. */
  leftAdornment?: React.ReactNode;
  /** Trailing adornment — typically a check mark when `selected`. */
  rightAdornment?: React.ReactNode;
  /** Auto-render a trailing check when `selected` is true (no explicit rightAdornment). */
  showSelectedMark?: boolean;
}

export const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  function DropdownItem(
    {
      children,
      selected = false,
      destructive = false,
      error = false,
      disabled = false,
      leftAdornment,
      rightAdornment,
      showSelectedMark = false,
      className,
      onClick,
      ...rest
    },
    ref,
  ) {
    const colorClass = destructive || error ? 'text-danger' : 'text-text-primary';
    const trailing =
      rightAdornment !== undefined
        ? rightAdornment
        : selected && showSelectedMark
          ? <Check className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
          : null;

    return (
      <div className="px-1.5 py-0.5">
        <button
          ref={ref}
          type="button"
          role="option"
          aria-selected={selected || undefined}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={onClick}
          className={cn(
            'flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-[13px] leading-[18px]',
            'transition-colors duration-fast ease-standard',
            // Suppress browser default focus outline; use focus-visible: only
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus/40',
            colorClass,
            !disabled && (
              selected
                ? 'bg-muted'
                : error
                  ? 'hover:bg-danger-subtle'
                  : 'hover:bg-muted'
            ),
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
          {...rest}
        >
          {leftAdornment !== undefined && <span className="shrink-0">{leftAdornment}</span>}
          <span className="min-w-0 flex-1 truncate">{children}</span>
          {trailing}
        </button>
      </div>
    );
  },
);

/* ════════════════════════════════════════════════════════════════════
 * DropdownBadge — small mono label badge with leading colored bar.
 * Used inside DropdownItem as a leading adornment (e.g. betting books:
 * CIRC, NOVG, PINY, FNDL, etc.). Colors match Figma's 9 categories.
 * ════════════════════════════════════════════════════════════════════ */

export type DropdownBadgeColor =
  | 'green'
  | 'blue'
  | 'orange'
  | 'lime'
  | 'indigo'
  | 'red'
  | 'sky'
  | 'purple'
  | 'yellow';

export interface DropdownBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  color?: DropdownBadgeColor;
}

const BADGE_BG: Record<DropdownBadgeColor, string> = {
  green:  'bg-green-950/60 text-green-100',
  blue:   'bg-blue-950/60 text-blue-100',
  orange: 'bg-orange-950/60 text-orange-100',
  lime:   'bg-lime-950/60 text-lime-100',
  indigo: 'bg-indigo-950/60 text-indigo-100',
  red:    'bg-red-950/60 text-red-100',
  sky:    'bg-sky-950/60 text-sky-100',
  purple: 'bg-purple-950/60 text-purple-100',
  yellow: 'bg-yellow-950/60 text-yellow-100',
};

const BADGE_DOT: Record<DropdownBadgeColor, string> = {
  green:  'bg-green-500',
  blue:   'bg-blue-500',
  orange: 'bg-orange-500',
  lime:   'bg-lime-500',
  indigo: 'bg-indigo-500',
  red:    'bg-red-500',
  sky:    'bg-sky-500',
  purple: 'bg-purple-500',
  yellow: 'bg-yellow-500',
};

export function DropdownBadge({ label, color = 'green', className, ...rest }: DropdownBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-xs px-1 py-0.5',
        BADGE_BG[color],
        className,
      )}
      {...rest}
    >
      <span className={cn('inline-block h-2.5 w-[3px] rounded-full', BADGE_DOT[color])} aria-hidden="true" />
      <span className="font-mono text-[13px] font-medium leading-4 tracking-wide">{label}</span>
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * Dropdown — main trigger. Stateless: pair with DropdownMenu for popup.
 * ════════════════════════════════════════════════════════════════════ */

export interface DropdownTag {
  /** Visible label inside the chip (uppercase / mono in Figma — pass display string as-is). */
  label: string;
  /** Stable identifier passed back to `onRemoveTag`. */
  value: string;
}

export interface DropdownProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'value'> {
  /** Visible label above the trigger. */
  label?: string;
  /** Show a red asterisk next to the label. */
  required?: boolean;
  /** Grey sublabel next to the label, e.g. "(Optional)". */
  sublabel?: string;
  /** Show an info icon next to the label. */
  labelInfo?: boolean;
  /** Hint text below the trigger (info icon prepended). */
  hint?: string;
  /** Error message — replaces hint and applies destructive styling. */
  error?: string;
  /** Padding scale: `md` (default) = 12px py, `sm` = 8px py. */
  size?: DropdownSize;
  /** Visual variant — `default` shows text, `tags` shows chips. */
  variant?: DropdownVariant;
  /** For `default` variant: visible selected text. Falls back to placeholder if undefined. */
  selectedLabel?: string;
  /** Placeholder when nothing selected (or when tags empty). */
  placeholder?: string;
  /** For `tags` variant: list of selected items rendered as removable chips. */
  tags?: DropdownTag[];
  /** Called when user clicks the `X` on a chip (tags variant only). */
  onRemoveTag?: (value: string) => void;
  /**
   * Whether the dropdown menu is open. Component is otherwise stateless —
   * `open` flips the chevron and locks the border to "active". Consumer
   * controls actual menu visibility.
   */
  open?: boolean;
}

// Focus-ring shadows — literal values from Figma `focus-rings` tokens.
const FOCUS_RING_GRAY = 'focus-visible:shadow-[0_0_0_2px_rgba(143,143,143,0.20)]';
const FOCUS_RING_ERROR = 'focus-visible:shadow-[0_0_0_2px_rgba(239,73,67,0.24)]';

export const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  function Dropdown(
    {
      label,
      required,
      sublabel,
      labelInfo,
      hint,
      error,
      size = 'md',
      variant = 'default',
      selectedLabel,
      placeholder = 'Select',
      tags = [],
      onRemoveTag,
      open = false,
      disabled,
      className,
      id,
      ...rest
    },
    ref,
  ) {
    const reactId = React.useId?.() ?? '';
    const triggerId = id ?? reactId;
    const hintId = hint ? `${triggerId}-hint` : undefined;
    const errorId = error ? `${triggerId}-err` : undefined;

    const isTagsVariant = variant === 'tags';
    const isFilled = isTagsVariant ? tags.length > 0 : Boolean(selectedLabel);
    const paddingY = size === 'sm' ? 'py-2' : 'py-2.5';
    const ChevronIcon = open ? ChevronUp : ChevronDown;

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <div className="flex items-center gap-px">
            <span className="text-sm font-normal leading-5 text-text-primary">{label}</span>
            {required && (
              <span className="text-sm font-normal leading-5 text-danger">*</span>
            )}
            {sublabel && (
              <span className="text-sm font-normal leading-5 text-text-muted">{sublabel}</span>
            )}
            {labelInfo && (
              <Info className="ml-0.5 h-3 w-3 text-text-muted" aria-hidden="true" />
            )}
          </div>
        )}

        <button
          ref={ref}
          id={triggerId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId ?? hintId}
          className={cn(
            'flex w-full items-center gap-2 rounded-md border bg-canvas px-3 text-left shadow-foundation-xs',
            'transition-[box-shadow,border-color,background-color] duration-fast ease-standard',
            // Suppress native :focus blue outline — POD uses :focus-visible only.
            'focus:outline-none',
            paddingY,
            disabled && 'cursor-not-allowed opacity-50',
            !disabled && (
              error
                ? cn('border-danger', FOCUS_RING_ERROR)
                : open
                  ? cn(
                      'border-experiment-input-stroke-active',
                      'bg-experiment-input-bg-focused',
                      FOCUS_RING_GRAY,
                    )
                  : cn(
                      'border-border-default',
                      'hover:border-experiment-input-stroke-active',
                      'focus-visible:border-experiment-input-stroke-active',
                      FOCUS_RING_GRAY,
                    )
            ),
          )}
          {...rest}
        >
          {isTagsVariant ? (
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              {tags.length === 0 && (
                <span className="text-[13px] leading-[18px] text-text-muted">{placeholder}</span>
              )}
              {tags.map((t) => (
                <span
                  key={t.value}
                  className="inline-flex items-center gap-0.5 rounded-xs bg-muted px-1 py-0.5"
                >
                  <span className="font-mono text-[13px] leading-4 text-text-muted">{t.label}</span>
                  {onRemoveTag && !disabled && (
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTag(t.value);
                      }}
                      aria-label={`Remove ${t.label}`}
                      className="ml-0.5 inline-flex items-center justify-center text-text-muted transition-colors duration-fast ease-standard hover:text-text-primary focus:outline-none"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <span
              className={cn(
                'min-w-0 flex-1 truncate text-[13px] leading-[18px]',
                isFilled ? 'text-text-primary' : 'text-text-muted',
              )}
            >
              {selectedLabel ?? placeholder}
            </span>
          )}
          <ChevronIcon className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
        </button>

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
