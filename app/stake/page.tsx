'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Info } from 'lucide-react';
import { useStore } from '@/lib/store';
import StakeForm from '@/components/StakeForm';
import Card from '@/components/Card';
import AtmosphericBackground from '@/components/AtmosphericBackground';

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

    // Redirect to dashboard after 2.5 seconds
    setTimeout(() => {
      router.push('/dashboard');
    }, 2500);
  };

  return (
    <AtmosphericBackground className="min-h-screen bg-md-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-md-tertiary to-md-tertiary-container flex items-center justify-center shadow-lg">
              <span className="text-2xl">💎</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-md-on-background">
                质押 Credit
              </h1>
            </div>
          </div>
          <p className="text-md-on-surface-variant ml-1">
            将 Credit 质押以获得 Share，参与收益分配
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stake Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="lg:col-span-2"
          >
            <StakeForm
              availableCredit={user.credit}
              onStake={handleStake}
            />
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="lg:col-span-1"
          >
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-md-primary/20 flex items-center justify-center">
                  <Info className="h-5 w-5 text-md-primary" />
                </div>
                <h3 className="text-lg font-bold text-md-on-background">
                  质押说明
                </h3>
              </div>

              <div className="space-y-5">
                {[
                  {
                    step: 1,
                    title: 'Credit 被锁定',
                    description: '质押后 Credit 将被锁定，无法用于其他用途'
                  },
                  {
                    step: 2,
                    title: '获得 Share',
                    description: '立即获得对应数量的 Share (1:1 比例)'
                  },
                  {
                    step: 3,
                    title: '收益分配',
                    description: '每月参与商家收益分配，预计年化 ~15%'
                  },
                  {
                    step: 4,
                    title: '自由交易',
                    description: 'Share 可在市场自由交易，随时变现'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-md-primary to-md-secondary-container flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-md-on-background mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-md-on-surface-variant leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', duration: 0.5, ease: [0.2, 0, 0, 1] }}
                className="bg-md-surface-container rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl border border-white/10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.2, type: 'tween', duration: 0.4 }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-md-success to-md-success/60 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="h-12 w-12 text-white" />
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold text-md-on-background mb-4">
                  质押成功!
                </h2>

                <div className="bg-md-surface-container-high rounded-2xl p-6 mb-6">
                  <p className="text-md-on-surface-variant mb-2">
                    已质押
                  </p>
                  <p className="text-3xl font-bold text-md-primary mb-1">
                    {stakedAmount.toFixed(2)} Credit
                  </p>
                  <p className="text-md-on-surface-variant">
                    获得 {stakedAmount.toFixed(2)} Share
                  </p>
                </div>

                <motion.div
                  className="flex items-center justify-center gap-2 text-sm text-md-on-surface-variant"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-md-primary"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  正在跳转到资产页面...
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AtmosphericBackground>
  );
}
