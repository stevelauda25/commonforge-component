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
    'text-primary',
    'text-muted',
    'text-disabled',
    'bg-muted',
    'border-default',
    'border-focus',
    'success-default',
  ],
  variantTokens: {
    menu: ['experiment-tab-base', 'experiment-tab-indigo'],
    underline: ['success-default'],
    'screen-nav': ['experiment-tab-base', 'experiment-tab-chip'],
    pill: ['experiment-tab-base'],
  },
};
