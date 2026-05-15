import type { Config } from 'tailwindcss';

/**
 * Tailwind preset — the single bridge between CSS variables in theme.css
 * and the utility classes used by components.
 *
 * Keep this file boring: any new semantic token added in theme.css should
 * get a matching entry here (and nothing else). No component-specific tokens.
 */

const rgbVar = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

export const preset: Partial<Config> = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Backgrounds
        canvas:  rgbVar('bg-canvas'),
        surface: rgbVar('bg-surface'),
        raised:  rgbVar('bg-raised'),
        muted:   rgbVar('bg-muted'),

        // Text
        'text-primary':   rgbVar('text-primary'),
        'text-secondary': rgbVar('text-secondary'),
        'text-muted':     rgbVar('text-muted'),
        'text-disabled':  rgbVar('text-disabled'),
        'text-inverse':   rgbVar('text-inverse'),

        // Borders
        'border-subtle':  rgbVar('border-subtle'),
        'border-default': rgbVar('border-default'),
        'border-strong':  rgbVar('border-strong'),
        'border-focus':   rgbVar('border-focus'),

        // Accent
        accent: {
          DEFAULT: rgbVar('accent-default'),
          hover:   rgbVar('accent-hover'),
          active:  rgbVar('accent-active'),
          fg:      rgbVar('accent-fg'),
          subtle:  rgbVar('accent-subtle'),
        },

        // Feedback
        danger: {
          DEFAULT: rgbVar('danger-default'),
          hover:   rgbVar('danger-hover'),
          active:  rgbVar('danger-active'),
          fg:      rgbVar('danger-fg'),
          subtle:  rgbVar('danger-subtle'),
        },
        warning: {
          DEFAULT: rgbVar('warning-default'),
          fg:      rgbVar('warning-fg'),
          subtle:  rgbVar('warning-subtle'),
        },
        success: {
          DEFAULT: rgbVar('success-default'),
          fg:      rgbVar('success-fg'),
          subtle:  rgbVar('success-subtle'),
        },
        info: {
          DEFAULT: rgbVar('info-default'),
          fg:      rgbVar('info-fg'),
          subtle:  rgbVar('info-subtle'),
        },

        // Neutral overlay (for modal scrims etc.)
        overlay: rgbVar('overlay'),

        // Experimental — Figma-introduced primitives, see theme.css block
        'experiment-zinc-700':            rgbVar('experiment-zinc-700'),
        'experiment-primary-test':        rgbVar('experiment-primary-test'),
        'experiment-input-stroke-active': rgbVar('experiment-input-stroke-active'),
        'experiment-input-bg-focused':    rgbVar('experiment-input-bg-focused'),
        'experiment-cb-border':           rgbVar('experiment-cb-border'),
        'experiment-cb-disabled-bg':      rgbVar('experiment-cb-disabled-bg'),
        'experiment-cb-disabled-icon':    rgbVar('experiment-cb-disabled-icon'),
        'experiment-primary-hover-dark':  rgbVar('experiment-primary-hover-dark'),
        'experiment-tab-base':            rgbVar('experiment-tab-base'),
        'experiment-tab-chip':            rgbVar('experiment-tab-chip'),
        'experiment-tab-indigo':          rgbVar('experiment-tab-indigo'),
        'experiment-tab-border':          rgbVar('experiment-tab-border'),
        'experiment-tab-text':            rgbVar('experiment-tab-text'),
        'experiment-tab-text-disabled':   rgbVar('experiment-tab-text-disabled'),
        'experiment-badge-orange-bg':     rgbVar('experiment-badge-orange-bg'),
        'experiment-badge-orange-tag':    rgbVar('experiment-badge-orange-tag'),
        'experiment-badge-orange-fg':     rgbVar('experiment-badge-orange-fg'),
        'experiment-badge-lime-bg':       rgbVar('experiment-badge-lime-bg'),
        'experiment-badge-lime-tag':      rgbVar('experiment-badge-lime-tag'),
        'experiment-badge-lime-fg':       rgbVar('experiment-badge-lime-fg'),
        'experiment-badge-purple-bg':     rgbVar('experiment-badge-purple-bg'),
        'experiment-badge-purple-tag':    rgbVar('experiment-badge-purple-tag'),
        'experiment-badge-purple-fg':     rgbVar('experiment-badge-purple-fg'),
        'experiment-badge-green-bg':      rgbVar('experiment-badge-green-bg'),
        'experiment-badge-green-tag':     rgbVar('experiment-badge-green-tag'),
        'experiment-badge-green-fg':      rgbVar('experiment-badge-green-fg'),
        'experiment-badge-indigo-bg':     rgbVar('experiment-badge-indigo-bg'),
        'experiment-badge-indigo-tag':    rgbVar('experiment-badge-indigo-tag'),
        'experiment-badge-indigo-fg':     rgbVar('experiment-badge-indigo-fg'),
        'experiment-badge-sky-bg':        rgbVar('experiment-badge-sky-bg'),
        'experiment-badge-sky-tag':       rgbVar('experiment-badge-sky-tag'),
        'experiment-badge-sky-fg':        rgbVar('experiment-badge-sky-fg'),
        'experiment-badge-blue-bg':       rgbVar('experiment-badge-blue-bg'),
        'experiment-badge-blue-tag':      rgbVar('experiment-badge-blue-tag'),
        'experiment-badge-blue-fg':       rgbVar('experiment-badge-blue-fg'),
        'experiment-badge-red-bg':        rgbVar('experiment-badge-red-bg'),
        'experiment-badge-red-tag':       rgbVar('experiment-badge-red-tag'),
        'experiment-badge-red-fg':        rgbVar('experiment-badge-red-fg'),
        'experiment-badge-yellow-bg':     rgbVar('experiment-badge-yellow-bg'),
        'experiment-badge-yellow-tag':    rgbVar('experiment-badge-yellow-tag'),
        'experiment-badge-yellow-fg':     rgbVar('experiment-badge-yellow-fg'),
      },

      borderRadius: {
        none: 'var(--radius-none)',
        xxs:  'var(--radius-xxs)',
        xs:   'var(--radius-xs)',
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        '2xl':'var(--radius-2xl)',
        '3xl':'var(--radius-3xl)',
        '4xl':'var(--radius-4xl)',
        full: 'var(--radius-full)',
      },

      boxShadow: {
        // Foundation scale from Figma — canonical drop-shadow scale
        'foundation-xs':  'var(--shadow-foundation-xs)',
        'foundation-sm':  'var(--shadow-foundation-sm)',
        'foundation-md':  'var(--shadow-foundation-md)',
        'foundation-lg':  'var(--shadow-foundation-lg)',
        'foundation-xl':  'var(--shadow-foundation-xl)',
        'foundation-2xl': 'var(--shadow-foundation-2xl)',
        'foundation-3xl': 'var(--shadow-foundation-3xl)',
        // Brand glows (sacred — never modified by sync)
        'glow-accent-inset':        'var(--shadow-glow-accent-inset)',
        'glow-accent-inset-strong': 'var(--shadow-glow-accent-inset-strong)',
        'glow-danger-inset':        'var(--shadow-glow-danger-inset)',
        'glow-danger-inset-strong': 'var(--shadow-glow-danger-inset-strong)',
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
