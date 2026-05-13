import * as React from 'react';
import { cn } from '../lib/cn.js';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
}

const sizeClasses: Record<SwitchSize, { track: string; thumb: string; on: string }> = {
  sm: { track: 'h-4 w-7', thumb: 'h-3 w-3', on: 'translate-x-3' },
  md: { track: 'h-5 w-9', thumb: 'h-4 w-4', on: 'translate-x-4' },
};

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch({ checked, defaultChecked = false, onCheckedChange, size = 'md', disabled, className }, ref) {
    const [internal, setInternal] = React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const value = isControlled ? checked : internal;
    const cls = sizeClasses[size];
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => {
          const next = !value;
          if (!isControlled) setInternal(next);
          onCheckedChange?.(next);
        }}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer rounded-full',
          'transition-colors duration-base ease-standard',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          cls.track,
          value ? 'bg-accent' : 'bg-muted',
          className,
        )}
      >
        <span
          aria-hidden
          className={cn(
            'inline-block rounded-full bg-canvas shadow-foundation-xs',
            'transition-transform duration-base ease-standard',
            cls.thumb,
            'absolute top-1/2 -translate-y-1/2',
            value ? cls.on : 'translate-x-0.5',
          )}
        />
      </button>
    );
  },
);
