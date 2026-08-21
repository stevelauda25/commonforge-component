import { Link } from 'react-router-dom';
import { cn } from '@commonforge/ui';
import type { RouteEntry } from '../../lib/routes.js';
import { getComponentIcon } from './component-icons.js';

interface Props {
  entry: RouteEntry;
}

export function ComponentTile({ entry }: Props) {
  const isReady = entry.status === 'ready' || entry.category === 'foundation';
  const Icon = getComponentIcon(entry.path);

  return (
    <Link
      to={entry.path}
      className={cn(
        'group flex min-h-[160px] flex-col justify-between rounded-xl border border-default bg-canvas transition-all duration-fast',
        'hover:border-strong hover:bg-muted/20 hover:shadow-sm',
      )}
    >
      <div className="flex items-start justify-between p-4">
        <div className="text-subtle transition-colors group-hover:text-default">
          <Icon className="h-5 w-5 stroke-[1.5]" />
        </div>
        {!isReady && (
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
            Planned
          </span>
        )}
      </div>

      <div className="border-t border-dashed border-subtle/80 p-4">
        <h3 className="text-sm font-semibold text-default transition-colors group-hover:text-brand">
          {entry.label}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-subtle">
          {entry.description || `Explore ${entry.label.toLowerCase()} styles and usage guidance.`}
        </p>
      </div>
    </Link>
  );
}
