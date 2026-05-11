import { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ChartCard({ title, subtitle, action, children, className }: Props) {
  return (
    <div
      className={
        'flex flex-col gap-4 rounded-xl border border-border-default bg-surface p-5 shadow-sm ' +
        (className ?? '')
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {subtitle ? (
            <p className="text-xs text-text-muted">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="min-h-[260px] w-full">{children}</div>
    </div>
  );
}
