import { useState, type ComponentType } from 'react';
import {
  AccountSwitcher,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  ChartTooltip,
  Checkbox,
  Combobox,
  DropZone,
  Dropdown,
  EmptyState,
  FileList,
  GanttBar,
  KpiCard,
  Legend,
  ListBase,
  LoadingSpinner,
  NavItem,
  NavSection,
  Pagination,
  ProgressBar,
  ProgressBarBase,
  ProgressRing,
  Radio,
  SearchField,
  SegmentedButton,
  Separator,
  Slider,
  Switch,
  Tag,
  TextArea,
  TextInput,
  Timeline,
  Toast,
  Tooltip,
} from '@sparc-ui';

export function ButtonExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  );
}

export function BadgeExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      <Badge variant="success">READY</Badge>
      <Badge variant="warning">DRAFT</Badge>
      <Badge variant="error">BLOCKED</Badge>
    </div>
  );
}

export function CheckboxExample() {
  const [checked, setChecked] = useState<boolean>(true);
  return (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={setChecked} />
      Remember me
    </label>
  );
}

export function SwitchExample() {
  const [on, setOn] = useState<boolean>(true);
  return <Switch checked={on} onCheckedChange={setOn} />;
}

export function TagExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      <Tag>Default</Tag>
      <Tag variant="selected">Selected</Tag>
    </div>
  );
}

export function TooltipExample() {
  return (
    <Tooltip side="top" body="Helpful context">
      <Button variant="outline" size="sm">Hover me</Button>
    </Tooltip>
  );
}

export function AccountSwitcherExample() {
  return (
    <AccountSwitcher
      name="Jason Heim"
      initials="JH"
      role="Admin"
    />
  );
}

export function ChartTooltipExample() {
  return (
    <ChartTooltip
      title="July 2025"
      items={[
        { label: 'Revenue', value: '$42k', color: '#3b82f6' },
        { label: 'Expenses', value: '$18k', color: '#ef4444' },
      ]}
    />
  );
}

export function DropZoneExample() {
  return (
    <DropZone
      description="Drop PDF or DOCX here"
      maxSizeLabel="max 10MB"
      className="w-52"
    />
  );
}

export function TextFieldExample() {
  const [v, setV] = useState('');
  return (
    <div className="flex flex-col gap-1.5 w-44">
      <label className="text-sm font-medium">
        Full name
        <span className="ml-0.5 text-[#C0180C]">*</span>
      </label>
      <TextInput
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Enter your name"
      />
      <span className="text-xs text-subtle">Required field</span>
    </div>
  );
}

export function AvatarExample() {
  return (
    <div className="flex items-center gap-2">
      <Avatar fallback="JD" size={32} />
      <Avatar fallback="CF" size={32} />
      <Avatar fallback="AB" size={32} />
    </div>
  );
}

export function GanttBarExample() {
  return (
    <div className="flex flex-col gap-2">
      <GanttBar>2 workers</GanttBar>
      <GanttBar state="hover">3 workers</GanttBar>
    </div>
  );
}

export function ComboboxExample() {
  const [val, setVal] = useState('');
  return (
    <Combobox
      label="Project"
      options={[
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
      ]}
      value={val}
      onChange={setVal}
      className="w-44"
    />
  );
}

export function DropdownExample() {
  const [val, setVal] = useState('');
  return (
    <Dropdown
      options={[
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
        { value: 'c', label: 'Option C' },
      ]}
      value={val}
      onChange={setVal}
      placeholder="Select…"
      className="w-44"
    />
  );
}

export function FileListExample() {
  return (
    <div className="flex flex-col gap-2 w-52">
      <FileList name="design.pdf" size="2.4 MB" status="uploaded" />
      <FileList name="assets.zip" size="8.1 MB" status="uploading" progress={60} />
    </div>
  );
}

export function ListBaseExample() {
  return (
    <div className="flex flex-col w-40">
      <ListBase size="md" state="selected">Dashboard</ListBase>
      <ListBase size="md" state="default">Projects</ListBase>
      <ListBase size="md" state="default">Settings</ListBase>
    </div>
  );
}

export function ProgressBarBaseExample() {
  return (
    <div className="flex w-full flex-col gap-2 px-4">
      <ProgressBarBase percent={70} size="md" />
      <ProgressBarBase percent={35} size="md" color="#e85858" />
    </div>
  );
}

export function BreadcrumbExample() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '#' },
        { label: 'Components', href: '#' },
        { label: 'Breadcrumb' },
      ]}
    />
  );
}

export function LoadingSpinnerExample() {
  return <LoadingSpinner size="md" />;
}

export function RadioExample() {
  const [val, setVal] = useState('a');
  return (
    <div className="flex flex-col gap-2 text-sm">
      <label className="flex items-center gap-2">
        <Radio checked={val === 'a'} onCheckedChange={() => setVal('a')} />
        Option A
      </label>
      <label className="flex items-center gap-2">
        <Radio checked={val === 'b'} onCheckedChange={() => setVal('b')} />
        Option B
      </label>
    </div>
  );
}

export function SeparatorExample() {
  return (
    <div className="flex w-full flex-col gap-2 text-sm">
      <span className="text-subtle">Section A</span>
      <Separator />
      <span className="text-subtle">Section B</span>
    </div>
  );
}

