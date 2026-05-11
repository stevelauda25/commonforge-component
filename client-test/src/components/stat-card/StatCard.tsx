import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

type Props = {
  label: string;
  value: string;
  delta: number;
  trend: number[];
};

export function StatCard({ label, value, delta, trend }: Props) {
  const positive = delta >= 0;
  const data = trend.map((v, i) => ({ i, v }));

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-default bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-text-muted">{label}</p>
        <span
          className={
            'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium ' +
            (positive
              ? 'bg-success-subtle text-success'
              : 'bg-danger-subtle text-danger')
          }
        >
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(delta).toFixed(1)}%
        </span>
      </div>

      <div className="flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold tracking-tight text-text-primary">
          {value}
        </p>
        <div className="h-10 w-24 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={
                  positive
                    ? 'rgb(var(--color-success-default))'
                    : 'rgb(var(--color-danger-default))'
                }
                strokeWidth={1.75}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
