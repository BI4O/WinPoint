'use client';

import { useMemo } from 'react';
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from 'recharts';
import Card from './Card';
import { mockKLineData, type KLineData } from '@/lib/mock-data';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KLineChart() {
  const latestData = useMemo(() => {
    if (mockKLineData.length === 0) return null;
    const latest = mockKLineData[mockKLineData.length - 1];
    const previous = mockKLineData[mockKLineData.length - 2];
    const change = latest.close - previous.close;
    const changePercent = (change / previous.close) * 100;
    return { latest, change, changePercent };
  }, []);

  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 自定义 K 线柱状图 - 使用 Bar 的 shape 属性
  const CandlestickShape = (props: any) => {
    const { x, y, width, height, index } = props;

    if (index === undefined || !mockKLineData[index]) return null;

    const data = mockKLineData[index];
    const { open, close, high, low } = data;
    const isUp = close >= open;
    const color = isUp ? '#10b981' : '#ef4444';

    // 获取Y轴的范围来计算坐标
    // y 对应图表顶部，y + height 对应图表底部
    // 我们需要找到数据的最小值和最大值来计算比例
    const allValues = mockKLineData.flatMap(d => [d.open, d.close, d.high, d.low]);
    const dataMin = Math.min(...allValues);
    const dataMax = Math.max(...allValues);
    const range = dataMax - dataMin;
    const padding = range * 0.05; // 5% padding
    const yMin = dataMin - padding;
    const yMax = dataMax + padding;
    const yRange = yMax - yMin;

    // 计算各个价格点的 Y 坐标
    const yHigh = y + ((yMax - high) / yRange) * height;
    const yLow = y + ((yMax - low) / yRange) * height;
    const yOpen = y + ((yMax - open) / yRange) * height;
    const yClose = y + ((yMax - close) / yRange) * height;

    // 实体的上下边界
    const bodyTop = Math.min(yOpen, yClose);
    const bodyBottom = Math.max(yOpen, yClose);
    const bodyHeight = Math.max(Math.abs(bodyBottom - bodyTop), 1);

    const centerX = x + width / 2;
    const bodyWidth = Math.max(width * 0.6, 2);
    const bodyLeft = centerX - bodyWidth / 2;

    return (
      <g>
        {/* 上影线 */}
        <line
          x1={centerX}
          y1={yHigh}
          x2={centerX}
          y2={bodyTop}
          stroke={color}
          strokeWidth={1}
        />
        {/* 实体 */}
        <rect
          x={bodyLeft}
          y={bodyTop}
          width={bodyWidth}
          height={bodyHeight}
          fill={color}
          stroke={color}
          strokeWidth={1}
        />
        {/* 下影线 */}
        <line
          x1={centerX}
          y1={bodyBottom}
          x2={centerX}
          y2={yLow}
          stroke={color}
          strokeWidth={1}
        />
      </g>
    );
  };

  if (!latestData) return null;

  return (
    <Card className="h-full">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-md-on-background">
            $RWA 价格
          </h3>
          <span className="text-xs text-md-on-surface-variant px-3 py-1 rounded-full bg-md-surface-container-high">
            实时
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-md-on-background">
            ${latestData.latest.close.toFixed(2)}
          </span>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            latestData.changePercent >= 0 ? 'text-md-success' : 'text-md-error'
          }`}>
            {latestData.changePercent >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {latestData.changePercent >= 0 ? '+' : ''}
              {latestData.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex gap-4 mt-3 text-xs text-md-on-surface-variant">
          <div>
            <span className="text-md-outline">开:</span>
            <span className="ml-1 font-medium">${latestData.latest.open.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-md-outline">高:</span>
            <span className="ml-1 font-medium text-md-success">${latestData.latest.high.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-md-outline">低:</span>
            <span className="ml-1 font-medium text-md-error">${latestData.latest.low.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-md-outline">量:</span>
            <span className="ml-1 font-medium">{latestData.latest.volume}</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={mockKLineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--color-md-outline)" opacity={0.2} />
          <XAxis
            dataKey="time"
            tickFormatter={formatDate}
            stroke="var(--color-md-on-surface-variant)"
            style={{ fontSize: '11px', fontWeight: 500 }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={['dataMin - 0.05', 'dataMax + 0.05']}
            stroke="var(--color-md-on-surface-variant)"
            style={{ fontSize: '11px', fontWeight: 500 }}
            tickLine={false}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-md-surface-container)',
              border: '1px solid var(--color-md-outline)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '12px',
              color: 'var(--color-md-on-surface)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const data = payload[0].payload as KLineData;
              const isUp = data.close >= data.open;

              return (
                <div className="bg-md-surface-container border border-md-outline rounded-xl p-3 text-xs">
                  <div className="font-medium text-md-on-background mb-2">
                    {new Date(data.time).toLocaleDateString('zh-CN')}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between gap-4">
                      <span className="text-md-on-surface-variant">开:</span>
                      <span className="font-medium">${data.open.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-md-on-surface-variant">高:</span>
                      <span className="font-medium text-md-success">${data.high.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-md-on-surface-variant">低:</span>
                      <span className="font-medium text-md-error">${data.low.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-md-on-surface-variant">收:</span>
                      <span className={`font-medium ${isUp ? 'text-md-success' : 'text-md-error'}`}>
                        ${data.close.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 pt-1 border-t border-md-outline/20">
                      <span className="text-md-on-surface-variant">量:</span>
                      <span className="font-medium">{data.volume}</span>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Bar
            dataKey="close"
            shape={CandlestickShape}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}
