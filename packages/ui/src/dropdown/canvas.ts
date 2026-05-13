import type { CanvasComponent } from '../canvas-types.js';

export const dropdownCanvas: CanvasComponent = {
  name: 'Dropdown',
  importFrom: 'pod-test-ui/dropdown',
  variants: ['default', 'tags'],
  sizes: ['sm', 'md'],
  defaultProps: { label: 'Label', placeholder: 'Select', hint: 'This is a hint text to help user.' },
  examples: [
    {
      label: 'Interactive',
      props: {},
      // Composite snippet — function component with open state + menu items.
      // Clicking the trigger on canvas toggles a real popup.
      code: `function InteractiveDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  return (
    <div className="relative w-[240px]">
      <Dropdown
        label="Label"
        placeholder="Select"
        hint="This is a hint text to help user."
        open={open}
        selectedLabel={selected ?? undefined}
        onClick={() => setOpen((o) => !o)}
      />
      {open && (
        <DropdownMenu className="absolute z-10 mt-1 w-full">
          <DropdownItem
            selected={selected === 'Option A'}
            showSelectedMark
            onClick={() => { setSelected('Option A'); setOpen(false); }}
          >
            Option A
          </DropdownItem>
          <DropdownItem
            selected={selected === 'Option B'}
            showSelectedMark
            onClick={() => { setSelected('Option B'); setOpen(false); }}
          >
            Option B
          </DropdownItem>
          <DropdownItem
            selected={selected === 'Option C'}
            showSelectedMark
            onClick={() => { setSelected('Option C'); setOpen(false); }}
          >
            Option C
          </DropdownItem>
        </DropdownMenu>
      )}
    </div>
  );
}`,
    },
    { label: 'Open', props: { open: true } },
    { label: 'Filled', props: { selectedLabel: 'Option A' } },
    {
      label: 'Tags filled',
      props: {
        variant: 'tags',
        tags: [
          { value: 'a', label: 'LABEL' },
          { value: 'b', label: 'LABEL' },
        ],
      },
    },
    { label: 'With error', props: { error: 'Required field' } },
    { label: 'Disabled', props: { disabled: true } },
  ],
  tokens: [
    'bg-canvas',
    'bg-muted',
    'border-default',
    'border-focus',
    'danger-default',
    'text-primary',
    'text-muted',
  ],
  // Sub-primitives that composite `Interactive` example references — runtime
  // must inject these into scope alongside `Dropdown`.
  extraScope: ['DropdownMenu', 'DropdownItem', 'DropdownBadge'],
};
