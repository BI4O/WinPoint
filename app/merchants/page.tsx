'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { mockMerchants, type Merchant } from '@/lib/mock-data';
import { useStore } from '@/lib/store';
import MerchantCard from '@/components/MerchantCard';
import OrderModal from '@/components/OrderModal';

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
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-md-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-md-on-background mb-2">
            商家列表
          </h1>
          <p className="text-md-on-surface-variant">
            选择商家进行消费，获得 Credit 奖励
          </p>
        </motion.div>

        {/* Merchants Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mockMerchants.map((merchant, index) => (
            <motion.div
              key={merchant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
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
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="bg-md-surface-container rounded-3xl p-8 text-center shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold text-md-on-surface mb-2">
              消费成功！
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-md-primary"
            >
              +{earnedCredit.toFixed(2)} Credit
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-md-on-surface-variant mt-4"
            >
              正在跳转到资产页面...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
