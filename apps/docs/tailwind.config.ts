import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import preset from 'pod-test-tokens/tailwind-preset';

// Auto-derive safelist from preset so dynamic class composition (e.g.
// TokenAutoGrid's `rounded-${name}`) doesn't get purged. When a new token
// is added to the preset, this list updates automatically.
const presetTheme = (preset as { theme?: { extend?: { borderRadius?: Record<string, string>; boxShadow?: Record<string, string> } } }).theme;
const radiusKeys = Object.keys(presetTheme?.extend?.borderRadius ?? {});
const shadowKeys = Object.keys(presetTheme?.extend?.boxShadow ?? {});

export default {
  presets: [preset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../../design-system-testing-abdillah/packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-text-default) / <alpha-value>)',
        foreground: 'rgb(var(--color-text-default) / <alpha-value>)',
        crimson: {
          500: '#C0180C',
        },
      },
    },
  },
  safelist: [
    ...radiusKeys.map((k) => `rounded-${k}`),
    ...shadowKeys.map((k) => `shadow-${k}`),
  ],
  plugins: [animate],
} satisfies Config;
