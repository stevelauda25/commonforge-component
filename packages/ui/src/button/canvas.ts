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
  // Common — every Button variant uses border-brand for the keyboard focus ring.
  tokens: ['border-brand'],
  // Per-variant token scope. Panel shows union(common + variantTokens[selected]).
  variantTokens: {
    primary: ['bg-brand', 'bg-brand-hover', 'text-on-brand', 'border-brand', 'bg-brand-subtle'],
    outline: ['border-default', 'text-muted', 'text-default', 'border-brand'],
    error: ['bg-destructive', 'bg-destructive-hover', 'text-on-destructive', 'border-destructive'],
  },
};
