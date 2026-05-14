import * as React from 'react';
import { cn } from '../lib/cn.js';

export type TabType = 'menu' | 'underline' | 'screen-nav' | 'pill';

export interface TabProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Visual style. Default `underline`. */
  tabType?: TabType;
  /** Currently selected — drives active styling. */
  active?: boolean;
  /** Optional leading icon — primarily for `menu` type, but works in all types. */
  icon?: React.ReactNode;
  /** Optional trailing icon (e.g. settings cog on Menu/Active). */
  trailingIcon?: React.ReactNode;
  /** Shortcut key letter (only renders for `screen-nav` type). */
  shortcut?: string;
}

const baseCommon =
  'inline-flex items-center justify-center relative whitespace-nowrap select-none ' +
  'transition-colors duration-fast ease-standard ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus/40 ' +
  'disabled:cursor-not-allowed';

// ── Container classes — split by state to avoid Tailwind cascade conflicts ─
// Color mapping (dark, all from Figma):
//   bg-canvas             = #09090b ≡ bg/strong (Menu default/hover/disabled fill)
//   experiment-tab-base   = #111113 ≡ bg/medium (Pill/ScreenNav/Menu-Active fill)
//   bg-surface            = #18181b ≡ bg/muted   (ScreenNav/Pill hover fill)
//   experiment-tab-border = #18181b ≡ stroke/strong (Menu/Pill active stroke)
//   experiment-tab-text   = #7c7e84 ≡ text/soft + icon/soft (all inactive label/icon)
//   experiment-tab-text-disabled = #3a3a3d ≡ text/disabled + icon/disabled
const baseLayout: Record<TabType, string> = {
  menu: 'gap-1 px-3 py-1.5 rounded-sm',
  underline: 'gap-1 px-2 py-1.5',
  'screen-nav': 'gap-2 px-4 py-1.5',
  pill: 'px-6 py-1 rounded-sm',
};

const inactiveClasses: Record<TabType, string> = {
  menu:
    'bg-canvas text-experiment-tab-text hover:text-text-primary ' +
    'disabled:text-experiment-tab-text-disabled disabled:hover:text-experiment-tab-text-disabled',
  underline:
    'text-experiment-tab-text hover:text-text-primary ' +
    'disabled:text-experiment-tab-text-disabled disabled:hover:text-experiment-tab-text-disabled',
  'screen-nav':
    'bg-experiment-tab-base text-experiment-tab-text ' +
    'hover:bg-surface hover:text-experiment-tab-text ' +
    'disabled:text-experiment-tab-text-disabled disabled:hover:bg-experiment-tab-base',
  pill:
    'bg-experiment-tab-base text-experiment-tab-text ' +
    'hover:bg-surface ' +
    'disabled:text-experiment-tab-text-disabled disabled:hover:bg-experiment-tab-base',
};

const activeClasses: Record<TabType, string> = {
  menu: 'bg-experiment-tab-base border border-experiment-tab-border text-text-primary',
  underline: 'text-text-primary',
  'screen-nav': 'bg-experiment-tab-base text-text-primary',
  pill: 'bg-experiment-tab-base border border-experiment-tab-border text-text-primary',
};

const fontByType: Record<TabType, string> = {
  menu: 'text-[13px] leading-[18px] font-medium',
  underline: 'text-[13px] leading-[18px] font-medium',
  'screen-nav': 'text-[14px] leading-5 font-medium',
  pill: 'text-[13px] leading-[18px] font-normal',
};

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(function Tab(
  {
    tabType = 'underline',
    active = false,
    icon,
    trailingIcon,
    shortcut,
    children,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const isUnderline = tabType === 'underline';
  const isMenu = tabType === 'menu';

  // Menu/Active uses indigo-tinted leading icon (per Figma).
  const iconTint = isMenu && active ? 'text-experiment-tab-indigo' : 'text-experiment-tab-text';

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-current={active ? 'true' : undefined}
      className={cn(
        baseCommon,
        fontByType[tabType],
        baseLayout[tabType],
        active && !disabled ? activeClasses[tabType] : inactiveClasses[tabType],
        className,
      )}
      {...rest}
    >
      {icon && (
        <span
          aria-hidden="true"
          className={cn(
            'shrink-0 inline-flex items-center justify-center [&>svg]:h-3.5 [&>svg]:w-3.5',
            disabled ? 'text-experiment-tab-text-disabled' : iconTint,
          )}
        >
          {icon}
        </span>
      )}

      <span>{children}</span>

      {trailingIcon && (
        <span
          aria-hidden="true"
          className={cn(
            'shrink-0 inline-flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4',
            disabled ? 'text-experiment-tab-text-disabled' : 'text-experiment-tab-text',
          )}
        >
          {trailingIcon}
        </span>
      )}

      {tabType === 'screen-nav' && shortcut && (
        <span
          aria-hidden="true"
          className={cn(
            'shrink-0 inline-flex items-center justify-center w-5 rounded-xs px-1.5 bg-experiment-tab-chip',
            'text-[14px] leading-5 font-medium',
            disabled ? 'text-experiment-tab-text-disabled' : 'text-experiment-tab-text',
          )}
        >
          {shortcut}
        </span>
      )}

      {isUnderline && active && !disabled && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-success"
        />
      )}
    </button>
  );
});
