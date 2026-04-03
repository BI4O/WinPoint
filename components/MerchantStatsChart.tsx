'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './Card';
import {
  mockSalesData,
  mockWinData,
  mockOrdersData,
  mockStockData
} from '@/lib/mock-data';

type MetricType = 'sales' | 'win' | 'orders' | 'stock';

interface MerchantStatsChartProps {
  defaultMetric?: MetricType;
}

const METRIC_CONFIG = {
  sales: {
    label: '销售额',
    color: '#F97316',
    data: mockSalesData,
    unit: '¥'
  },
  win: {
    label: 'WIN积分',
    color: '#F59E0B',
    data: mockWinData,
    unit: ''
  },
  orders: {
    label: '订单量',
    color: '#FB7185',
    data: mockOrdersData,
    unit: '单'
  },
  stock: {
    label: '库存',
    color: '#F43F5E',
    data: mockStockData,
    unit: ''
  }
};

const formatXAxis = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const formatTooltip = (value: number, unit: string) => {
  return unit === '¥' ? `¥${value.toLocaleString()}` : `${value}${unit}`;
};

export default function MerchantStatsChart({ defaultMetric = 'sales' }: MerchantStatsChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricType>(defaultMetric);
  const config = METRIC_CONFIG[activeMetric];

  const chartData = useMemo(() => {
    return METRIC_CONFIG[activeMetric].data.map(item => ({
      ...item,
      value: Math.round(item.value)
    }));
  }, [activeMetric]);

  // 计算统计值
  const stats = useMemo(() => {
    const values = chartData.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / values.length);
    const max = Math.max(...values);
    const min = Math.min(...values);
    return { sum, avg, max, min };
  }, [chartData]);

  return (
    <Card className="p-6">
      {/* Tab Header */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(METRIC_CONFIG) as MetricType[]).map(key => (
          <button
            key={key}
            onClick={() => setActiveMetric(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeMetric === key
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: activeMetric === key ? METRIC_CONFIG[key].color : undefined
            }}
          >
            {METRIC_CONFIG[key].label}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: config.color }}>
            {formatTooltip(stats.sum, config.unit)}
          </p>
          <p className="text-xs text-gray-500">30天总计</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">
            {formatTooltip(stats.avg, config.unit)}
          </p>
          <p className="text-xs text-gray-500">日均</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">
            {formatTooltip(stats.max, config.unit)}
          </p>
          <p className="text-xs text-gray-500">最高</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">
            {formatTooltip(stats.min, config.unit)}
          </p>
          <p className="text-xs text-gray-500">最低</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e5e5" opacity={0.5} />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
            />
            <Tooltip
              labelFormatter={(label) => {
                const date = new Date(label);
                return `${date.getMonth() + 1}月${date.getDate()}日`;
              }}
              formatter={(value: number | undefined) => value !== undefined ? [formatTooltip(value, config.unit), config.label] : ['', '']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e5e5',
                borderRadius: '12px',
                padding: '8px 12px',
                fontSize: '13px'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: config.color, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-4">
        最近30天趋势
      </p>
    </Card>
  );
}
