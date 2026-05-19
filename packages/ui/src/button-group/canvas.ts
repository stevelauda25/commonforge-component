import type { CanvasComponent } from '../canvas-types.js';

export const buttonGroupCanvas: CanvasComponent = {
  name: 'ButtonGroup',
  importFrom: 'pod-test-ui/button-group',
  variants: ['default'],
  sizes: ['default'],
  defaultProps: {},
  examples: [
    { label: 'Three items', props: { quantity: 3 } },
    { label: 'Five items', props: { quantity: 5 } },
  ],
  tokens: [
    'bg-canvas',
    'bg-surface',
    'bg-muted',
    'border-default',
    'text-muted',
    'text-strong',
    'text-disabled',
  ],
};
