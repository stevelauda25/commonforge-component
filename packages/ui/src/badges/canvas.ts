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
      'experiment-badge-green-bg',
      'experiment-badge-green-tag',
      'experiment-badge-green-fg',
    ],
    lime: [
      'experiment-badge-lime-bg',
      'experiment-badge-lime-tag',
      'experiment-badge-lime-fg',
    ],
    orange: [
      'experiment-badge-orange-bg',
      'experiment-badge-orange-tag',
      'experiment-badge-orange-fg',
    ],
    yellow: [
      'experiment-badge-yellow-bg',
      'experiment-badge-yellow-tag',
      'experiment-badge-yellow-fg',
    ],
    red: [
      'experiment-badge-red-bg',
      'experiment-badge-red-tag',
      'experiment-badge-red-fg',
    ],
    purple: [
      'experiment-badge-purple-bg',
      'experiment-badge-purple-tag',
      'experiment-badge-purple-fg',
    ],
    indigo: [
      'experiment-badge-indigo-bg',
      'experiment-badge-indigo-tag',
      'experiment-badge-indigo-fg',
    ],
    sky: [
      'experiment-badge-sky-bg',
      'experiment-badge-sky-tag',
      'experiment-badge-sky-fg',
    ],
    blue: [
      'experiment-badge-blue-bg',
      'experiment-badge-blue-tag',
      'experiment-badge-blue-fg',
    ],
    'soft-gray': [
      'experiment-tab-chip',
      'experiment-tab-text-disabled',
      'experiment-tab-text',
    ],
    'dark-gray': [
      'experiment-tab-base',
      'experiment-tab-border',
      'experiment-tab-text-disabled',
      'experiment-tab-text',
    ],
  },
};
