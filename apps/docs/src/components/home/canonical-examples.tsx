import { useState, type ComponentType } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  SearchInput,
  Tab,
  TextInput,
} from 'pod-test-ui';

export function ButtonExample() {
  return (
    <Button
      leftIcon={<ChevronLeft className="h-4 w-4" />}
      rightIcon={<ChevronRight className="h-4 w-4" />}
    >
      Button
    </Button>
  );
}

export function TextInputExample() {
  return (
    <div className="w-full max-w-[220px]">
      <TextInput label="Email" placeholder="you@pod.com" />
    </div>
  );
}

export function CheckboxExample() {
  const [checked, setChecked] = useState<boolean>(true);
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={setChecked}
      label="Remember me"
    />
  );
}

export function SearchInputExample() {
  return (
    <div className="w-full max-w-[220px]">
      <SearchInput placeholder="Search…" />
    </div>
  );
}

export function DropdownExample() {
  return (
    <div className="w-full max-w-[220px]">
      <Dropdown placeholder="Select…" selectedLabel="Option" />
    </div>
  );
}

export function TabExample() {
  const [active, setActive] = useState('Activity');
  return (
    <div role="tablist" className="flex items-center gap-1">
      {['Overview', 'Activity', 'Settings'].map((t) => (
        <Tab
          key={t}
          tabType="underline"
          active={t === active}
          onClick={() => setActive(t)}
        >
          {t}
        </Tab>
      ))}
    </div>
  );
}

export function BadgeExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      <Badge color="green" closable={false}>READY</Badge>
      <Badge color="yellow" closable={false}>DRAFT</Badge>
      <Badge color="red" closable={false}>BLOCKED</Badge>
    </div>
  );
}

export const canonicalExamples: Record<string, ComponentType> = {
  '/components/button': ButtonExample,
  '/components/text-input': TextInputExample,
  '/components/checkbox': CheckboxExample,
  '/components/search-input': SearchInputExample,
  '/components/dropdown': DropdownExample,
  '/components/tab': TabExample,
  '/components/badge': BadgeExample,
};
