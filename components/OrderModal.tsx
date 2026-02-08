'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import InputField from './InputField';
import { Merchant } from '@/lib/mock-data';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: Merchant | null;
  onConfirm: (amount: number) => void;
}

export default function OrderModal({ isOpen, onClose, merchant, onConfirm }: OrderModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!merchant) return null;

  const numAmount = parseFloat(amount) || 0;
  const pointToEarn = numAmount / merchant.pointRate;

  const handleConfirm = async () => {
    if (numAmount <= 0) return;

    setIsSubmitting(true);
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    onConfirm(numAmount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-md-surface-container rounded-[32px] p-6 shadow-2xl border border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="text-5xl"
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {merchant.logo}
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-bold text-md-on-surface">
                        在 {merchant.name} 消费
                      </h2>
                      <span className="inline-block px-3 py-1 rounded-full bg-md-secondary-container/60 text-md-on-secondary-container text-sm mt-1">
                        {merchant.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-6 mb-8">
                  <InputField
                    label="消费金额"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    type="number"
                    suffix="USDT"
                    disabled={isSubmitting}
                  />

                  {/* 积分 Preview */}
                  <AnimatePresence>
                    {numAmount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-md-primary-container/40 to-md-primary-container/20 border border-md-primary/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-md-on-primary-container mb-1">
                                将获得
                              </p>
                              <p className="text-3xl font-bold text-md-primary">
                                {pointToEarn.toFixed(2)}
                              </p>
                              <p className="text-xs text-md-on-primary-container/80 mt-1">
                                积分
                              </p>
                            </div>
                            <motion.div
                              className="w-16 h-16 rounded-2xl bg-md-primary/20 flex items-center justify-center"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <span className="text-2xl">💎</span>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    取消
                  </Button>
                  <Button
                    variant="filled"
                    onClick={handleConfirm}
                    disabled={numAmount <= 0 || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        处理中...
                      </span>
                    ) : (
                      '确认消费'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
