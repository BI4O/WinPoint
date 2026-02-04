'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { mockMerchants, type Merchant } from '@/lib/mock-data';
import { useStore } from '@/lib/store';
import MerchantCard from '@/components/MerchantCard';
import OrderModal from '@/components/OrderModal';
import AtmosphericBackground from '@/components/AtmosphericBackground';

export default function MerchantsPage() {
  const router = useRouter();
  const consumeAtMerchant = useStore((state) => state.consumeAtMerchant);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [earnedCredit, setEarnedCredit] = useState(0);

  const handleConsumeClick = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setIsModalOpen(true);
  };

  const handleConfirmConsume = (amount: number) => {
    if (!selectedMerchant) return;

    const creditEarned = amount / selectedMerchant.creditRate;

    // Call store action
    consumeAtMerchant(selectedMerchant.id, selectedMerchant.name, amount);

    // Close modal
    setIsModalOpen(false);

    // Show success animation
    setEarnedCredit(creditEarned);
    setShowSuccess(true);

    // Navigate to dashboard after animation
    setTimeout(() => {
      router.push('/dashboard');
    }, 2500);
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
            在合作商家消费，赚取 Credit 奖励，开启收益之旅
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
                onConsume={() => handleConsumeClick(merchant)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        merchant={selectedMerchant}
        onConfirm={handleConfirmConsume}
      />

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.6, ease: [0.2, 0, 0, 1] }}
              className="bg-md-surface-container rounded-[40px] p-10 text-center shadow-2xl border border-white/10 max-w-sm w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.2, duration: 0.6, type: 'tween', ease: [0.2, 0, 0, 1] }}
                className="text-7xl mb-6"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-md-on-background mb-3">
                消费成功！
              </h2>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
                className="mb-4"
              >
                <p className="text-4xl font-bold text-md-primary mb-2">
                  +{earnedCredit.toFixed(2)}
                </p>
                <p className="text-sm text-md-on-surface-variant">Credit</p>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
                className="text-sm text-md-on-surface-variant flex items-center justify-center gap-2"
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-md-primary"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                正在跳转到资产页面...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AtmosphericBackground>
  );
}
