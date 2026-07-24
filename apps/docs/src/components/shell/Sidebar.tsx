import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@commonforge/ui';
import {
  routes,
  componentRoutes,
  foundationRoutes,
  resourceRoutes,
  groupMeta,
} from '../../lib/routes.js';

const STORAGE_KEY = 'pod-docs-sidebar-groups';

function readGroupState(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeGroupState(state: Record<string, boolean>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface NavItemProps {
  to: string;
  label: string;
  status?: 'ready' | 'planned';
  onNavigate?: () => void;
}

function NavItem({ to, label, status, onNavigate }: NavItemProps) {
  if (status === 'planned') {
    return (
      <div
        aria-disabled="true"
        title="Coming soon"
        className="relative flex cursor-not-allowed items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-subtle opacity-50"
      >
        <span className="truncate">{label}</span>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      end
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors duration-fast ease-standard',
          isActive
            ? 'bg-muted text-default font-medium'
            : 'text-subtle hover:bg-muted/60 hover:text-default',
        )
      }
    >
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

interface GroupProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

function Group({ id, label, children }: GroupProps) {
  const [open, setOpen] = useState(() => readGroupState()[id] ?? true);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    const state = readGroupState();
    state[id] = next;
    writeGroupState(state);
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted transition-colors duration-fast hover:text-subtle"
      >
        <span>{label}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-base ease-standard',
            open && 'rotate-180',
          )}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-base ease-standard"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-1 flex flex-col gap-px border-l border-subtle ml-[15px] pl-[7px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const top = routes.filter((r) => r.category === 'top');

  return (
    <aside className="sticky top-14 flex h-[calc(100vh-3.5rem)] w-64 shrink-0 flex-col gap-3 overflow-y-auto border-r border-default bg-canvas px-3 py-5">
      <nav className="flex flex-col gap-px">
        {top.map((r) => (
          <NavItem
            key={r.path}
            to={r.path}
            label={r.label}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {foundationRoutes.length > 0 && (
        <Group {...groupMeta.foundations}>
          {foundationRoutes.map((r) => (
            <NavItem
              key={r.path}
              to={r.path}
              label={r.label}
              onNavigate={onNavigate}
            />
          ))}
        </Group>
      )}

      {componentRoutes.length > 0 && (
        <Group {...groupMeta.components}>
          {componentRoutes.map((r) => (
            <NavItem
              key={r.path}
              to={r.path}
              label={r.label}
              status={r.status}
              onNavigate={onNavigate}
            />
          ))}
        </Group>
      )}

      {resourceRoutes.length > 0 && (
        <Group {...groupMeta.resources}>
          {resourceRoutes.map((r) => (
            <NavItem
              key={r.path}
              to={r.path}
              label={r.label}
              onNavigate={onNavigate}
            />
          ))}
        </Group>
      )}
    </aside>
  );
}
