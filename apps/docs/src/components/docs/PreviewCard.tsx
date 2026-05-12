import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function PreviewCard({ children }: Props) {
  return (
    <div className="preview-card my-6 overflow-hidden rounded-lg border border-border-default bg-canvas">
      <div className="flex min-h-[160px] items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}
