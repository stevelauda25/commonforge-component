import { Package } from 'lucide-react';

export function EmptyComponentState() {
  return (
    <div className="my-8 flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border-strong bg-muted/30 p-12 text-center">
      <Package className="h-10 w-10 text-text-muted" aria-hidden="true" />
      <div>
        <p className="text-lg font-semibold text-text-primary">Coming Soon</p>
        <p className="mt-1 text-sm text-text-muted">
          This component is planned for an upcoming sprint.
        </p>
      </div>
    </div>
  );
}
