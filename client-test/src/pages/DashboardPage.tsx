import { Button } from '@commonforge/ui';
import { Download } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartCard } from '../components/chart-card/ChartCard';
import { StatCard } from '../components/stat-card/StatCard';
import { ActivityList } from '../components/activity-list/ActivityList';
import {
  recentActivity,
  revenueByMonth,
  stats,
  trafficBySource,
} from '../data/mock';

const tooltipStyle: React.CSSProperties = {
  background: 'rgb(var(--color-bg-raised))',
  border: '1px solid rgb(var(--color-border-default))',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'rgb(var(--color-text-primary))',
  boxShadow: 'var(--shadow-md)',
};

const labelStyle: React.CSSProperties = {
  color: 'rgb(var(--color-text-muted))',
  fontSize: '11px',
};

const tickStyle = {
  fill: 'rgb(var(--color-text-muted))',
  fontSize: 11,
};

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.id}
            label={s.label}
            value={s.value}
            delta={s.delta}
            trend={s.trend}
          />
        ))}
      </section>

      <ChartCard
        title="Revenue vs expenses"
        subtitle="Last 12 months"
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download size={14} />}
          >
            Export
          </Button>
        }
      >
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={revenueByMonth}
            margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgb(var(--color-border-subtle))"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={tickStyle}
              tickLine={false}
              axisLine={{ stroke: 'rgb(var(--color-border-default))' }}
            />
            <YAxis
              tick={tickStyle}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              contentStyle={tooltipStyle}
              labelStyle={labelStyle}
              cursor={{
                stroke: 'rgb(var(--color-border-default))',
                strokeDasharray: '3 3',
              }}
              formatter={(v) => `$${(v as number).toLocaleString()}`}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="rgb(var(--color-accent-default))"
              strokeWidth={2.25}
              dot={false}
              activeDot={{
                r: 4,
                fill: 'rgb(var(--color-accent-default))',
                stroke: 'rgb(var(--color-bg-canvas))',
                strokeWidth: 2,
              }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="rgb(var(--color-text-muted))"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Traffic by source" subtitle="Visits this month">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={trafficBySource}
              margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgb(var(--color-border-subtle))"
                vertical={false}
              />
              <XAxis
                dataKey="source"
                tick={tickStyle}
                tickLine={false}
                axisLine={{ stroke: 'rgb(var(--color-border-default))' }}
              />
              <YAxis
                tick={tickStyle}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
              />
              <ChartTooltip
                contentStyle={tooltipStyle}
                labelStyle={labelStyle}
                cursor={{ fill: 'rgb(var(--color-bg-muted))' }}
                formatter={(v) => (v as number).toLocaleString()}
              />
              <Bar
                dataKey="visits"
                fill="rgb(var(--color-accent-default))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recent activity" subtitle="Across the team">
          <ActivityList items={recentActivity} />
        </ChartCard>
      </section>
    </div>
  );
}
