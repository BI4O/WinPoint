# 商户数据概览升级 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将商户后台管理的"数据概览"升级为带趋势图的 Tab 式仪表盘

**Architecture:**
- 新增 `MerchantStatsChart` 组件展示折线图
- 在 `mock-data.ts` 中生成30天模拟数据
- 在 `merchant/manage/page.tsx` 中集成 Tab 和图表

**Tech Stack:** Next.js 16, Recharts, Tailwind CSS v4, Framer Motion

---

## File Structure

```
lib/
├── mock-data.ts               [MODIFY - 添加30天模拟数据]

components/
├── MerchantStatsChart.tsx     [CREATE - 趋势图组件]

app/
├── merchant/manage/page.tsx   [MODIFY - 集成Tab和图表]
```

---

## Task 1: Add mock data for 30-day stats

**Files:**
- Modify: `lib/mock-data.ts`

- [ ] **Step 1: Read mock-data.ts to find where to add new data**

- [ ] **Step 2: Add StatsDataPoint interface after existing interfaces**

```typescript
// 统计数据点接口
export interface StatsDataPoint {
  date: string;    // '2026-03-01'
  value: number;
}
```

- [ ] **Step 3: Add function to generate 30-day mock data after interfaces**

```typescript
// 生成30天统计数据
const generateStatsData = (
  baseValue: number,
  volatility: number,
  trend: 'up' | 'down' | 'flat'
): StatsDataPoint[] => {
  const data: StatsDataPoint[] = [];
  const today = new Date('2026-04-03');

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const randomChange = (Math.random() - 0.5) * volatility;
    const trendFactor = trend === 'up' ? 0.02 : trend === 'down' ? -0.02 : 0;
    const trendValue = baseValue * (1 + trendFactor * (29 - i));

    const value = Math.max(0, Math.round(trendValue + randomChange));

    data.push({
      date: date.toISOString().split('T')[0],
      value
    });
  }

  return data;
};
```

- [ ] **Step 4: Add 30-day mock data constants after generateStatsData**

```typescript
// 30天统计数据
export const mockSalesData: StatsDataPoint[] = generateStatsData(1000, 200, 'up');
export const mockWinData: StatsDataPoint[] = generateStatsData(500, 150, 'flat');
export const mockOrdersData: StatsDataPoint[] = generateStatsData(50, 20, 'up');
export const mockStockData: StatsDataPoint[] = generateStatsData(200, 30, 'down');
```

- [ ] **Step 5: Verify lint and commit**

```bash
pnpm run lint 2>&1 | head -20
git add lib/mock-data.ts && git commit -m "feat: add 30-day stats mock data for merchant dashboard"
```

---

## Task 2: Create MerchantStatsChart component

**Files:**
- Create: `components/MerchantsStatsChart.tsx`

- [ ] **Step 1: Create MerchantStatsChart component**

```typescript
'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './Card';
import {
  mockSalesData,
  mockWinData,
  mockOrdersData,
  mockStockData,
  type StatsDataPoint
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
              formatter={(value: number) => [formatTooltip(value, config.unit), config.label]}
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
```

- [ ] **Step 2: Verify lint and commit**

```bash
pnpm run lint 2>&1 | head -20
git add components/MerchantStatsChart.tsx && git commit -m "feat: add MerchantStatsChart component"
```

---

## Task 3: Integrate into merchant manage page

**Files:**
- Modify: `app/merchant/manage/page.tsx`

- [ ] **Step 1: Add import for MerchantStatsChart**

```typescript
import MerchantStatsChart from '@/components/MerchantStatsChart';
```

- [ ] **Step 2: Add chart section after the Stats Overview section**

Find the section after the warning lists (around line 175) and before the Tabs section, add:

```typescript
        {/* 数据趋势图表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <MerchantStatsChart />
        </motion.div>
```

- [ ] **Step 3: Verify lint and commit**

```bash
pnpm run lint 2>&1 | head -20
git add app/merchant/manage/page.tsx && git commit -m "feat: integrate stats chart into merchant manage page"
```

---

## Final Verification Checklist

- [ ] Tab 切换正常工作
- [ ] 4个指标数据正确显示
- [ ] 折线图不带点，纯色显示
- [ ] 暖色调颜色正确
- [ ] 统计数值（总计/日均/最高/最低）正确
- [ ] Tooltip 正常显示
- [ ] build 通过

---

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
