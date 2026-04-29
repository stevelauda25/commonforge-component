import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import preset from '@pod/tokens/tailwind-preset';

export default {
  presets: [preset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  plugins: [animate],
} satisfies Config;
