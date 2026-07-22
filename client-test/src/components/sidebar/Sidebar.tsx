import { Tooltip, Button } from 'cf-ui';
import {
  BarChart3,
  Home,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, active: true },
  { id: 'reports', label: 'Reports', icon: BarChart3, active: false },
  { id: 'customers', label: 'Customers', icon: Users, active: false },
  { id: 'settings', label: 'Settings', icon: Settings, active: false },
];

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof document === 'undefined') return true;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('pod-client-theme', dark ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }, [dark]);

  return (
    <Tooltip content={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <Button
        variant="outline"
        size="sm"
        iconOnly
        leftIcon={dark ? <Sun size={16} /> : <Moon size={16} />}
        onClick={() => setDark((d) => !d)}
        aria-label="Toggle color theme"
      />
    </Tooltip>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border-default bg-surface">
      <div className="flex h-16 items-center gap-2 border-b border-border-default px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg shadow-glow-accent-inset">
          <Sparkles size={16} />
        </div>
        <span className="text-base font-semibold tracking-tight text-text-primary">
          POD
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href="#"
              aria-current={item.active ? 'page' : undefined}
              className={
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ' +
                (item.active
                  ? 'bg-accent-subtle font-medium text-accent'
                  : 'text-text-muted hover:bg-muted hover:text-text-primary')
              }
            >
              <Icon size={16} />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t border-border-default p-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-text-primary">
            NI
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">
              Naufal
            </p>
            <p className="truncate text-xs text-text-muted">eng@blissful.design</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}
