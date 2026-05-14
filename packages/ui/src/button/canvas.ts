import type { CanvasComponent } from '../canvas-types.js';

export const buttonCanvas: CanvasComponent = {
  name: 'Button',
  importFrom: 'pod-test-ui/button',
  variants: ['primary', 'outline', 'error'],
  sizes: ['xs', 'sm', 'md', 'lg'],
  defaultProps: { variant: 'primary', size: 'md', children: 'Save changes' },
  examples: [
    { label: 'Loading', props: { loading: true, children: 'Saving…' } },
    { label: 'Disabled', props: { disabled: true, children: 'Save changes' } },
  ],
  // Common — every Button variant uses border-focus for the keyboard focus ring.
  tokens: ['border-focus'],
  // Per-variant token scope. Panel shows union(common + variantTokens[selected]).
  variantTokens: {
    primary: ['accent-default', 'accent-hover', 'accent-active', 'accent-fg', 'accent-subtle'],
    outline: ['border-default', 'text-muted', 'text-primary', 'accent-default', 'accent-subtle'],
    error: ['danger-default', 'danger-hover', 'danger-active', 'danger-fg'],
  },
};
