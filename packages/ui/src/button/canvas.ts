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
};
