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

  // SPARC staging — externally collected tokens, pending review (not pod-test-tokens)
  { path: '/foundations/sparc-color',      label: 'SPARC Color',      category: 'foundation', load: () => import('../pages/foundations/SparcColor.mdx') },
  { path: '/foundations/sparc-typography', label: 'SPARC Typography', category: 'foundation', load: () => import('../pages/foundations/SparcTypography.mdx') },
  { path: '/foundations/sparc-spacing',    label: 'SPARC Spacing',    category: 'foundation', load: () => import('../pages/foundations/SparcSpacing.mdx') },
  { path: '/foundations/sparc-radius',     label: 'SPARC Radius',     category: 'foundation', load: () => import('../pages/foundations/SparcRadius.mdx') },
  { path: '/foundations/sparc-elevation',  label: 'SPARC Elevation',  category: 'foundation', load: () => import('../pages/foundations/SparcElevation.mdx') },

  // Components — ready
  { path: '/components/button',       label: 'Button',       category: 'component', status: 'ready',   description: 'Primary action element.',         load: () => import('../pages/components/Button.mdx') },
  { path: '/components/checkbox',     label: 'Checkbox',     category: 'component', status: 'ready',   description: 'Multi-select boolean input.',     load: () => import('../pages/components/Checkbox.mdx') },

  { path: '/components/text-input',    label: 'Text Input',   category: 'component', status: 'ready',    description: 'Single-line text field with label, hint, and error support.', load: () => import('../pages/components/TextInput.mdx') },
  { path: '/components/search-input',  label: 'Search Input', category: 'component', status: 'ready',    description: 'Search field with default icon, ⌘K shortcut hint, and optional clear button.', load: () => import('../pages/components/SearchInput.mdx') },
  { path: '/components/dropdown',      label: 'Dropdown',     category: 'component', status: 'ready',    description: 'Single-select or multi-tag trigger. Stateless — pair with your menu.', load: () => import('../pages/components/Dropdown.mdx') },
  { path: '/components/tab',           label: 'Tab',          category: 'component', status: 'ready',    description: 'Single tab item — menu, underline, screen-nav, or pill style.',                load: () => import('../pages/components/Tab.mdx') },
  { path: '/components/badge',         label: 'Badge',        category: 'component', status: 'ready',    description: 'Compact label for status, count, or category — 11 color variants with optional × remove.', load: () => import('../pages/components/Badge.mdx') },
  { path: '/components/radio',         label: 'Radio',        category: 'component', status: 'ready',    description: 'Single-select from a small set of options.',                                    load: () => import('../pages/components/Radio.mdx') },
  { path: '/components/button-group',  label: 'Button Group', category: 'component', status: 'ready',    description: 'Joined cluster of related actions — toggle or segment patterns.',               load: () => import('../pages/components/ButtonGroup.mdx') },
  { path: '/components/tag',           label: 'Tag',          category: 'component', status: 'ready',    description: 'Compact filter or selection chip — interactive, optionally removable.',         load: () => import('../pages/components/Tag.mdx') },
  { path: '/components/tooltip',       label: 'Tooltip',       category: 'component', status: 'ready',    description: 'Contextual help on hover/focus — optional title + body, 4 sides × 3 alignments.', load: () => import('../pages/components/Tooltip.mdx') },
  { path: '/components/dashboard-kpis',            label: 'Dashboard KPIs',            category: 'component', status: 'ready',    description: 'A row of KPI summary cards for a dashboard.', load: () => import('../pages/components/DashboardKpis.mdx') },
  { path: '/components/dashboard-forecast-chart',  label: 'Dashboard Forecast Chart',  category: 'component', status: 'ready',    description: 'Interactive area chart projecting labor needs over time.', load: () => import('../pages/components/DashboardForecastChart.mdx') },
  { path: '/components/dashboard-jobs-insights',   label: 'Dashboard Jobs Insights',   category: 'component', status: 'ready',    description: 'Comprehensive view of job status and hours by phase.', load: () => import('../pages/components/DashboardJobsInsights.mdx') },
  { path: '/components/dashboard-map-budget',      label: 'Dashboard Map Budget',      category: 'component', status: 'ready',    description: 'Interactive Leaflet map alongside budget KPIs.', load: () => import('../pages/components/DashboardMapBudget.mdx') },
  { path: '/components/dashboard-skills-insights', label: 'Dashboard Skills Insights', category: 'component', status: 'ready',    description: 'Summary of worker skills and capabilities.', load: () => import('../pages/components/DashboardSkillsInsights.mdx') },

  // SPARC Phase-1 atoms (collected in design-system-testing-abdillah)
  { path: '/components/sparc-button',           label: 'SPARC Button',           category: 'component', status: 'ready', description: 'Phase-1 button atom from the SPARC Figma spec.',           load: () => import('../pages/components/SparcButton.mdx') },
  { path: '/components/sparc-badge',            label: 'SPARC Badge',            category: 'component', status: 'ready', description: 'Phase-1 badge atom from the SPARC Figma spec.',            load: () => import('../pages/components/SparcBadge.mdx') },
  { path: '/components/sparc-checkbox',         label: 'SPARC Checkbox',         category: 'component', status: 'ready', description: 'Phase-1 checkbox atom from the SPARC Figma spec.',         load: () => import('../pages/components/SparcCheckbox.mdx') },
  { path: '/components/sparc-switch',           label: 'SPARC Switch',           category: 'component', status: 'ready', description: 'Phase-1 switch atom from the SPARC Figma spec.',           load: () => import('../pages/components/SparcSwitch.mdx') },
  { path: '/components/sparc-tag',              label: 'SPARC Tag',              category: 'component', status: 'ready', description: 'Phase-1 tag atom from the SPARC Figma spec.',              load: () => import('../pages/components/SparcTag.mdx') },
  { path: '/components/sparc-input',            label: 'SPARC Input',            category: 'component', status: 'ready', description: 'Phase-1 text-input atom from the SPARC Figma spec.',       load: () => import('../pages/components/SparcInput.mdx') },
  { path: '/components/sparc-textarea',         label: 'SPARC Text Area',        category: 'component', status: 'ready', description: 'Phase-1 text-area atom from the SPARC Figma spec.',        load: () => import('../pages/components/SparcTextArea.mdx') },
  { path: '/components/sparc-radio',            label: 'SPARC Radio',            category: 'component', status: 'ready', description: 'Phase-1 radio atom from the SPARC Figma spec.',            load: () => import('../pages/components/SparcRadio.mdx') },
  { path: '/components/sparc-segmented-button', label: 'SPARC Segmented Button', category: 'component', status: 'ready', description: 'Phase-1 segmented-button atom from the SPARC Figma spec.', load: () => import('../pages/components/SparcSegmentedButton.mdx') },
  { path: '/components/sparc-slider',           label: 'SPARC Slider',           category: 'component', status: 'ready', description: 'Phase-1 slider atom from the SPARC Figma spec.',           load: () => import('../pages/components/SparcSlider.mdx') },
  { path: '/components/sparc-loading-spinner',  label: 'SPARC Loading Spinner',  category: 'component', status: 'ready', description: 'Phase-1 loading-spinner atom from the SPARC Figma spec.',  load: () => import('../pages/components/SparcLoadingSpinner.mdx') },
  { path: '/components/sparc-avatar',           label: 'SPARC Avatar',           category: 'component', status: 'ready', description: 'Phase-1 avatar atom from the SPARC Figma spec.',           load: () => import('../pages/components/SparcAvatar.mdx') },
  { path: '/components/sparc-separator',        label: 'SPARC Separator',        category: 'component', status: 'ready', description: 'Phase-1 separator atom from the SPARC Figma spec.',        load: () => import('../pages/components/SparcSeparator.mdx') },
  { path: '/components/sparc-list-base',        label: 'SPARC List Base',        category: 'component', status: 'ready', description: 'Phase-1 list-base atom from the SPARC Figma spec.',        load: () => import('../pages/components/SparcListBase.mdx') },
  { path: '/components/sparc-tooltip',          label: 'SPARC Tooltip',          category: 'component', status: 'ready', description: 'Phase-1 tooltip atom from the SPARC Figma spec.',          load: () => import('../pages/components/SparcTooltip.mdx') },

  // Components — planned
  { path: '/components/select',       label: 'Select',       category: 'component', status: 'planned', description: 'Dropdown picker for one of many options.',     load: () => import('../pages/components/Select.mdx') },
  { path: '/components/dialog',       label: 'Dialog',       category: 'component', status: 'planned', description: 'Modal overlay for focused tasks.',             load: () => import('../pages/components/Dialog.mdx') },
  { path: '/components/switch',       label: 'Switch',       category: 'component', status: 'planned', description: 'On/off binary toggle.',                        load: () => import('../pages/components/Switch.mdx') },
  { path: '/components/input',        label: 'Input',        category: 'component', status: 'planned', description: 'Single-line text input.',                      load: () => import('../pages/components/Input.mdx') },
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
