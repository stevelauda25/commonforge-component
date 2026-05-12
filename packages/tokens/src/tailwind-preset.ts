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
    },
  },
};

export default preset;
