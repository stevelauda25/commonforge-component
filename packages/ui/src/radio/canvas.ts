import type { CanvasComponent } from '../canvas-types.js';

export const radioCanvas: CanvasComponent = {
  name: 'Radio',
  importFrom: 'pod-test-ui/radio',
  variants: ['only', 'withLabel', 'withDescription'],
  sizes: ['sm', 'md'],
  defaultProps: {
    label: 'Email notifications',
    description: 'Daily digest at 8am.',
  },
  variantPresets: {
    only: { label: undefined, description: undefined },
    withLabel: { description: undefined },
    withDescription: {},
  },
  examples: [
    { label: 'Checked', props: { defaultChecked: true } },
    { label: 'Disabled', props: { disabled: true } },
  ],
  tokens: [
    'bg-canvas',
    'bg-muted',
    'bg-disabled',
    'bg-inverse',
    'border-subtle',
    'border-inverse',
    'border-disabled',
    'text-strong',
    'text-muted',
    'text-disabled',
  ],
};
