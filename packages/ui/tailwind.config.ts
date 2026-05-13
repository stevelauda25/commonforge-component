import type { Config } from 'tailwindcss';
import preset from 'pod-test-tokens/tailwind-preset';

/**
 * Build-only Tailwind config — used by `npm run build:css` to compile
 * the utility-class CSS bundle that ships in dist/styles.css.
 *
 * This config is NOT consumed at component runtime — components only
 * emit class names; consumers' Tailwind (or this compiled bundle) renders them.
 */
export default {
  presets: [preset],
  content: ['src/**/*.{ts,tsx}'],
} satisfies Config;
