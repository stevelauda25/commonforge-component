import type { Config } from 'tailwindcss';

/**
 * Tailwind preset — the single bridge between CSS variables in theme.css
 * and the utility classes used by components.
 *
 * Uses per-utility theme keys (backgroundColor, borderColor, textColor,
 * ringColor, outlineColor, ringOffsetColor) so each utility has its own
 * flat color map. This gives clean class names: `bg-canvas`, `text-default`,
 * `border-brand`, `ring-brand`, `outline-border-brand`.
 *
 * `bg-` and `text-` maps include icon-* and fg-* aliases so SVG color
 * cascades and decorative-foreground use sites can pick the right semantic.
 * Badge `accent` ring color is dual-registered in backgroundColor and
 * textColor (component-scoped 3rd badge layer).
 */

const rgbVar = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const BADGE_COLORS = [
  'orange', 'lime', 'purple', 'green', 'indigo', 'sky', 'blue', 'red', 'yellow',
] as const;

const badgeBg = Object.fromEntries(
  BADGE_COLORS.flatMap((c) => [
    [`badge-${c}`, rgbVar(`bg-badge-${c}`)],
    [`badge-${c}-accent`, rgbVar(`badge-${c}-accent`)],
  ]),
);

const badgeText = Object.fromEntries(
  BADGE_COLORS.flatMap((c) => [
    [`badge-${c}`, rgbVar(`text-badge-${c}`)],
    [`badge-${c}-accent`, rgbVar(`badge-${c}-accent`)],
  ]),
);

const backgroundColor = {
  canvas:   rgbVar('bg-canvas'),
  surface:  rgbVar('bg-surface'),
  elevated: rgbVar('bg-elevated'),
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
  info:           rgbVar('bg-info'),
  'info-subtle':  rgbVar('bg-info-subtle'),
  ...badgeBg,
  // fg aliases (bg-fg-default for decorative usage as bg)
  'fg-default':  rgbVar('fg-default'),
  'fg-subtle':   rgbVar('fg-subtle'),
  'fg-disabled': rgbVar('fg-disabled'),
  'fg-brand':    rgbVar('fg-brand'),
  'fg-on-brand': rgbVar('fg-on-brand'),
  overlay: 'rgb(var(--color-overlay) / <alpha-value>)',
};

const borderColor = {
  DEFAULT:               rgbVar('border-default'),
  default:               rgbVar('border-default'),
  subtle:                rgbVar('border-subtle'),
  strong:                rgbVar('border-strong'),
  brand:                 rgbVar('border-brand'),
  destructive:           rgbVar('border-destructive'),
  'destructive-subtle':  rgbVar('border-destructive-subtle'),
  disabled:              rgbVar('border-disabled'),
  error:                 rgbVar('border-error'),
  info:                  rgbVar('border-info'),
  inverse:               rgbVar('border-inverse'),
  success:               rgbVar('border-success'),
  warning:               rgbVar('border-warning'),
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
  info:        rgbVar('text-info'),
  'on-brand':       rgbVar('text-on-brand'),
  'on-destructive': rgbVar('text-on-destructive'),
  'on-success':     rgbVar('text-on-success'),
  'on-warning':     rgbVar('text-on-warning'),
  'on-info':        rgbVar('text-on-info'),
  // icon aliases — used as text-icon-{key} (color cascades to SVG currentColor)
  'icon-default':        rgbVar('icon-default'),
  'icon-strong':         rgbVar('icon-strong'),
  'icon-subtle':         rgbVar('icon-subtle'),
  'icon-muted':          rgbVar('icon-muted'),
  'icon-disabled':       rgbVar('icon-disabled'),
  'icon-placeholder':    rgbVar('icon-placeholder'),
  'icon-inverse':        rgbVar('icon-inverse'),
  'icon-brand':          rgbVar('icon-brand'),
  'icon-success':        rgbVar('icon-success'),
  'icon-destructive':    rgbVar('icon-destructive'),
  'icon-error':          rgbVar('icon-error'),
  'icon-warning':        rgbVar('icon-warning'),
  'icon-info':           rgbVar('icon-info'),
  'icon-on-brand':       rgbVar('icon-on-brand'),
  'icon-on-destructive': rgbVar('icon-on-destructive'),
  'icon-on-success':     rgbVar('icon-on-success'),
  'icon-on-warning':     rgbVar('icon-on-warning'),
  'icon-on-info':        rgbVar('icon-on-info'),
  // fg aliases — used as text-fg-{key} for decorative foreground rendering
  'fg-default':  rgbVar('fg-default'),
  'fg-subtle':   rgbVar('fg-subtle'),
  'fg-disabled': rgbVar('fg-disabled'),
  'fg-brand':    rgbVar('fg-brand'),
  'fg-on-brand': rgbVar('fg-on-brand'),
  ...badgeText,
};

