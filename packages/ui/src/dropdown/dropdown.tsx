import * as React from 'react';
import { Check, ChevronDown, ChevronUp, Info, X } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { Badge, type BadgeColor } from '../badges/index.js';

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

// Per-item stagger delay — first item fires immediately, each subsequent
// one ~24ms later. Tuned for elegant cascade: tight enough to feel coupled
// to the menu reveal, spaced enough that individual items still register.
const ITEM_STAGGER_MS = 24;

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropdownMenu({ children, maxHeight = 320, className, ...rest }, ref) {
    // Wrap each child in a span carrying its own animation-delay so the items
    // cascade in after the shell. `display: contents` keeps the layout flat —
    // the wrapper exists only so we can attach the staggered animation.
    const staggered = React.Children.map(children, (child, i) => {
      if (!React.isValidElement(child)) return child;
      const delayMs = i * ITEM_STAGGER_MS;
      return (
        <div
          className="animate-menu-item-in"
          style={{ animationDelay: `${delayMs}ms` }}
        >
          {child}
        </div>
      );
    });

    return (
      <div
        ref={ref}
        role="listbox"
        className={cn(
          // bg-surface — Figma bg.surface for dropdown menu container
          'overflow-hidden rounded-md border border-default bg-surface shadow-foundation-lg',
          'flex flex-col',
          // POD motion: 250ms blur+scale+fade reveal. origin-top so the scale
          // grows down from the trigger edge instead of expanding from center.
          'origin-top animate-menu-in',
          className,
        )}
        {...rest}
      >
        <div className="flex flex-col overflow-y-auto py-1" style={{ maxHeight }}>
          {staggered}
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
    const colorClass = destructive || error ? 'text-destructive' : 'text-default';
    const trailing =
      rightAdornment !== undefined
        ? rightAdornment
        : selected && showSelectedMark
          ? <Check className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
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
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
            colorClass,
            !disabled && (
              selected
                ? 'bg-muted'
                : error
                  ? 'hover:bg-destructive-subtle'
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
 * DropdownBadge — thin wrapper around the canonical `Badge` component
 * for use as a DropdownItem leading adornment (e.g. betting books: CIRC,
 * NOVG, PINY, FNDL). Forces `closable={false}` (no × in a menu row) and
 * matches the same 9 chromatic colors `Badge` exposes for consistency
 * across the design system.
 * ════════════════════════════════════════════════════════════════════ */

export type DropdownBadgeColor = Extract<
  BadgeColor,
  'green' | 'blue' | 'orange' | 'lime' | 'indigo' | 'red' | 'sky' | 'purple' | 'yellow'
>;

export interface DropdownBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  color?: DropdownBadgeColor;
}

export function DropdownBadge({
  label,
  color = 'green',
  className,
  ...rest
}: DropdownBadgeProps) {
  return (
    <Badge color={color} closable={false} className={cn('shrink-0', className)} {...rest}>
      {label}
    </Badge>
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
  /**
   * Popup content rendered between the trigger and hint when present.
   * Anchored absolutely to the trigger so it correctly overlays content
   * below — independent of hint/error/label height. Pass a `<DropdownMenu>`
   * (or any positioned popover) here; consumer still controls when to
   * render (typically gated on `open`).
   */
  popup?: React.ReactNode;
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
      popup,
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
            <span className="text-sm font-normal leading-5 text-default">{label}</span>
            {required && (
              <span className="text-sm font-normal leading-5 text-destructive">*</span>
            )}
            {sublabel && (
              <span className="text-sm font-normal leading-5 text-muted">{sublabel}</span>
            )}
            {labelInfo && (
              <Info className="ml-0.5 h-3 w-3 text-muted" aria-hidden="true" />
            )}
          </div>
        )}

        <div className="relative">
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
                      'border-subtle',
                      'bg-subtle',
                      FOCUS_RING_GRAY,
                    )
                  : cn(
                      'border-default',
                      'hover:border-subtle',
                      'focus-visible:border-subtle',
                      FOCUS_RING_GRAY,
                    )
            ),
          )}
          {...rest}
        >
          {isTagsVariant ? (
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              {tags.length === 0 && (
                <span className="text-[13px] leading-[18px] text-muted">{placeholder}</span>
              )}
              {tags.map((t) => (
                <span
                  key={t.value}
                  className="inline-flex items-center gap-0.5 rounded-xs bg-muted px-1 py-0.5"
                >
                  <span className="font-mono text-[13px] leading-4 text-muted">{t.label}</span>
                  {onRemoveTag && !disabled && (
                    // Span (not button) — the parent trigger is already a <button>,
                    // and nesting buttons is invalid HTML (React hydration error).
                    <span
                      role="button"
                      aria-label={`Remove ${t.label}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTag(t.value);
                      }}
                      className="ml-0.5 inline-flex cursor-pointer items-center justify-center text-muted transition-colors duration-fast ease-standard hover:text-default"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <span
              className={cn(
                'min-w-0 flex-1 truncate text-[13px] leading-[18px]',
                isFilled ? 'text-default' : 'text-muted',
              )}
            >
              {selectedLabel ?? placeholder}
            </span>
          )}
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          </button>
          {popup && open && (
            <div className="absolute left-0 right-0 top-full z-10 mt-1">
              {popup}
            </div>
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
