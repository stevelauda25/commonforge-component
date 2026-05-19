import type { CanvasComponent } from '../canvas-types.js';

export const searchInputCanvas: CanvasComponent = {
  name: 'SearchInput',
  importFrom: 'pod-test-ui/search-input',
  variants: ['default'],
  sizes: ['sm', 'md'],
  defaultProps: { placeholder: 'Search...' },
  examples: [
    { label: 'With label', props: { label: 'Search', placeholder: 'Search...' } },
    { label: 'With hint', props: { hint: 'Search products, categories, or tags' } },
    { label: 'With error', props: { error: 'Search query is required' } },
    { label: 'No shortcut', props: { shortcutKeys: null } },
    { label: 'Disabled', props: { disabled: true } },
  ],
  tokens: [
    'bg-canvas',
    'bg-muted',
    'border-default',
    'border-brand',
    'bg-destructive',
    'text-default',
    'text-muted',
  ],
};
