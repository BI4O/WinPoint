'use client';

import { motion } from 'framer-motion';
import { Coins, Share2, TrendingUp, ArrowUpCircle, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { mockEarningsHistory } from '@/lib/mock-data';
import AssetCard from '@/components/AssetCard';
import EarningsChart from '@/components/EarningsChart';
import ActivityList from '@/components/ActivityList';
import Button from '@/components/Button';

export default function DashboardPage() {
  const user = useStore((state) => state.user);
  const activities = useStore((state) => state.activities);
  const router = useRouter();

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

        {/* Asset Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-md-on-background mb-4">
            快速操作
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="filled"
              size="lg"
              onClick={() => router.push('/stake')}
              className="flex items-center justify-center gap-2"
            >
              <ArrowUpCircle className="h-5 w-5" />
              质押 Credit
            </Button>
            <Button
              variant="tonal"
              size="lg"
              onClick={() => router.push('/merchants')}
              className="flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              浏览商家
            </Button>
          </div>
        </motion.div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <EarningsChart data={mockEarningsHistory} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ActivityList activities={activities} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
