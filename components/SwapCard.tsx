'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Info } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import SuccessNotification from './SuccessNotification';
import { useStore } from '@/lib/store';
import { mockMarketData } from '@/lib/mock-data';

type SwapDirection = 'shareToUsdt' | 'usdtToShare';

export default function SwapCard() {
  const { user } = useStore();
  const [direction, setDirection] = useState<SwapDirection>('shareToUsdt');
  const [inputAmount, setInputAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({
    title: '',
    amount: 0,
    unit: '',
    emoji: '🎉'
  });

  const currentPrice = mockMarketData.currentPrice;

  // 计算输出金额
  const outputAmount = useMemo(() => {
    const input = parseFloat(inputAmount) || 0;
    if (direction === 'shareToUsdt') {
      return (input * currentPrice).toFixed(2);
    } else {
      return (input / currentPrice).toFixed(2);
    }
  }, [inputAmount, direction, currentPrice]);

  // 切换方向
  const toggleDirection = () => {
    setDirection(prev => prev === 'shareToUsdt' ? 'usdtToShare' : 'shareToUsdt');
    setInputAmount('');
  };

  // 执行交换
  const handleSwap = () => {
    const input = parseFloat(inputAmount) || 0;
    if (input <= 0) return;

    if (direction === 'shareToUsdt') {
      if (input > user.share) {
        alert('Share 余额不足');
        return;
      }
      // TODO: 实现 Share -> USDT 交换逻辑
      setSuccessData({
        title: '卖出成功！',
        amount: parseFloat(outputAmount),
        unit: 'USDT',
        emoji: '💰'
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } else {
      // TODO: 实现 USDT -> Share 交换逻辑
      setSuccessData({
        title: '购买成功！',
        amount: parseFloat(outputAmount),
        unit: 'Share',
        emoji: '🎉'
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    }

    setInputAmount('');
  };

  const isShareToUsdt = direction === 'shareToUsdt';
  const inputToken = isShareToUsdt ? 'Share' : 'USDT';
  const outputToken = isShareToUsdt ? 'USDT' : 'Share';
  const inputBalance = isShareToUsdt ? user.share : 0; // USDT 余额暂时为 0

  return (
    <>
      <Card className="h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-md-on-background mb-2">
          交易
        </h3>
        <p className="text-xs text-md-on-surface-variant">
          当前价格: <span className="text-md-primary font-semibold">${currentPrice.toFixed(2)}</span> / Share
        </p>
      </div>

      <div className="space-y-4">
        {/* 输入框 */}
        <div className="relative">
          <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
            支付
          </label>
          <div className="relative">
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-4 pr-24 rounded-xl bg-md-surface-container-low border border-md-outline/20 focus:border-md-primary focus:outline-none text-lg font-medium text-md-on-background transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-sm font-semibold text-md-on-background px-3 py-1 rounded-lg bg-md-surface-container">
                {inputToken}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-md-on-surface-variant">
            <span>余额: {inputBalance.toFixed(2)} {inputToken}</span>
            <button
              onClick={() => setInputAmount(inputBalance.toString())}
              className="text-md-primary hover:text-md-primary/80 font-medium transition-colors"
            >
              最大
            </button>
          </div>
        </div>

        {/* 切换按钮 */}
        <div className="flex justify-center">
          <motion.button
            onClick={toggleDirection}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-md-surface-container hover:bg-md-surface-container-high border-2 border-md-background transition-colors"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowDownUp className="w-5 h-5 text-md-primary" />
          </motion.button>
        </div>

        {/* 输出框 */}
        <div className="relative">
          <label className="block text-sm font-medium text-md-on-surface-variant mb-2">
            接收
          </label>
          <div className="relative">
            <input
              type="text"
              value={outputAmount}
              readOnly
              placeholder="0.00"
              className="w-full px-4 py-4 pr-24 rounded-xl bg-md-surface-container-low border border-md-outline/20 text-lg font-medium text-md-on-surface-variant cursor-not-allowed"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-sm font-semibold text-md-on-background px-3 py-1 rounded-lg bg-md-surface-container">
                {outputToken}
              </span>
            </div>
          </div>
        </div>

        {/* 交易信息 */}
        <div className="p-4 rounded-xl bg-md-surface-container-low space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-md-on-surface-variant">价格</span>
            <span className="text-md-on-background font-medium">
              1 Share = ${currentPrice.toFixed(2)} USDT
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-md-on-surface-variant flex items-center gap-1">
              手续费
              <Info className="w-3 h-3" />
            </span>
            <span className="text-md-on-background font-medium">0%</span>
          </div>
        </div>

        {/* 交换按钮 */}
        <Button
          variant="filled"
          size="lg"
          onClick={handleSwap}
          disabled={!inputAmount || parseFloat(inputAmount) <= 0}
          className="w-full"
        >
          {isShareToUsdt ? '卖出 Share' : '购买 Share'}
        </Button>

        {/* 提示信息 */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-md-primary/10 text-xs text-md-on-surface-variant">
          <Info className="w-4 h-4 text-md-primary shrink-0 mt-0.5" />
          <p>
            交易将按当前市场价格执行。实际成交价格可能会有轻微波动。
          </p>
        </div>
      </div>
    </Card>
    <SuccessNotification
      isOpen={showSuccess}
      onClose={() => setShowSuccess(false)}
      title={successData.title}
      amount={successData.amount}
      unit={successData.unit}
      emoji={successData.emoji}
    />
    </>
  );
}
