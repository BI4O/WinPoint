'use client';

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './Card';
import TimeRangeSelector, { TimeRange } from './TimeRangeSelector';
import EarningsTooltip from './EarningsTooltip';
import {
  mockEarningsDaily,
  mockEarningsWeekly,
  mockEarningsMonthly,
  mockEarningsYearly,
  type EarningsData
} from '@/lib/mock-data';

interface EarningsChartProps {
  data?: EarningsData[];
}

const formatXAxis = (value: string, range: TimeRange) => {
  const date = new Date(value);

  switch (range) {
    case 'day':
      return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    case 'week':
      return value.split('-')[1]?.replace('W', 'W') || value;
    case 'month':
      return `${date.getMonth() + 1}月`;
    case 'year':
      return value;
    default:
      return value;
  }
};

const formatTooltipLabel = (value: string, range: TimeRange) => {
  const date = new Date(value);

  switch (range) {
    case 'day':
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    case 'week':
      return `第${value.split('-')[1]?.replace('W', '')}周`;
    case 'month':
      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    case 'year':
      return `${date.getFullYear()}年`;
    default:
      return value;
  }
};

export default function EarningsChart({ data }: EarningsChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const chartData = useMemo(() => {
    switch (timeRange) {
      case 'day':
        return mockEarningsDaily;
      case 'week':
        return mockEarningsWeekly;
      case 'month':
        return mockEarningsMonthly;
      case 'year':
        return mockEarningsYearly;
      default:
        return data || mockEarningsMonthly;
    }
  }, [timeRange, data]);

  // 根据时间维度计算显示的收益值和标签
  const earningsInfo = useMemo(() => {
    if (chartData.length === 0) return { value: 0, label: '累计收益' };

    const lastValue = chartData[chartData.length - 1].amount;

    // 日/周视图：显示"本月待发放收益"
    if (timeRange === 'day' || timeRange === 'week') {
      return { value: lastValue, label: '本月待发放' };
    }

    // 月/年视图：显示"历史总收益"
    return { value: lastValue, label: '历史总收益' };
  }, [chartData, timeRange]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-md-on-background">
                收益历史
              </h3>
              <EarningsTooltip />
            </div>
            <p className="text-xs text-md-on-surface-variant mt-1">
              {earningsInfo.label}: <span className="text-md-primary font-semibold">${earningsInfo.value.toFixed(2)}</span>
            </p>
          </div>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6750a4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6750a4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--color-md-outline)" opacity={0.2} />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatXAxis(value, timeRange)}
            stroke="var(--color-md-on-surface-variant)"
            style={{ fontSize: '11px', fontWeight: 500 }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="var(--color-md-on-surface-variant)"
            style={{ fontSize: '11px', fontWeight: 500 }}
            tickLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            labelFormatter={(value) => formatTooltipLabel(value as string, timeRange)}
            contentStyle={{
              backgroundColor: 'var(--color-md-surface-container)',
              border: '1px solid var(--color-md-outline)',
              borderRadius: '16px',
              padding: '12px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--color-md-on-surface)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number | undefined, name: string | undefined, props: any) => {
              if (value === undefined || name === undefined) return ['', ''];
              const item = props.payload as EarningsData;
              // 日/周视图
              if (timeRange === 'day' || timeRange === 'week') {
                if (item.isPaid) {
                  return [`$${value.toFixed(2)}`, '本月待发放 (已发放)'];
                }
                return [`$${value.toFixed(2)}`, '本月待发放'];
              }
              // 月/年视图
              if (item.isPaid) {
                return [`$${value.toFixed(2)}`, '历史总收益'];
              }
              return [`$${value.toFixed(2)}`, '收益'];
            }}
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
            dot={(props) => {
              const { cx, cy, payload } = props;
              const item = payload as EarningsData;
              // 已发放的点用绿色显示
              if (item.isPaid) {
                return <circle cx={cx} cy={cy} r={5} fill="#10b981" strokeWidth={2} stroke="#fff" />;
              }
              return <circle cx={cx} cy={cy} r={4} fill="#6750a4" strokeWidth={0} />;
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* 图例说明 */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-md-on-surface-variant">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-md-primary" />
          <span>{timeRange === 'day' || timeRange === 'week' ? '本月待发放' : '历史总收益'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-md-success" />
          <span>已发放</span>
        </div>
      </div>
    </Card>
  );
}
