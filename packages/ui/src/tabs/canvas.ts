import type { CanvasComponent } from '../canvas-types.js';

export const tabsCanvas: CanvasComponent = {
  name: 'Tab',
  importFrom: 'pod-test-ui/tabs',
  // Real `tabType` prop drives layout — variants here are direct values.
  variants: ['menu', 'underline', 'screen-nav', 'pill'],
  sizes: ['default'],
  defaultProps: { children: 'Label' },
  examples: [
    { label: 'Active', props: { active: true, children: 'Label' } },
    { label: 'Disabled', props: { disabled: true, children: 'Label' } },
  ],
  tokens: [
    'text-default',
    'text-subtle',
    'text-disabled',
    'bg-muted',
    'border-default',
    'border-brand',
    'bg-success',
  ],
  variantTokens: {
    menu: ['bg-surface', 'badge-indigo-accent'],
    underline: ['bg-success'],
    'screen-nav': ['bg-surface', 'bg-elevated'],
    pill: ['bg-surface'],
  },
};
