'use client';

import { motion } from 'framer-motion';
import Card from './Card';
import OrderBookEntry from './OrderBookEntry';
import { type OrderBook as OrderBookType } from '@/lib/mock-data';

interface OrderBookProps {
  orderBook: OrderBookType;
  onPriceClick: (price: number) => void;
}

export default function OrderBook({ orderBook, onPriceClick }: OrderBookProps) {
  return (
    <Card className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 标题和价格信息 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-md-on-surface mb-2">订单簿</h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-md-on-surface-variant">最新价格:</span>
            <span className="text-2xl font-bold font-mono text-success">
              {orderBook.lastPrice.toFixed(4)}
            </span>
            <span className={`text-sm ${orderBook.priceChange24h >= 0 ? 'text-success' : 'text-error'}`}>
              {orderBook.priceChange24h >= 0 ? '+' : ''}
              {orderBook.priceChange24h.toFixed(4)} ({orderBook.priceChangePercent24h >= 0 ? '+' : ''}
              {orderBook.priceChangePercent24h.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* 订单簿双列布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 卖单 */}
          <div>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-error mb-2">卖单</h3>
              <div className="grid grid-cols-3 gap-2 px-3 py-2 text-sm font-medium text-md-on-surface-variant">
                <span>价格 (USDT)</span>
                <span className="text-right">数量 (RWA)</span>
                <span className="text-right">总额 (USDT)</span>
              </div>
            </div>
            <div className="space-y-1 bg-md-surface-container-low/30 rounded-2xl overflow-hidden">
              {orderBook.sellOrders.map((order, index) => (
                <OrderBookEntry
                  key={`sell-${index}`}
                  order={order}
                  type="sell"
                  onClick={onPriceClick}
                />
              ))}
            </div>
          </div>

          {/* 买单 */}
          <div>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-success mb-2">买单</h3>
              <div className="grid grid-cols-3 gap-2 px-3 py-2 text-sm font-medium text-md-on-surface-variant">
                <span>价格 (USDT)</span>
                <span className="text-right">数量 (RWA)</span>
                <span className="text-right">总额 (USDT)</span>
              </div>
            </div>
            <div className="space-y-1 bg-md-surface-container-low/30 rounded-2xl overflow-hidden">
              {orderBook.buyOrders.map((order, index) => (
                <OrderBookEntry
                  key={`buy-${index}`}
                  order={order}
                  type="buy"
                  onClick={onPriceClick}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Card>
  );
}
