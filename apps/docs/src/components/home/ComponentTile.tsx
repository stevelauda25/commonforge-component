import { Link } from 'react-router-dom';
import { cn } from '@pod/ui';
import type { RouteEntry } from '../../lib/routes.js';
import { canonicalExamples } from './canonical-examples.js';

interface Props {
  entry: RouteEntry;
}

export function ComponentTile({ entry }: Props) {
  const isReady = entry.status === 'ready';
  const Example = canonicalExamples[entry.path];

  return (
    <div
      className={cn(
        'group flex min-h-[200px] flex-col overflow-hidden rounded-lg border bg-surface',
        'transition-colors hover:border-border-strong',
        isReady ? 'border-border-default' : 'border-dashed border-border-default',
      )}
    >
      <Link
        to={entry.path}
        className="flex items-center justify-between border-b border-border-subtle px-3 py-2 hover:bg-muted/40 transition-colors"
      >
        <span
          className={cn(
            'text-xs font-medium',
            isReady ? 'text-text-secondary' : 'text-text-muted',
          )}
        >
          {entry.label}
        </span>
        {!isReady && (
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            Coming soon
          </span>
        )}
      </Link>
      <div
        className={cn(
          'flex flex-1 items-center justify-center p-6',
          !isReady && 'opacity-40',
        )}
      >
        {isReady && Example ? (
          <Example />
        ) : (
          <span className="text-xs text-text-muted">—</span>
        )}
      </div>
    </div>
  );
}
