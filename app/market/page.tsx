'use client';

import { motion } from 'framer-motion';
import KLineChart from '@/components/KLineChart';
import SwapCard from '@/components/SwapCard';
import AtmosphericBackground from '@/components/AtmosphericBackground';

export default function MarketPage() {
  return (
    <AtmosphericBackground className="min-h-screen bg-md-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-md-on-background mb-2">
            交易市场
          </h1>
          <p className="text-md-on-surface-variant">
            实时查看 RWA 价格走势，随时进行交易
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧 K 线图 - 占 2/3 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="lg:col-span-2"
          >
            <KLineChart />
          </motion.div>

          {/* 右侧 Swap 卡片 - 占 1/3 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          >
            <SwapCard />
          </motion.div>
        </div>
      </div>
    </AtmosphericBackground>
  );
}
