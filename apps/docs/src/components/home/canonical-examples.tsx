import { useState, type ComponentType } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Switch,
  Tag,
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

export const canonicalExamples: Record<string, ComponentType> = {
  '/components/button': ButtonExample,
  '/components/badge': BadgeExample,
  '/components/checkbox': CheckboxExample,
  '/components/switch': SwitchExample,
  '/components/tag': TagExample,
  '/components/tooltip': TooltipExample,
};
