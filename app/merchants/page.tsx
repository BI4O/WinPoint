'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { mockMerchants, type Merchant } from '@/lib/mock-data';
import MerchantCard from '@/components/MerchantCard';
import AtmosphericBackground from '@/components/AtmosphericBackground';

export default function MerchantsPage() {
  const router = useRouter();

  const handleMerchantClick = (merchant: Merchant) => {
    // 跳转到店铺详情页
    router.push(`/merchants/${merchant.id}`);
  };

  return (
    <AtmosphericBackground className="min-h-screen bg-md-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-md-primary to-md-secondary-container flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏪</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-md-on-background">
                合作商家
              </h1>
            </div>
          </div>
          <p className="text-md-on-surface-variant ml-1">
            在合作商家消费，赚取 积分 奖励，开启收益之旅
          </p>
        </motion.div>

        {/* Merchants Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {mockMerchants.map((merchant, index) => (
            <motion.div
              key={merchant.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, type: 'tween', duration: 0.5, ease: [0.2, 0, 0, 1] }}
            >
              <MerchantCard
                merchant={merchant}
                onConsume={() => handleMerchantClick(merchant)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AtmosphericBackground>
  );
}
