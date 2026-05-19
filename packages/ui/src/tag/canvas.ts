import type { CanvasComponent } from '../canvas-types.js';

export const tagCanvas: CanvasComponent = {
  name: 'Tag',
  importFrom: 'pod-test-ui/tag',
  variants: ['default', 'gray'],
  sizes: ['default'],
  defaultProps: {
    children: 'Tag',
  },
  variantPresets: {
    default: { color: 'default' },
    gray:    { color: 'gray' },
  },
  examples: [
    { label: 'Active',    props: { active: true } },
    { label: 'Disabled',  props: { disabled: true } },
  ],
  tokens: [
    'bg-surface',
    'bg-muted',
    'bg-disabled',
    'border-default',
    'border-subtle',
    'text-muted',
    'text-strong',
    'text-disabled',
  ],
};
