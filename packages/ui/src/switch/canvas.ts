import type { CanvasComponent } from '../canvas-types.js';

export const switchCanvas: CanvasComponent = {
  name: 'Switch',
  importFrom: 'pod-test-ui/switch',
  variants: ['default'],
  sizes: ['sm', 'md'],
  defaultProps: { defaultChecked: true, size: 'md' },
  examples: [
    { label: 'Off', props: { defaultChecked: false } },
    { label: 'Disabled', props: { disabled: true } },
  ],
};
