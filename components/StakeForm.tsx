'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Share2, TrendingUp, Sparkles } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import InputField from './InputField';

interface StakeFormProps {
  availablePoint: number;
  onStake: (amount: number) => void;
}

export default function StakeForm({ availablePoint, onStake }: StakeFormProps) {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');

  const rwaToReceive = amount;
  const estimatedAPY = 15;
  const estimatedYearlyReturn = (amount * estimatedAPY) / 100;

  useEffect(() => {
    if (amount > availablePoint) {
      setError('质押数量不能超过可用余额');
    } else if (amount < 0) {
      setError('质押数量必须大于0');
    } else {
      setError('');
    }
  }, [amount, availablePoint]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    setAmount(availablePoint);
  };

  const handleStake = () => {
    if (amount <= 0) {
      setError('请输入质押数量');
      return;
    }
    if (amount > availablePoint) {
      setError('质押数量不能超过可用余额');
      return;
    }
    if (error) return;
    onStake(amount);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-md-primary to-md-primary/80 flex items-center justify-center shadow-lg">
            <Coins className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-md-on-surface">
            质押积分获得 RWA
          </h2>
        </div>

        {/* Available 积分 */}
        <motion.div
          className="mb-8 p-5 bg-gradient-to-r from-md-primary-container/30 to-md-secondary-container/30 rounded-2xl border border-md-primary/10"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-md-primary/20 flex items-center justify-center">
                <Coins className="h-6 w-6 text-md-primary" />
              </div>
              <div>
                <p className="text-sm text-md-on-surface-variant">可用 积分</p>
                <p className="text-2xl font-bold text-md-on-surface mt-0.5">
                  {availablePoint.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Amount Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-md-on-surface font-medium">
              质押数量
            </label>
            <motion.button
              onClick={handleMaxClick}
              className="text-sm text-md-primary font-medium px-3 py-1 rounded-full bg-md-primary/10 hover:bg-md-primary/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              最大
            </motion.button>
          </div>

          <div className="relative mb-5">
            <InputField
              value={amount || ''}
              onChange={handleInputChange}
              placeholder="0.00"
              type="number"
              className="text-lg font-medium"
            />
          </div>

          {/* Enhanced Slider */}
          <div className="relative">
            <input
              type="range"
              min="0"
              max={availablePoint}
              step="0.01"
              value={amount}
              onChange={handleSliderChange}
              className="w-full h-2 bg-md-surface-container-low rounded-full appearance-none cursor-pointer accent-md-primary"
              style={{
                background: `linear-gradient(to right, var(--color-md-primary) ${(amount / availablePoint) * 100}%, var(--color-md-surface-container-low) ${(amount / availablePoint) * 100}%)`
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-md-on-surface-variant">
              <span>0</span>
              <span>{availablePoint.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-5 overflow-hidden"
            >
              <div className="p-4 bg-md-error/10 border border-md-error/30 rounded-2xl text-md-error text-sm flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* RWA to Receive */}
          <motion.div
            className="p-5 rounded-2xl bg-gradient-to-br from-md-primary-container/40 to-md-primary-container/20 border border-md-primary/10"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Share2 className="h-5 w-5 text-md-primary" />
              <span className="text-sm text-md-on-primary-container">将获得 RWA</span>
            </div>
            <p className="text-3xl font-bold text-md-primary mb-1">
              {rwaToReceive.toFixed(2)}
            </p>
            <p className="text-xs text-md-on-primary-container/70">
              1 积分 = 1 RWA
            </p>
          </motion.div>

          {/* Estimated Return */}
          <motion.div
            className="p-5 rounded-2xl bg-gradient-to-br from-md-tertiary-container/40 to-md-tertiary-container/20 border border-md-tertiary/10"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-md-tertiary" />
              <span className="text-sm text-md-on-tertiary-container">预计年化收益</span>
            </div>
            <p className="text-3xl font-bold text-md-tertiary mb-1">
              ~{estimatedAPY}%
            </p>
            <p className="text-xs text-md-on-tertiary-container/70">
              ~${estimatedYearlyReturn.toFixed(2)}/年
            </p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outlined"
            size="lg"
            onClick={() => setAmount(0)}
            className="flex-1"
          >
            重置
          </Button>
          <Button
            variant="filled"
            size="lg"
            onClick={handleStake}
            disabled={!!error || amount <= 0}
            className="flex-1"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              确认质押
            </span>
          </Button>
        </div>
      </motion.div>
    </Card>
  );
}
