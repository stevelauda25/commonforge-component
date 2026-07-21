import type { Config } from 'tailwindcss';
import { primitives } from './primitives.js';

/**
 * Tailwind preset — bridge between CSS variables in theme.css
 * and utility classes. Generated from foundation/tokens.json.
 */

const rgbVar = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** '255 240 241' → '#FFF0F1' */
const tripletToHex = (triplet: string) =>
  `#${triplet
    .split(' ')
    .map((channel) => Number(channel).toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase();

const ramp = (scale: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(scale).map(([shade, triplet]) => [shade, tripletToHex(triplet)]),
  );

/**
 * SPARC primitive color ramps (from primitives.ts), registered as static
 * hexes so utilities like `bg-red-25`, `bg-green-400` or `text-red-500`
 * resolve to SPARC values instead of the Tailwind default palette.
 */
const colors = {
  neutral: ramp(primitives.neutral),
  crimson: ramp(primitives.crimson),
  green:   ramp(primitives.green),
  amber:   ramp(primitives.amber),
  red:     ramp(primitives.red),
  gray:    ramp(primitives.gray),
};

const backgroundColor = {
  canvas:   rgbVar('bg-canvas'),
  surface:  rgbVar('bg-surface'),
  muted:    rgbVar('bg-muted'),
  subtle:   rgbVar('bg-subtle'),
  disabled: rgbVar('bg-disabled'),
  inverse:  rgbVar('bg-inverse'),
  neutral:  rgbVar('bg-neutral'),
  brand:                rgbVar('bg-brand'),
  'brand-hover':        rgbVar('bg-brand-hover'),
  'brand-subtle':       rgbVar('bg-brand-subtle'),
  destructive:          rgbVar('bg-destructive'),
  'destructive-hover':  rgbVar('bg-destructive-hover'),
  'destructive-subtle': rgbVar('bg-destructive-subtle'),
  error:           rgbVar('bg-error'),
  'error-subtle':  rgbVar('bg-error-subtle'),
  success:          rgbVar('bg-success'),
  'success-subtle': rgbVar('bg-success-subtle'),
  warning:          rgbVar('bg-warning'),
  'warning-subtle': rgbVar('bg-warning-subtle'),
};

const borderColor = {
  DEFAULT:         rgbVar('border-default'),
  default:         rgbVar('border-default'),
  subtle:          rgbVar('border-subtle'),
  strong:          rgbVar('border-strong'),
  brand:           rgbVar('border-brand'),
  destructive:     rgbVar('border-destructive'),
  error:           rgbVar('border-error'),
  success:         rgbVar('border-success'),
  warning:         rgbVar('border-warning'),
};

const textColor = {
  default:     rgbVar('text-default'),
  strong:      rgbVar('text-strong'),
  subtle:      rgbVar('text-subtle'),
  muted:       rgbVar('text-muted'),
  disabled:    rgbVar('text-disabled'),
  placeholder: rgbVar('text-placeholder'),
  inverse:     rgbVar('text-inverse'),
  brand:       rgbVar('text-brand'),
  success:     rgbVar('text-success'),
  destructive: rgbVar('text-destructive'),
  error:       rgbVar('text-error'),
  warning:     rgbVar('text-warning'),
  'on-brand':       rgbVar('text-on-brand'),
  'on-destructive': rgbVar('text-on-destructive'),
  'on-success':     rgbVar('text-on-success'),
  'on-warning':     rgbVar('text-on-warning'),
};

export const preset: Partial<Config> = {
  theme: {
    extend: {
      colors,
      backgroundColor,
      borderColor,
      textColor,
      borderRadius: {
        none: 'var(--radius-none)',
        xxs:  'var(--radius-2xs)',
        xs:   'var(--radius-xs)',
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        '10': 'var(--radius-10)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        'elev-1': 'var(--shadow-elev-1)',
        'elev-2': 'var(--shadow-elev-2)',
        'pop':    'var(--shadow-pop)',
        'button': 'var(--shadow-button)',
        'frame':  'var(--shadow-frame)',
        'card':   'var(--shadow-card)',
      },
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        '3xs':   ['0.5625rem',  { lineHeight: '0.8125rem' }],
        '2xs':   ['0.625rem',   { lineHeight: '0.875rem' }],
        'caption': ['0.6875rem',{ lineHeight: '0.9375rem' }],
        'body-sm': ['0.8125rem',{ lineHeight: '1.125rem' }],
        'body':    ['0.875rem', { lineHeight: '1.25rem' }],
        'body-lg': ['1rem',     { lineHeight: '1.5rem' }],
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
    },
  },
};

export default preset;
