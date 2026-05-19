import type { CanvasComponent } from '../canvas-types.js';

export const tooltipCanvas: CanvasComponent = {
  name: 'Tooltip',
  importFrom: 'pod-test-ui/tooltip',
  variants: ['default', 'info', 'warning', 'error'],
  sizes: ['default'],
  defaultProps: {
    content: 'Helpful hint',
    defaultOpen: true,
  },
  variantPresets: {
    default: { variant: 'default', title: 'Title',   content: 'Placeholder' },
    info:    { variant: 'info',    title: 'Heads up', content: 'Informational note.' },
    warning: { variant: 'warning', title: 'Careful',  content: 'Review this before continuing.' },
    error:   { variant: 'error',   title: 'Blocked',  content: 'Action could not complete.' },
  },
  examples: [
    { label: 'Top',    props: { side: 'top',    defaultOpen: true } },
    { label: 'Right',  props: { side: 'right',  defaultOpen: true } },
    { label: 'Bottom', props: { side: 'bottom', defaultOpen: true } },
    { label: 'Left',   props: { side: 'left',   defaultOpen: true } },
  ],
  tokens: [
    'bg-surface',
    'bg-info',
    'bg-warning',
    'bg-destructive',
    'text-strong',
    'text-muted',
  ],
};
