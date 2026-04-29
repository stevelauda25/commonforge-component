import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function PreviewCard({ children }: Props) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border-default bg-surface">
      <div className="flex items-center justify-between border-b border-border-default bg-canvas px-4 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
          Preview
        </span>
      </div>
      <div className="flex min-h-[160px] items-center justify-center bg-muted/30 p-8">
        {children}
      </div>
    </div>
  );
}