const ringColor = {
  DEFAULT:               rgbVar('border-brand'),
  brand:                 rgbVar('border-brand'),
  destructive:           rgbVar('border-destructive'),
  // Allow `ring-border-X` synonyms (used in component code that wants explicit family)
  'border-brand':        rgbVar('border-brand'),
  'border-default':      rgbVar('border-default'),
  'border-subtle':       rgbVar('border-subtle'),
  'border-strong':       rgbVar('border-strong'),
  'border-destructive':  rgbVar('border-destructive'),
};

const outlineColor = {
  DEFAULT:               rgbVar('border-default'),
  'border-brand':        rgbVar('border-brand'),
  'border-default':      rgbVar('border-default'),
  'border-destructive':  rgbVar('border-destructive'),
  'border-subtle':       rgbVar('border-subtle'),
  'border-strong':       rgbVar('border-strong'),
};

const ringOffsetColor = {
  'bg-canvas':  rgbVar('bg-canvas'),
  'bg-surface': rgbVar('bg-surface'),
};

export const preset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor,
      borderColor,
      textColor,
      ringColor,
      outlineColor,
      ringOffsetColor,
      colors: {
        // Generic fallback — keep overlay accessible as `bg-overlay`, `text-overlay`
        overlay: 'rgb(var(--color-overlay) / <alpha-value>)',
      },
      boxShadow: {
        'foundation-xs':  'var(--shadow-foundation-xs)',
        'foundation-sm':  'var(--shadow-foundation-sm)',
        'foundation-md':  'var(--shadow-foundation-md)',
        'foundation-lg':  'var(--shadow-foundation-lg)',
        'foundation-xl':  'var(--shadow-foundation-xl)',
        'foundation-2xl': 'var(--shadow-foundation-2xl)',
        'foundation-3xl': 'var(--shadow-foundation-3xl)',
        'glow-accent-inset':        'var(--shadow-glow-accent-inset)',
        'glow-accent-inset-strong': 'var(--shadow-glow-accent-inset-strong)',
        'glow-danger-inset':        'var(--shadow-glow-danger-inset)',
        'glow-danger-inset-strong': 'var(--shadow-glow-danger-inset-strong)',
        'glow-accent-text':         'var(--shadow-glow-accent-text)',
      },
      borderRadius: {
        none: 'var(--radius-none)',
        xxs:  'var(--radius-xxs)',
        xs:   'var(--radius-xs)',
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        '4xl': 'var(--radius-4xl)',
        full: 'var(--radius-full)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        standard:   'var(--ease-standard)',
        emphasized: 'var(--ease-emphasized)',
        press:      'var(--ease-press)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1rem' }],    // 12
        sm:   ['0.8125rem',{ lineHeight: '1.125rem' }],// 13 — dashboard default
        base: ['0.875rem', { lineHeight: '1.25rem' }], // 14
        md:   ['0.9375rem',{ lineHeight: '1.375rem' }],// 15
        lg:   ['1rem',     { lineHeight: '1.5rem' }],  // 16
        xl:   ['1.125rem', { lineHeight: '1.625rem' }],// 18
        '2xl':['1.25rem',  { lineHeight: '1.75rem' }], // 20
        '3xl':['1.5rem',   { lineHeight: '2rem' }],    // 24
      },
      // Motion keyframes — POD-defined, consumers get them via the preset.
      // Pair with `--duration-*` and `--ease-*` CSS variables for token-driven motion.
      keyframes: {
        // Popover / dropdown reveal — entry counterpart of the 280ms
        // removal-motion standard. Pure 2-stop linear interpolation between
        // these endpoints; browser eases naturally via cubic-bezier below.
        // Blur is the subtle defocus signal, not a heavy stylized effect.
        'menu-in': {
          '0%':   {
            opacity: '0',
            filter: 'blur(4px)',
            transform: 'translateY(-4px) scale(0.97)',
          },
          '100%': {
            opacity: '1',
            filter: 'blur(0)',
            transform: 'translateY(0) scale(1)',
          },
        },
        // Per-item entrance — lighter than the shell so the cascade reads
        // as layered, not redundant.
        'menu-item-in': {
          '0%':   {
            opacity: '0',
            filter: 'blur(2px)',
            transform: 'translateY(-3px)',
          },
          '100%': {
            opacity: '1',
            filter: 'blur(0)',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        // Match the 280ms exit-motion family. cubic-bezier(0.4, 0, 0.2, 1)
        // is the same ease-out used by BadgeRemovableDemo — linear-feeling,
        // not spring-back. Validated by user as the "elegant" baseline.
        'menu-in':      'menu-in 280ms cubic-bezier(0.4, 0, 0.2, 1) both',
        'menu-item-in': 'menu-item-in 220ms cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-in':      'fade-in var(--duration-fast) var(--ease-standard) both',
      },
    },
  },
};

export default preset;
