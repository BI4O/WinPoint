'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Button from './Button';
import PercentageSlider from './PercentageSlider';
import SuccessNotification from './SuccessNotification';
import { useStore } from '@/lib/store';

interface TradingFormProps {
  initialPrice?: number;
  defaultBuyPrice?: number;
  defaultSellPrice?: number;
}

export default function TradingForm({
  initialPrice,
  defaultBuyPrice,
  defaultSellPrice
}: TradingFormProps) {
  const { earnings, rwa } = useStore(state => state.user);
  const placeBuyOrder = useStore(state => state.placeBuyOrder);
  const placeSellOrder = useStore(state => state.placeSellOrder);

  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // 当交易类型变化时，更新默认价格
  useEffect(() => {
    if (tradeType === 'buy' && defaultBuyPrice !== undefined) {
      setPrice(defaultBuyPrice.toString());
    } else if (tradeType === 'sell' && defaultSellPrice !== undefined) {
      setPrice(defaultSellPrice.toString());
    }
  }, [tradeType, defaultBuyPrice, defaultSellPrice]);

  // 当外部点击价格时更新
  useEffect(() => {
    if (initialPrice !== undefined) {
      setPrice(initialPrice.toString());
    }
  }, [initialPrice]);

  // 初始化默认价格（买入）
  useEffect(() => {
    if (defaultBuyPrice !== undefined && !price) {
      setPrice(defaultBuyPrice.toString());
    }
  }, [defaultBuyPrice]);

  // 计算可用余额
  const availableBalance = tradeType === 'buy' ? earnings : rwa;

  // 计算总订单金额
  const totalAmount = price && quantity
    ? (parseFloat(price) * parseFloat(quantity)).toFixed(4)
    : '0.0000';

  // 百分比变化处理
  const handlePercentageChange = (newPercentage: number) => {
    setPercentage(newPercentage);

    if (!price || parseFloat(price) <= 0) return;

    if (tradeType === 'buy') {
      // 买入：根据 USDT 余额计算 RWA 数量
      const calculatedQuantity = (availableBalance * newPercentage / 100) / parseFloat(price);
      setQuantity(calculatedQuantity.toFixed(4));
    } else {
      // 卖出：根据 RWA 余额计算数量
      const calculatedQuantity = availableBalance * newPercentage / 100;
      setQuantity(calculatedQuantity.toFixed(4));
    }
  };

  // 数量变化处理
  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    // 根据数量反向计算百分比
    if (value && parseFloat(value) > 0) {
      if (tradeType === 'buy' && price && parseFloat(price) > 0) {
        const requiredAmount = parseFloat(value) * parseFloat(price);
        const calculatedPercentage = Math.min(100, (requiredAmount / availableBalance) * 100);
        setPercentage(Math.round(calculatedPercentage));
      } else if (tradeType === 'sell') {
        const calculatedPercentage = Math.min(100, (parseFloat(value) / availableBalance) * 100);
        setPercentage(Math.round(calculatedPercentage));
      }
    } else {
      setPercentage(0);
    }
  };

  // 提交订单
  const handleSubmit = async () => {
    const priceNum = parseFloat(price);
    const quantityNum = parseFloat(quantity);

    if (!priceNum || !quantityNum || priceNum <= 0 || quantityNum <= 0) {
      setNotificationMessage('请输入有效的价格和数量');
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    setIsSubmitting(true);

    try {
      const success = tradeType === 'buy'
        ? placeBuyOrder(priceNum, quantityNum)
        : placeSellOrder(priceNum, quantityNum);

      if (success) {
        setNotificationMessage(`${tradeType === 'buy' ? '买入' : '卖出'}订单已提交`);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        // 重置表单
        setQuantity('');
        setPercentage(0);
      } else {
        setNotificationMessage('余额不足，订单提交失败');
        setShowError(true);
        setTimeout(() => setShowError(false), 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 检查按钮是否应该禁用
  const isButtonDisabled = isSubmitting || !price || !quantity || parseFloat(price) <= 0 || parseFloat(quantity) <= 0;

  return (
    <>
      <Card className="p-6 h-full flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col h-full"
        >
          {/* 买入/卖出切换 */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={tradeType === 'buy' ? 'filled' : 'outlined'}
              onClick={() => {
                setTradeType('buy');
                setQuantity('');
                setPercentage(0);
                // 切换到买入时，使用最高买价
                if (defaultBuyPrice !== undefined) {
                  setPrice(defaultBuyPrice.toString());
                }
              }}
              className={`flex-1 ${tradeType === 'buy' ? 'bg-success hover:bg-success/90' : ''}`}
            >
              买入
            </Button>
            <Button
              variant={tradeType === 'sell' ? 'filled' : 'outlined'}
              onClick={() => {
                setTradeType('sell');
                setQuantity('');
                setPercentage(0);
                // 切换到卖出时，使用最低卖价
                if (defaultSellPrice !== undefined) {
                  setPrice(defaultSellPrice.toString());
                }
              }}
              className={`flex-1 ${tradeType === 'sell' ? 'bg-error hover:bg-error/90' : ''}`}
            >
              卖出
            </Button>
          </div>

          {/* 价格输入 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
              价格 (USDT)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.0000"
              step="0.0001"
              className="w-full px-4 py-3 bg-md-surface-container-low rounded-2xl border border-md-outline-variant focus:border-md-primary focus:outline-none text-md-on-surface font-mono"
            />
          </div>

          {/* 数量输入 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
              数量 (RWA)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              placeholder="0.0000"
              step="0.0001"
              className="w-full px-4 py-3 bg-md-surface-container-low rounded-2xl border border-md-outline-variant focus:border-md-primary focus:outline-none text-md-on-surface font-mono"
            />
          </div>

          {/* 百分比滑块 */}
          <div className="mb-6">
            <PercentageSlider
              percentage={percentage}
              onChange={handlePercentageChange}
              type={tradeType}
            />
          </div>

          {/* 余额和总额信息 */}
          <div className="space-y-2 mb-6 p-4 bg-md-surface-container-low/50 rounded-2xl">
            <div className="flex justify-between text-sm">
              <span className="text-md-on-surface-variant">可用余额:</span>
              <span className="font-mono font-semibold text-md-on-surface">
                {availableBalance.toFixed(4)} {tradeType === 'buy' ? 'USDT' : 'RWA'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-md-on-surface-variant">订单总额:</span>
              <span className="font-mono font-semibold text-md-on-surface">
                {totalAmount} USDT
              </span>
            </div>
          </div>

          {/* 确认按钮 - 使用 mt-auto 推到底部 */}
          <Button
            variant="filled"
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            className={`w-full mt-auto ${
              tradeType === 'buy'
                ? 'bg-success hover:bg-success/90'
                : 'bg-error hover:bg-error/90'
            }`}
          >
            {isSubmitting ? '提交中...' : `确认${tradeType === 'buy' ? '买入' : '卖出'}`}
          </Button>
        </motion.div>
      </Card>

      {/* 成功通知 */}
      <SuccessNotification
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="订单提交成功"
        amount={parseFloat(quantity || '0')}
        unit="RWA"
        message={notificationMessage}
        emoji={tradeType === 'buy' ? '📈' : '📉'}
      />

      {/* 错误通知 */}
      <SuccessNotification
        isOpen={showError}
        onClose={() => setShowError(false)}
        title="订单提交失败"
        amount={0}
        unit=""
        message={notificationMessage}
        emoji="❌"
      />
    </>
  );
}
