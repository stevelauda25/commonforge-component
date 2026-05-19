import type { CanvasComponent } from '../canvas-types.js';

export const checkboxCanvas: CanvasComponent = {
  name: 'Checkbox',
  importFrom: 'pod-test-ui/checkbox',
  // Synthetic variants — Checkbox has no real `variant` prop. The composite
  // spawn (buildCheckboxComposite) wraps Checkbox in a function component
  // with a `variant` param that drives label/description rendering.
  // See CENTERNODE-RULES.md "Variant prop rule".
  variants: ['only', 'withLabel', 'withDescription'],
  sizes: ['default'],
  defaultProps: {
    checked: false,
    label: 'I agree to the terms',
    description: 'Daily digest at 8am.',
  },
  // Overlay applied on top of defaultProps when picking each variant card —
  // sets the visible label/description per variant for the SIDEBAR PREVIEW.
  // The actual spawn always includes all props (the composite filters them
  // by variant), so the canvas display matches the preview.
  variantPresets: {
    only: {},
    withLabel: {},
    withDescription: {
      label: 'Email notifications',
      description: 'Daily digest at 8am.',
    },
  },
  examples: [
    { label: 'Checked', props: { checked: true } },
    { label: 'Disabled', props: { disabled: true } },
  ],
  tokens: [
    'text-default',
    'bg-canvas',
    'bg-muted',
    'border-default',
    'border-brand',
    'bg-brand',
  ],
};
