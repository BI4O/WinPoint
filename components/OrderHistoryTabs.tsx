'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import OrderHistoryTable from './OrderHistoryTable';
import { type TradeOrder } from '@/lib/mock-data';

interface OrderHistoryTabsProps {
  currentOrders: TradeOrder[];
  historicalOrders: TradeOrder[];
  onCancelOrder: (orderId: string) => void;
}

export default function OrderHistoryTabs({
  currentOrders,
  historicalOrders,
  onCancelOrder
}: OrderHistoryTabsProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'historical'>('current');

  return (
    <Card className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* 标签切换 */}
        <div className="flex border-b border-md-outline-variant/20">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'current'
                ? 'text-md-primary'
                : 'text-md-on-surface-variant hover:text-md-on-surface'
            }`}
          >
            当前挂单
            {activeTab === 'current' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-md-primary"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('historical')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
              activeTab === 'historical'
                ? 'text-md-primary'
                : 'text-md-on-surface-variant hover:text-md-on-surface'
            }`}
          >
            历史订单
            {activeTab === 'historical' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-md-primary"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'current' ? (
              <motion.div
                key="current"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <OrderHistoryTable
                  orders={currentOrders}
                  showActions={true}
                  onCancelOrder={onCancelOrder}
                />
              </motion.div>
            ) : (
              <motion.div
                key="historical"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <OrderHistoryTable orders={historicalOrders} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Card>
  );
}
