'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SuccessNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  unit: string;
  message?: string;
  emoji?: string;
  showLoading?: boolean;
  countdown?: number;
}

export default function SuccessNotification({
  isOpen,
  onClose,
  title,
  amount,
  unit,
  message,
  emoji = '🎉',
  showLoading = false,
  countdown = 0
}: SuccessNotificationProps) {
  const [countdownValue, setCountdownValue] = useState(countdown);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      setCountdownValue(countdown);
      const timer = setInterval(() => {
        setCountdownValue(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, countdown]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              type: 'spring',
              duration: 0.6,
              bounce: 0.3,
              ease: [0.2, 0, 0, 1]
            }}
            className="bg-gradient-to-br from-md-surface-container to-md-background rounded-[32px] shadow-2xl border border-white/10 max-w-sm w-full overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部装饰条 */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.2, 0, 0, 1] }}
              className="h-1 bg-gradient-to-r from-md-primary via-md-tertiary to-md-primary"
            />

            {/* 背景装饰 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                initial={{ scale: 0, opacity: 0.3 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-md-primary/20 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10 p-8">
              {/* 图标 */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.1,
                  type: 'spring',
                  duration: 0.6,
                  bounce: 0.5
                }}
                className="relative mb-6"
              >
                <div className="relative inline-flex">
                  {/* 光晕效果 */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="absolute inset-0 bg-md-primary/30 rounded-full blur-xl"
                  />
                  <div className="relative text-6xl filter drop-shadow-lg">
                    {emoji}
                  </div>
                </div>
              </motion.div>

              {/* 标题 */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.2, 0, 0, 1] }}
                className="text-2xl font-bold text-md-on-background mb-6 text-center relative"
              >
                {title}
                {/* 装饰星星 */}
                <motion.span
                  initial={{ opacity: 0, scale: 0, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="absolute -top-2 -right-6"
                >
                  <Sparkles className="w-5 h-5 text-md-primary" />
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, scale: 0, rotate: 45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="absolute -top-1 -left-6"
                >
                  <Sparkles className="w-4 h-4 text-md-secondary" />
                </motion.span>
              </motion.h2>

              {/* 金额显示 */}
              {amount !== 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4, ease: [0.2, 0, 0, 1] }}
                  className="mb-6 relative"
                >
                  {/* 卡片背景 */}
                  <div className="bg-gradient-to-br from-md-primary/10 to-md-secondary-container/30 rounded-2xl p-6 border border-md-primary/20 shadow-inner">
                    <div className="flex items-center gap-4">
                      {/* 图标 */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring', bounce: 0.5 }}
                        className="flex-shrink-0"
                      >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-md-primary to-md-secondary-container flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-7 h-7 text-white" />
                        </div>
                      </motion.div>

                      {/* 数值 */}
                      <div className="flex-1 min-w-0">
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, type: 'spring', bounce: 0.3 }}
                          className="text-4xl font-bold text-md-primary tabular-nums tracking-tight"
                        >
                          {amount >= 0 ? '+' : ''}{amount.toFixed(2)}
                        </motion.p>
                        <p className="text-xs font-medium text-md-on-surface-variant mt-0.5">
                          {unit}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 消息 */}
              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4, ease: [0.2, 0, 0, 1] }}
                  className="relative"
                >
                  <div className="bg-md-surface-container-low/50 rounded-2xl p-4 border border-md-outline-variant/30">
                    <p className="text-sm text-md-on-surface-variant text-center whitespace-pre-line leading-relaxed">
                      {message.split('\n').map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < message.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>

                  {/* Loading 指示器 */}
                  {showLoading && (
                    <div className="flex justify-center mt-3">
                      <motion.div
                        className="flex gap-1"
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-md-primary"
                            animate={{
                              opacity: [0.3, 1, 0.3],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.15,
                              ease: 'easeInOut'
                            }}
                          />
                        ))}
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* 底部提示 */}
              {message && countdown > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.3, ease: [0.2, 0, 0, 1] }}
                  className="mt-4 text-center"
                >
                  <p className="text-xs text-md-on-surface-variant/70">
                    {countdownValue > 0 ? `将在 ${countdownValue} 秒后自动跳转...` : '即将跳转...'}
                  </p>
                </motion.div>
              )}
            </div>

            {/* 底部渐变遮罩 */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-md-surface-container to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
