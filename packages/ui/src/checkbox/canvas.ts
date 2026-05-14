import type { CanvasComponent } from '../canvas-types.js';

export const checkboxCanvas: CanvasComponent = {
  name: 'Checkbox',
  importFrom: 'pod-test-ui/checkbox',
  variants: ['default'],
  sizes: ['default'],
  defaultProps: { checked: false },
  examples: [
    { label: 'Checked', props: { checked: true } },
    { label: 'Disabled', props: { disabled: true } },
  ],
  tokens: [
    'text-primary',
    'bg-canvas',
    'bg-muted',
    'border-default',
    'border-focus',
    'accent-default',
  ],
};
