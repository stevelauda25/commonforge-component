import * as React from 'react';
import { cn } from '../lib/cn.js';
import { focusRing } from '../lib/focus-ring.js';

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface ButtonGroupItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual press state — driven by parent for toggle/segment patterns. */
  active?: boolean;
  /** When true, the item renders icon only with square aspect. */
  iconOnly?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const ButtonGroupRoot = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'inline-flex items-stretch overflow-hidden',
          'rounded-md border border-default bg-canvas',
          'divide-x divide-default',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  function ButtonGroupItem(
    { active = false, iconOnly = false, icon, disabled, className, children, type, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        aria-pressed={active || undefined}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-1',
          'h-[34px] text-sm leading-[18px]',
          'transition-colors duration-fast ease-standard',
          iconOnly ? 'w-[34px] px-0' : 'px-2.5',
          active
            ? 'bg-surface text-strong'
            : 'bg-transparent text-muted hover:bg-muted hover:text-strong',
          'active:bg-surface active:text-strong',
          'disabled:cursor-not-allowed disabled:bg-transparent disabled:text-disabled',
          'disabled:hover:bg-transparent disabled:hover:text-disabled',
          focusRing,
          className,
        )}
        {...rest}
      >
        {icon && (
          <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center">
            {icon}
          </span>
        )}
        {!iconOnly && children}
      </button>
    );
  },
);

type ButtonGroupComponent = typeof ButtonGroupRoot & {
  Item: typeof ButtonGroupItem;
};

export const ButtonGroup = ButtonGroupRoot as ButtonGroupComponent;
ButtonGroup.Item = ButtonGroupItem;

export { ButtonGroupItem };
