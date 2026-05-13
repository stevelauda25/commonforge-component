import type { CanvasComponent } from '../canvas-types.js';

export const textInputCanvas: CanvasComponent = {
  name: 'TextInput',
  importFrom: 'pod-test-ui/text-input',
  variants: ['default'],
  sizes: ['sm', 'md', 'lg'],
  defaultProps: { placeholder: 'Type something…' },
  examples: [
    { label: 'With error', props: { error: 'Required field' } },
    { label: 'Disabled', props: { disabled: true } },
  ],
};
