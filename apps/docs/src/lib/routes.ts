import type { ComponentType } from 'react';

export type Status = 'ready' | 'planned';
export type Category = 'top' | 'foundation' | 'component' | 'resource';

export interface RouteEntry {
  path: string;
  label: string;
  category: Category;
  status?: Status;
  description?: string;
  load?: () => Promise<{ default: ComponentType<unknown> }>;
}

export const routes: RouteEntry[] = [
  { path: '/',                 label: 'Home',            category: 'top', load: () => import('../pages/Home.js') },
  { path: '/getting-started',  label: 'Getting Started', category: 'top', load: () => import('../pages/GettingStarted.mdx') },
  { path: '/figma-status',     label: 'Figma Status',    category: 'top', load: () => import('../pages/FigmaStatus.js') },

  // Foundations
  { path: '/foundations/color',      label: 'Color',      category: 'foundation', load: () => import('../pages/foundations/Color.mdx') },
  { path: '/foundations/typography', label: 'Typography', category: 'foundation', load: () => import('../pages/foundations/Typography.mdx') },
  { path: '/foundations/spacing',    label: 'Spacing',    category: 'foundation', load: () => import('../pages/foundations/Spacing.mdx') },
  { path: '/foundations/radius',     label: 'Radius',     category: 'foundation', load: () => import('../pages/foundations/Radius.mdx') },
  { path: '/foundations/elevation',  label: 'Elevation',  category: 'foundation', load: () => import('../pages/foundations/Elevation.mdx') },
  { path: '/foundations/motion',     label: 'Motion',     category: 'foundation', load: () => import('../pages/foundations/Motion.mdx') },

  // Components — ready
  { path: '/components/button',       label: 'Button',       category: 'component', status: 'ready',   description: 'Primary action element.',         load: () => import('../pages/components/Button.mdx') },
  { path: '/components/checkbox',     label: 'Checkbox',     category: 'component', status: 'ready',   description: 'Multi-select boolean input.',     load: () => import('../pages/components/Checkbox.mdx') },

  { path: '/components/text-input',    label: 'Text Input',   category: 'component', status: 'ready',    description: 'Single-line text field with label, hint, and error support.', load: () => import('../pages/components/TextInput.mdx') },

  // Components — planned
  { path: '/components/search-input', label: 'Search Input', category: 'component', status: 'planned', description: 'Filter / search text field.',     load: () => import('../pages/components/SearchInput.mdx') },
  { path: '/components/tooltip',      label: 'Tooltip',      category: 'component', status: 'planned', description: 'Contextual help on hover/focus.', load: () => import('../pages/components/Tooltip.mdx') },
  { path: '/components/badge',        label: 'Badge',        category: 'component', status: 'planned', description: 'Compact label for status, count, or category.', load: () => import('../pages/components/Badge.mdx') },
  { path: '/components/select',       label: 'Select',       category: 'component', status: 'planned', description: 'Dropdown picker for one of many options.',     load: () => import('../pages/components/Select.mdx') },
  { path: '/components/dropdown',     label: 'Dropdown',     category: 'component', status: 'planned', description: 'Floating menu of actions or links.',           load: () => import('../pages/components/Dropdown.mdx') },
  { path: '/components/dialog',       label: 'Dialog',       category: 'component', status: 'planned', description: 'Modal overlay for focused tasks.',             load: () => import('../pages/components/Dialog.mdx') },
  { path: '/components/switch',       label: 'Switch',       category: 'component', status: 'planned', description: 'On/off binary toggle.',                        load: () => import('../pages/components/Switch.mdx') },
  { path: '/components/input',        label: 'Input',        category: 'component', status: 'planned', description: 'Single-line text input.',                      load: () => import('../pages/components/Input.mdx') },
  { path: '/components/radio',        label: 'Radio',        category: 'component', status: 'planned', description: 'Single-select from a small set of options.',   load: () => import('../pages/components/Radio.mdx') },
  { path: '/components/label',        label: 'Label',        category: 'component', status: 'planned', description: 'Form field label primitive.',                  load: () => import('../pages/components/Label.mdx') },

  // Resources
  { path: '/changelog', label: 'Changelog', category: 'resource', load: () => import('../pages/Changelog.mdx') },
];

export const topRoutes = routes.filter((r) => r.category === 'top');
export const foundationRoutes = routes.filter((r) => r.category === 'foundation');
export const componentRoutes = routes.filter((r) => r.category === 'component');
export const resourceRoutes = routes.filter((r) => r.category === 'resource');

export interface GroupMeta {
  id: string;
  label: string;
}

export const groupMeta = {
  foundations: { id: 'foundations', label: 'Foundations' } satisfies GroupMeta,
  components:  { id: 'components',  label: 'Components'  } satisfies GroupMeta,
  resources:   { id: 'resources',   label: 'Resources'   } satisfies GroupMeta,
};
