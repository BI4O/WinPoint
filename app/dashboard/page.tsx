'use client';

import { motion } from 'framer-motion';
import { Coins, Share2, TrendingUp } from 'lucide-react';
import { useStore } from '@/lib/store';
import AssetCard from '@/components/AssetCard';

export default function DashboardPage() {
  const user = useStore((state) => state.user);

  return (
    <div className="min-h-screen bg-md-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-md-on-background mb-2">
            我的资产
          </h1>
          <p className="text-md-on-surface-variant">
            查看您的 Credit、Share 和收益情况
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AssetCard
            title="Credit"
            value={user.credit.toFixed(2)}
            subtitle="可用余额"
            icon={Coins}
          />
          <AssetCard
            title="Share"
            value={user.share.toFixed(2)}
            subtitle="持有份额"
            icon={Share2}
          />
          <AssetCard
            title="收益"
            value={`$${user.earnings.toFixed(2)}`}
            subtitle="累计收益"
            icon={TrendingUp}
          />
        </div>
      </div>
    </div>
  );
}
