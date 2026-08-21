import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, Search, X, House, BookOpen } from 'lucide-react';
import { cn } from '@commonforge/ui';
import {
  routes,
  componentRoutes,
  foundationRoutes,
  resourceRoutes,
  groupMeta,
  type RouteEntry,
} from '../../lib/routes.js';
import { getComponentIcon } from '../home/component-icons.js';

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
  path?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onNavigate?: () => void;
}

function NavItem({ to, label, status, path, icon: CustomIcon, onNavigate }: NavItemProps) {
  const Icon = CustomIcon ?? (path ? getComponentIcon(path) : null);

  if (status === 'planned') {
    return (
      <div
        aria-disabled="true"
        title="Coming soon"
        className="flex cursor-not-allowed items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-subtle opacity-40"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
          <span className="truncate">{label}</span>
        </div>
        <span className="rounded bg-muted px-1 py-0.2 text-[9px] font-mono uppercase text-muted">
          Soon
        </span>
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
          'group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-all duration-fast',
          isActive
            ? 'bg-neutral-900 text-white font-medium shadow-xs dark:bg-neutral-100 dark:text-neutral-900'
            : 'text-subtle hover:bg-muted/70 hover:text-default',
        )
      }
    >
      <div className="flex items-center gap-2.5 truncate">
        {Icon && (
          <Icon className="h-3.5 w-3.5 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" />
        )}
        <span className="truncate">{label}</span>
      </div>
    </NavLink>
  );
}

interface GroupProps {
  id: string;
  label: string;
  count?: number;
  children: React.ReactNode;
}

function Group({ id, label, count, children }: GroupProps) {
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
        className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-[11px] font-semibold tracking-wider text-muted uppercase transition-colors hover:text-default"
      >
        <span className="flex items-center gap-1.5">
          {label}
          {typeof count === 'number' && (
            <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-normal text-muted">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'h-3.5 w-3.5 text-muted transition-transform duration-base ease-standard',
            open && 'rotate-180',
          )}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-base ease-standard"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-1 flex flex-col gap-0.5 pl-1">
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
  const [filter, setFilter] = useState('');
  const top = routes.filter((r) => r.category === 'top');

  const filterItem = (r: RouteEntry) =>
    r.label.toLowerCase().includes(filter.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(filter.toLowerCase()));

  const filteredFoundations = useMemo(
    () => (filter ? foundationRoutes.filter(filterItem) : foundationRoutes),
    [filter],
  );

  const filteredComponents = useMemo(
    () => (filter ? componentRoutes.filter(filterItem) : componentRoutes),
    [filter],
  );

  const filteredResources = useMemo(
    () => (filter ? resourceRoutes.filter(filterItem) : resourceRoutes),
    [filter],
  );

  return (
    <aside className="sticky top-14 flex h-[calc(100vh-3.5rem)] w-64 shrink-0 flex-col gap-3 overflow-y-auto border-r border-default bg-canvas px-3 py-4">
      {/* Quick Search / Filter */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter components..."
          className="w-full rounded-lg border border-default bg-surface py-1.5 pr-7 pl-8 text-xs text-default placeholder:text-muted transition-colors focus:border-strong focus:outline-hidden"
        />
        {filter && (
          <button
            type="button"
            onClick={() => setFilter('')}
            className="absolute top-2.5 right-2 text-muted hover:text-default"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Main Top Navigation */}
      {!filter && (
        <nav className="flex flex-col gap-0.5">
          {top.map((r) => (
            <NavItem
              key={r.path}
              to={r.path}
              label={r.label}
              icon={r.path === '/' ? House : BookOpen}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      )}

      {/* Foundations Group */}
      {filteredFoundations.length > 0 && (
        <Group
          id={groupMeta.foundations.id}
          label={groupMeta.foundations.label}
          count={foundationRoutes.length}
        >
          {filteredFoundations.map((r) => (
            <NavItem
              key={r.path}
              to={r.path}
              label={r.label}
              path={r.path}
              onNavigate={onNavigate}
            />
          ))}
        </Group>
      )}

      {/* Components Group */}
      {filteredComponents.length > 0 && (
        <Group
          id={groupMeta.components.id}
          label={groupMeta.components.label}
          count={componentRoutes.length}
        >
          {filteredComponents.map((r) => (
            <NavItem
              key={r.path}
              to={r.path}
              label={r.label}
              path={r.path}
              status={r.status}
              onNavigate={onNavigate}
            />
          ))}
        </Group>
      )}

      {/* Resources Group */}
      {filteredResources.length > 0 && (
        <Group
          id={groupMeta.resources.id}
          label={groupMeta.resources.label}
          count={resourceRoutes.length}
        >
          {filteredResources.map((r) => (
            <NavItem
              key={r.path}
              to={r.path}
              label={r.label}
              path={r.path}
              onNavigate={onNavigate}
            />
          ))}
        </Group>
      )}

      {/* Empty Filter State */}
      {filter &&
        filteredFoundations.length === 0 &&
        filteredComponents.length === 0 &&
        filteredResources.length === 0 && (
          <div className="py-8 text-center text-xs text-muted">
            No components found for &ldquo;{filter}&rdquo;
          </div>
        )}
    </aside>
  );
}
