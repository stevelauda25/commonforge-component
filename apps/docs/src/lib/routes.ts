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

  // Foundations — tokens collected from the SPARC apps on 2026-07-21
  { path: '/foundations/color',      label: 'Color',      category: 'foundation', description: 'Explore the color styles and usage guidance.', load: () => import('../pages/foundations/Color.mdx') },
  { path: '/foundations/typography', label: 'Typography', category: 'foundation', description: 'Explore the typography styles and usage guidelines.', load: () => import('../pages/foundations/Typography.mdx') },
  { path: '/foundations/spacing',    label: 'Spacing',    category: 'foundation', description: 'Explore the spacing styles and usage guidance.', load: () => import('../pages/foundations/Spacing.mdx') },
  { path: '/foundations/radius',     label: 'Radius',     category: 'foundation', description: 'Explore the radius styles and usage guidance.', load: () => import('../pages/foundations/Radius.mdx') },
  { path: '/foundations/elevation',  label: 'Elevation',  category: 'foundation', description: 'Explore the elevation styles and usage guidance.', load: () => import('../pages/foundations/Elevation.mdx') },

  // Components — SPARC, alphabetical
  { path: '/components/account-switcher',   label: 'Account Switcher',   category: 'component', status: 'ready', description: 'Switch between workspaces and accounts.', load: () => import('../pages/components/SparcAccountSwitcher.mdx') },
  { path: '/components/avatar',             label: 'Avatar',             category: 'component', status: 'ready', description: 'Profile image with initials fallback.', load: () => import('../pages/components/SparcAvatar.mdx') },
  { path: '/components/badge',              label: 'Badge',              category: 'component', status: 'ready', description: 'Status indicators and metadata labels.', load: () => import('../pages/components/SparcBadge.mdx') },
  { path: '/components/breadcrumb',         label: 'Breadcrumb',         category: 'component', status: 'ready', description: 'Secondary hierarchy navigation trail.', load: () => import('../pages/components/SparcBreadcrumb.mdx') },
  { path: '/components/button',             label: 'Button',             category: 'component', status: 'ready', description: 'Interactive trigger for user actions.', load: () => import('../pages/components/SparcButton.mdx') },
  { path: '/components/chart-tooltip',      label: 'Chart Tooltip',      category: 'component', status: 'ready', description: 'Floating data card on chart hover.', load: () => import('../pages/components/SparcChartTooltip.mdx') },
  { path: '/components/checkbox',           label: 'Checkbox',           category: 'component', status: 'ready', description: 'Binary multi-select control.', load: () => import('../pages/components/SparcCheckbox.mdx') },
  { path: '/components/combobox',           label: 'Combobox',           category: 'component', status: 'ready', description: 'Select field with label, hint, and search.', load: () => import('../pages/components/SparcCombobox.mdx') },
  { path: '/components/drop-zone',          label: 'Drop Zone',          category: 'component', status: 'ready', description: 'Drag-and-drop file upload container.', load: () => import('../pages/components/SparcDropZone.mdx') },
  { path: '/components/dropdown',           label: 'Dropdown',           category: 'component', status: 'ready', description: 'Select-style menu for option picking.', load: () => import('../pages/components/SparcDropdown.mdx') },
  { path: '/components/empty-state',        label: 'Empty State',        category: 'component', status: 'ready', description: 'Placeholder for empty views and lists.', load: () => import('../pages/components/SparcEmptyState.mdx') },
  { path: '/components/file-list',          label: 'File List',          category: 'component', status: 'ready', description: 'Attachment item row with file info.', load: () => import('../pages/components/SparcFileList.mdx') },
  { path: '/components/gantt-bar',          label: 'Gantt Bar',          category: 'component', status: 'ready', description: 'Timeline schedule duration block.', load: () => import('../pages/components/SparcGanttBar.mdx') },
  { path: '/components/text-input',         label: 'Input',              category: 'component', status: 'ready', description: 'Single-line text input field.', load: () => import('../pages/components/SparcInput.mdx') },
  { path: '/components/kpi-card',           label: 'KPI Card',           category: 'component', status: 'ready', description: 'Metric card with stats and trends.', load: () => import('../pages/components/SparcKpiCard.mdx') },
  { path: '/components/legend',             label: 'Legend',             category: 'component', status: 'ready', description: 'Color-coded key for chart datasets.', load: () => import('../pages/components/SparcLegend.mdx') },
  { path: '/components/list-base',          label: 'List Base',          category: 'component', status: 'ready', description: 'Interactive row item for lists and menus.', load: () => import('../pages/components/SparcListBase.mdx') },
  { path: '/components/loading-spinner',    label: 'Loading Spinner',    category: 'component', status: 'ready', description: 'Circular loader for async states.', load: () => import('../pages/components/SparcLoadingSpinner.mdx') },
  { path: '/components/nav-item',           label: 'Nav Item',           category: 'component', status: 'ready', description: 'Sidebar navigation link with states.', load: () => import('../pages/components/SparcNavItem.mdx') },
  { path: '/components/nav-section',        label: 'Nav Section',        category: 'component', status: 'ready', description: 'Collapsible navigation group heading.', load: () => import('../pages/components/SparcNavSection.mdx') },
  { path: '/components/pagination',         label: 'Pagination',         category: 'component', status: 'ready', description: 'Controls for navigating paged tables.', load: () => import('../pages/components/SparcPagination.mdx') },
  { path: '/components/progress-bar',       label: 'Progress Bar',       category: 'component', status: 'ready', description: 'Linear progress indicator with track.', load: () => import('../pages/components/SparcProgressBar.mdx') },
  { path: '/components/progress-bar-base',  label: 'Progress Bar Base',  category: 'component', status: 'ready', description: 'Primitive bar element for progress bars.', load: () => import('../pages/components/SparcProgressBarBase.mdx') },
  { path: '/components/progress-ring',      label: 'Progress Ring',      category: 'component', status: 'ready', description: 'Circular radial progress meter.', load: () => import('../pages/components/SparcProgressRing.mdx') },
  { path: '/components/progress-value-bar', label: 'Progress Value Bar', category: 'component', status: 'ready', description: 'Segmented bar with threshold values.', load: () => import('../pages/components/SparcProgressValueBar.mdx') },
  { path: '/components/radio',              label: 'Radio',              category: 'component', status: 'ready', description: 'Single-selection circular button.', load: () => import('../pages/components/SparcRadio.mdx') },
  { path: '/components/search-field',       label: 'Search Field',       category: 'component', status: 'ready', description: 'Search input with shortcut and popover.', load: () => import('../pages/components/SparcSearchField.mdx') },
  { path: '/components/segmented-button',   label: 'Segmented Button',   category: 'component', status: 'ready', description: 'Grouped toggle for selecting view modes.', load: () => import('../pages/components/SparcSegmentedButton.mdx') },
  { path: '/components/separator',          label: 'Separator',          category: 'component', status: 'ready', description: 'Visual divider line between elements.', load: () => import('../pages/components/SparcSeparator.mdx') },
  { path: '/components/skill-level',        label: 'Skill Level',        category: 'component', status: 'ready', description: 'Visual meter for proficiency levels.', load: () => import('../pages/components/SparcSkillLevel.mdx') },
  { path: '/components/slider',             label: 'Slider',             category: 'component', status: 'ready', description: 'Range input for adjusting values.', load: () => import('../pages/components/SparcSlider.mdx') },
  { path: '/components/switch',             label: 'Switch',             category: 'component', status: 'ready', description: 'Toggle control for binary settings.', load: () => import('../pages/components/SparcSwitch.mdx') },
  { path: '/components/tag',                label: 'Tag',                category: 'component', status: 'ready', description: 'Compact filter and selection chips.', load: () => import('../pages/components/SparcTag.mdx') },
  { path: '/components/text-area',          label: 'Text Area',          category: 'component', status: 'ready', description: 'Multi-line text input with char count.', load: () => import('../pages/components/SparcTextArea.mdx') },
  { path: '/components/text-field',         label: 'Text Field',         category: 'component', status: 'ready', description: 'Complete form field with label and hint.', load: () => import('../pages/components/SparcTextField.mdx') },
  { path: '/components/timeline',           label: 'Timeline',           category: 'component', status: 'ready', description: 'Chronological events and activity list.', load: () => import('../pages/components/SparcTimeline.mdx') },
  { path: '/components/toast',              label: 'Toast',              category: 'component', status: 'ready', description: 'Floating notification for feedback.', load: () => import('../pages/components/SparcToast.mdx') },
  { path: '/components/tooltip',            label: 'Tooltip',            category: 'component', status: 'ready', description: 'Informative popover on hover or focus.', load: () => import('../pages/components/SparcTooltip.mdx') },

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
