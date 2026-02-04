'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Share2, TrendingUp } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface StakeFormProps {
  availableCredit: number;
  onStake: (amount: number) => void;
}

export default function StakeForm({ availableCredit, onStake }: StakeFormProps) {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');

  const shareToReceive = amount;
  const estimatedAPY = 15;
  const estimatedYearlyReturn = (amount * estimatedAPY) / 100;

  useEffect(() => {
    if (amount > availableCredit) {
      setError('质押数量不能超过可用余额');
    } else if (amount < 0) {
      setError('质押数量必须大于0');
    } else {
      setError('');
    }
  }, [amount, availableCredit]);

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
    setAmount(availableCredit);
  };

  const handleStake = () => {
    if (amount <= 0) {
      setError('请输入质押数量');
      return;
    }
    if (amount > availableCredit) {
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
      >
        <h2 className="text-2xl font-bold text-md-on-surface mb-6">
          质押 Credit 获得 Share
        </h2>

        {/* Available Credit */}
        <div className="mb-6 p-4 bg-md-surface-variant/30 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-md-primary" />
              <span className="text-md-on-surface-variant">可用 Credit</span>
            </div>
            <span className="text-2xl font-bold text-md-on-surface">
              {availableCredit.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-md-on-surface font-medium">
              质押数量
            </label>
            <button
              onClick={handleMaxClick}
              className="text-sm text-md-primary hover:underline"
            >
              最大
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="number"
              value={amount || ''}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-md-surface-variant rounded-2xl text-md-on-surface text-lg font-medium focus:outline-none focus:ring-2 focus:ring-md-primary"
            />
          </div>

          {/* Slider */}
          <input
            type="range"
            min="0"
            max={availableCredit}
            step="0.01"
            value={amount}
            onChange={handleSliderChange}
            className="w-full h-2 bg-md-surface-variant rounded-lg appearance-none cursor-pointer accent-md-primary"
          />
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Preview */}
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-md-primary-container/30 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-md-primary" />
                <span className="text-md-on-surface-variant">将获得 Share</span>
              </div>
              <span className="text-2xl font-bold text-md-primary">
                {shareToReceive.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-md-on-surface-variant">
              1 Credit = 1 Share
            </p>
          </div>

          <div className="p-4 bg-md-tertiary-container/30 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-md-tertiary" />
                <span className="text-md-on-surface-variant">预计年化收益</span>
              </div>
              <span className="text-xl font-bold text-md-tertiary">
                ~{estimatedAPY}%
              </span>
            </div>
            <p className="text-xs text-md-on-surface-variant">
              预计年收益: ${estimatedYearlyReturn.toFixed(2)}
            </p>
          </div>
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
            确认质押
          </Button>
        </div>
      </motion.div>
    </Card>
  );
}

