export type Stat = {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: number[];
};

export type Activity = {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
};

export const stats: Stat[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    value: '$48,329',
    delta: 12.3,
    trend: [22, 28, 25, 31, 29, 36, 34, 40, 38, 44, 41, 48],
  },
  {
    id: 'active-users',
    label: 'Active users',
    value: '12,847',
    delta: 8.1,
    trend: [180, 195, 188, 210, 205, 225, 230, 245, 240, 260, 255, 280],
  },
  {
    id: 'conversion',
    label: 'Conversion rate',
    value: '3.42%',
    delta: -1.4,
    trend: [3.8, 3.7, 3.9, 3.6, 3.5, 3.7, 3.6, 3.5, 3.4, 3.5, 3.4, 3.42],
  },
  {
    id: 'mrr',
    label: 'MRR',
    value: '$24,108',
    delta: 5.7,
    trend: [18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22.5, 23, 23.5, 24.1],
  },
];

export const revenueByMonth = [
  { month: 'Jan', revenue: 24500, expenses: 18200 },
  { month: 'Feb', revenue: 28100, expenses: 19400 },
  { month: 'Mar', revenue: 26800, expenses: 19800 },
  { month: 'Apr', revenue: 32400, expenses: 21100 },
  { month: 'May', revenue: 31200, expenses: 21800 },
  { month: 'Jun', revenue: 36900, expenses: 23400 },
  { month: 'Jul', revenue: 38500, expenses: 24100 },
  { month: 'Aug', revenue: 42100, expenses: 25600 },
  { month: 'Sep', revenue: 40800, expenses: 26200 },
  { month: 'Oct', revenue: 45300, expenses: 27400 },
  { month: 'Nov', revenue: 44200, expenses: 27900 },
  { month: 'Dec', revenue: 48329, expenses: 28800 },
];

export const trafficBySource = [
  { source: 'Organic', visits: 12480 },
  { source: 'Direct', visits: 8210 },
  { source: 'Referral', visits: 5430 },
  { source: 'Social', visits: 4180 },
  { source: 'Email', visits: 2940 },
];

export const recentActivity: Activity[] = [
  {
    id: '1',
    user: 'Naufal',
    action: 'closed deal',
    target: 'Acme Corp · $12,400',
    timestamp: '2m ago',
  },
  {
    id: '2',
    user: 'Sarah',
    action: 'added customer',
    target: 'Globex Industries',
    timestamp: '14m ago',
  },
  {
    id: '3',
    user: 'Diego',
    action: 'updated pricing for',
    target: 'Pro plan',
    timestamp: '1h ago',
  },
  {
    id: '4',
    user: 'System',
    action: 'flagged anomaly in',
    target: 'EU region traffic',
    timestamp: '3h ago',
  },
  {
    id: '5',
    user: 'Mei',
    action: 'shipped feature',
    target: 'CSV export v2',
    timestamp: '5h ago',
  },
  {
    id: '6',
    user: 'Naufal',
    action: 'archived',
    target: 'Q3 campaign report',
    timestamp: '1d ago',
  },
];
