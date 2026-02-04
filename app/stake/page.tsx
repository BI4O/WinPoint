'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Info } from 'lucide-react';
import { useStore } from '@/lib/store';
import StakeForm from '@/components/StakeForm';
import Card from '@/components/Card';

export default function StakePage() {
  const user = useStore((state) => state.user);
  const stakeCredit = useStore((state) => state.stakeCredit);
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [stakedAmount, setStakedAmount] = useState(0);

  const handleStake = (amount: number) => {
    stakeCredit(amount);
    setStakedAmount(amount);
    setShowSuccess(true);

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-md-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-md-on-background mb-2">
            质押 Credit
          </h1>
          <p className="text-md-on-surface-variant">
            将 Credit 质押以获得 Share，参与收益分配
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stake Form */}
          <div className="lg:col-span-2">
            <StakeForm
              availableCredit={user.credit}
              onStake={handleStake}
            />
          </div>

          {/* Info Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-md-primary" />
                  <h3 className="text-lg font-bold text-md-on-surface">
                    质押说明
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-md-primary-container flex items-center justify-center text-md-primary text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-md-on-surface mb-1">
                        Credit 被锁定
                      </h4>
                      <p className="text-sm text-md-on-surface-variant">
                        质押后 Credit 将被锁定，无法用于其他用途
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-md-primary-container flex items-center justify-center text-md-primary text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-md-on-surface mb-1">
                        获得 Share
                      </h4>
                      <p className="text-sm text-md-on-surface-variant">
                        立即获得对应数量的 Share (1:1 比例)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-md-primary-container flex items-center justify-center text-md-primary text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-md-on-surface mb-1">
                        收益分配
                      </h4>
                      <p className="text-sm text-md-on-surface-variant">
                        每月参与商家收益分配，预计年化 ~15%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-md-primary-container flex items-center justify-center text-md-primary text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-md-on-surface mb-1">
                        自由交易
                      </h4>
                      <p className="text-sm text-md-on-surface-variant">
                        Share 可在市场自由交易，随时变现
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-md-surface-container rounded-3xl p-8 max-w-md w-full text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
                </motion.div>

                <h2 className="text-2xl font-bold text-md-on-surface mb-2">
                  质押成功!
                </h2>
                <p className="text-md-on-surface-variant mb-4">
                  您已成功质押 {stakedAmount.toFixed(2)} Credit
                </p>
                <p className="text-md-on-surface-variant">
                  获得 {stakedAmount.toFixed(2)} Share
                </p>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                  className="h-1 bg-md-primary rounded-full mt-6"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