export function SliderExample() {
  const [val, setVal] = useState(40);
  return (
    <div className="w-full px-4">
      <Slider value={val} onValueChange={setVal} min={0} max={100} />
    </div>
  );
}

export function SearchFieldExample() {
  const [q, setQ] = useState('');
  return (
    <SearchField
      value={q}
      onChange={setQ}
      placeholder="Search…"
      className="w-40"
    />
  );
}

export function SegmentedButtonExample() {
  const [active, setActive] = useState('day');
  return (
    <SegmentedButton
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
      value={active}
      onChange={setActive}
    />
  );
}

export function ProgressBarExample() {
  return (
    <div className="flex w-full flex-col gap-2 px-4">
      <ProgressBar value={70} max={100} />
      <ProgressBar value={40} max={100} variant="warning" />
    </div>
  );
}

export function ProgressRingExample() {
  return (
    <div className="flex gap-4">
      <ProgressRing value={75} max={100} size="md" />
      <ProgressRing value={40} max={100} size="md" variant="warning" />
    </div>
  );
}

export function PaginationExample() {
  const [page, setPage] = useState(3);
  return (
    <Pagination
      page={page}
      totalPages={10}
      onPageChange={setPage}
    />
  );
}

export function TextInputExample() {
  const [v, setV] = useState('');
  return (
    <TextInput
      value={v}
      onChange={(e) => setV(e.target.value)}
      placeholder="Type something…"
      className="w-40"
    />
  );
}

export function TextAreaExample() {
  const [v, setV] = useState('');
  return (
    <TextArea
      value={v}
      onChange={(e) => setV(e.target.value)}
      placeholder="Write a note…"
      rows={3}
      className="w-48"
    />
  );
}

export function NavItemExample() {
  return (
    <div className="flex flex-col gap-1 w-40">
      <NavItem label="Dashboard" active />
      <NavItem label="Components" />
      <NavItem label="Settings" />
    </div>
  );
}

export function NavSectionExample() {
  return (
    <NavSection label="Components" defaultOpen>
      <NavItem label="Button" />
      <NavItem label="Badge" />
    </NavSection>
  );
}

export function LegendExample() {
  return (
    <div className="flex flex-col gap-1.5">
      <Legend color="var(--color-accent-default)" label="Revenue" value="$42k" />
      <Legend color="var(--color-danger-default)" label="Expenses" value="$18k" />
      <Legend color="var(--color-success-default)" label="Profit" value="$24k" />
    </div>
  );
}

export function KpiCardExample() {
  return (
    <KpiCard
      label="Total Revenue"
      value="$42,000"
      trend={{ value: 12, direction: 'up' }}
    />
  );
}

export function EmptyStateExample() {
  return (
    <EmptyState
      title="No results"
      description="Try adjusting your search."
    />
  );
}

export function ToastExample() {
  return (
    <div className="flex flex-col gap-2 w-52">
      <Toast variant="success" title="Saved!" />
      <Toast variant="error" title="Failed to save" />
    </div>
  );
}

export function TimelineExample() {
  return (
    <Timeline
      items={[
        { label: 'Created', timestamp: '09:00' },
        { label: 'In Review', timestamp: '10:30', active: true },
        { label: 'Done', timestamp: '' },
      ]}
    />
  );
}

export const canonicalExamples: Record<string, ComponentType> = {
  '/components/account-switcher':   AccountSwitcherExample,
  '/components/avatar':             AvatarExample,
  '/components/badge':              BadgeExample,
  '/components/breadcrumb':         BreadcrumbExample,
  '/components/button':             ButtonExample,
  '/components/chart-tooltip':      ChartTooltipExample,
  '/components/checkbox':           CheckboxExample,
  '/components/combobox':           ComboboxExample,
  '/components/drop-zone':          DropZoneExample,
  '/components/dropdown':           DropdownExample,
  '/components/empty-state':        EmptyStateExample,
  '/components/file-list':          FileListExample,
  '/components/gantt-bar':          GanttBarExample,
  '/components/kpi-card':           KpiCardExample,
  '/components/legend':             LegendExample,
  '/components/list-base':          ListBaseExample,
  '/components/loading-spinner':    LoadingSpinnerExample,
  '/components/nav-item':           NavItemExample,
  '/components/nav-section':        NavSectionExample,
  '/components/pagination':         PaginationExample,
  '/components/progress-bar':       ProgressBarExample,
  '/components/progress-bar-base':  ProgressBarBaseExample,
  '/components/progress-ring':      ProgressRingExample,
  '/components/radio':              RadioExample,
  '/components/search-field':       SearchFieldExample,
  '/components/segmented-button':   SegmentedButtonExample,
  '/components/separator':          SeparatorExample,
  '/components/slider':             SliderExample,
  '/components/switch':             SwitchExample,
  '/components/tag':                TagExample,
  '/components/text-area':          TextAreaExample,
  '/components/text-field':         TextFieldExample,
  '/components/text-input':         TextInputExample,
  '/components/timeline':           TimelineExample,
  '/components/toast':              ToastExample,
  '/components/tooltip':            TooltipExample,
};


