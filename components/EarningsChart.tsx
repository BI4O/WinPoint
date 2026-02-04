'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Card from './Card';

interface EarningsData {
  month: string;
  amount: number;
}

interface EarningsChartProps {
  data: EarningsData[];
}

export default function EarningsChart({ data }: EarningsChartProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-md-on-background">
          收益历史
        </h3>
        <span className="text-xs text-md-on-surface-variant px-3 py-1 rounded-full bg-md-surface-container-high">
          最近 {data.length} 个月
        </span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6750a4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6750a4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--color-md-outline)" opacity={0.2} />
          <XAxis
            dataKey="month"
            stroke="var(--color-md-on-surface-variant)"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tickLine={false}
          />
          <YAxis
            stroke="var(--color-md-on-surface-variant)"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-md-surface-container)',
              border: '1px solid var(--color-md-outline)',
              borderRadius: '16px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-md-on-surface)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, '收益']}
            labelStyle={{ color: 'var(--color-md-on-surface-variant)', fontSize: '12px' }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#6750a4"
            strokeWidth={3}
            fill="url(#earningsGradient)"
            activeDot={{
              r: 6,
              fill: '#6750a4',
              stroke: '#fff',
              strokeWidth: 2
            }}
            dot={{ fill: '#6750a4', r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
