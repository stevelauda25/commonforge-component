import { useState, type ReactNode } from 'react';
import { Tab, type TabType } from 'pod-test-ui';

interface TabBarDemoItem {
  label: string;
  /** Optional shortcut letter, only renders for `tabType="screen-nav"`. */
  shortcut?: string;
  /** Optional leading icon, primarily for `tabType="menu"`. */
  icon?: ReactNode;
  /** Optional trailing icon when active (e.g. settings on Menu/Active). */
  trailingIcon?: ReactNode;
}

interface Props {
  /** Which Tab variant to render. */
  tabType: TabType;
  /** Items to render as tabs. */
  items: TabBarDemoItem[];
  /** Initially selected item label. Defaults to first item. */
  initialActive?: string;
  /** Optional caption shown left of the tab bar (e.g. "Menu", "Underline"). */
  caption?: string;
}

/**
 * Interactive horizontal tab bar — click to switch active. Used in docs
 * previews so readers can feel the interaction, not just see a static row.
 */
export function TabBarDemo({ tabType, items, initialActive, caption }: Props) {
  const [active, setActive] = useState(initialActive ?? items[0]?.label ?? '');
  return (
    <div className="flex w-full items-center gap-4">
      {caption && (
        <div className="w-24 shrink-0 text-xs font-medium uppercase tracking-wider text-text-muted">
          {caption}
        </div>
      )}
      <div role="tablist" className="flex flex-1 flex-wrap items-center gap-1">
        {items.map((item) => {
          const isActive = item.label === active;
          return (
            <Tab
              key={item.label}
              tabType={tabType}
              active={isActive}
              icon={item.icon}
              trailingIcon={isActive ? item.trailingIcon : undefined}
              shortcut={item.shortcut}
              onClick={() => setActive(item.label)}
            >
              {item.label}
            </Tab>
          );
        })}
      </div>
    </div>
  );
}
