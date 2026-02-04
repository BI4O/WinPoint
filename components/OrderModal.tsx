'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
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
  const creditToEarn = numAmount / merchant.creditRate;

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-md-surface-container rounded-3xl p-6 w-full max-w-md shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{merchant.logo}</span>
                  <div>
                    <h2 className="text-xl font-bold text-md-on-surface">
                      在 {merchant.name} 消费
                    </h2>
                    <p className="text-sm text-md-on-surface-variant">
                      {merchant.category}
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-md-on-surface mb-2">
                    消费金额
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-2xl bg-md-surface text-md-on-surface border border-md-border focus:outline-none focus:ring-2 focus:ring-md-primary"
                      disabled={isSubmitting}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-md-on-surface-variant">
                      USDT
                    </span>
                  </div>
                </div>

                {/* Credit Preview */}
                {numAmount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-md-primary-container"
                  >
                    <p className="text-sm text-md-on-primary-container mb-1">
                      将获得
                    </p>
                    <p className="text-2xl font-bold text-md-on-primary-container">
                      {creditToEarn.toFixed(2)} Credit
                    </p>
                  </motion.div>
                )}
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
                  {isSubmitting ? '处理中...' : '确认消费'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
