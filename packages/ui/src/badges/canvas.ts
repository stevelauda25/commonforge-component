import type { CanvasComponent } from '../canvas-types.js';

export const badgesCanvas: CanvasComponent = {
  name: 'Badge',
  importFrom: 'pod-test-ui/badges',
  // `color` drives variant — listed here as direct values.
  variants: [
    'green',
    'lime',
    'orange',
    'yellow',
    'red',
    'purple',
    'indigo',
    'sky',
    'blue',
    'soft-gray',
    'dark-gray',
  ],
  sizes: ['default'],
  defaultProps: { children: 'LABEL', closable: true },
  examples: [
    { label: 'No close icon', props: { closable: false, children: 'LABEL' } },
    { label: 'Long label', props: { children: 'STATUS-LONG-TEXT', closable: true } },
  ],
  tokens: ['border-focus'],
  variantTokens: {
    green: [
      'bg-badge-green',
      'badge-green-accent',
      'text-badge-green',
    ],
    lime: [
      'bg-badge-lime',
      'badge-lime-accent',
      'text-badge-lime',
    ],
    orange: [
      'bg-badge-orange',
      'badge-orange-accent',
      'text-badge-orange',
    ],
    yellow: [
      'bg-badge-yellow',
      'badge-yellow-accent',
      'text-badge-yellow',
    ],
    red: [
      'bg-badge-red',
      'badge-red-accent',
      'text-badge-red',
    ],
    purple: [
      'bg-badge-purple',
      'badge-purple-accent',
      'text-badge-purple',
    ],
    indigo: [
      'bg-badge-indigo',
      'badge-indigo-accent',
      'text-badge-indigo',
    ],
    sky: [
      'bg-badge-sky',
      'badge-sky-accent',
      'text-badge-sky',
    ],
    blue: [
      'bg-badge-blue',
      'badge-blue-accent',
      'text-badge-blue',
    ],
    'soft-gray': [
      'bg-elevated',
      'bg-disabled',
      'text-subtle',
    ],
    'dark-gray': [
      'bg-surface',
      'bg-disabled',
      'text-subtle',
      'border-strong',
    ],
  },
};
