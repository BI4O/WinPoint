'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { mockMerchants, type Merchant } from '@/lib/mock-data';
import MerchantCard from '@/components/MerchantCard';
import { useStore } from '@/lib/store';
import AtmosphericBackground from '@/components/AtmosphericBackground';
import { useBrandInfo } from '@/hooks/useBrand';

export default function MerchantsPage() {
  const router = useRouter();

  const brandInfo = useBrandInfo();

  const identityMode = useStore(state => state.identityMode);
  const currentMerchantId = useStore(state => state.currentMerchantId);

  // 是否是 POPMART 用户模式（用户视角但限定在 POPMART）
  const isPopmartUserMode = identityMode === 'user' && currentMerchantId === 'popmart';

  // 商户模式下直接跳转自家店铺
  useEffect(() => {
    if (identityMode === 'merchant' && currentMerchantId) {
      router.push(`/merchant/${currentMerchantId}`);
    }
  }, [identityMode, currentMerchantId, router]);

  const handleMerchantClick = (merchant: Merchant) => {
    // 跳转到店铺详情页
    router.push(`/merchant/${merchant.id}`);
  };

  // POPMART 用户模式下只显示 POPMART
  const displayedMerchants = isPopmartUserMode
    ? mockMerchants.filter(m => m.id === 'popmart')
    : mockMerchants;

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
              <h1 className="text-4xl font-bold text-gray-333">
                {brandInfo.name === 'POPMART' ? 'POPMART' : 'WinPoint网购'}
              </h1>
            </div>
          </div>
          <p className="text-gray-1 ml-1">
            一次过网购所有顶级品牌
          </p>
        </motion.div>

        {/* Merchants Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {displayedMerchants.map((merchant, index) => (
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
