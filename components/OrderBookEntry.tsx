'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type OrderBookEntry as OrderBookEntryType } from '@/lib/mock-data';

interface OrderBookEntryProps {
  order: OrderBookEntryType;
  type: 'buy' | 'sell';
  onClick: (price: number) => void;
}

export default function OrderBookEntry({ order, type, onClick }: OrderBookEntryProps) {
  const [animatedDepth, setAnimatedDepth] = useState(order.depthPercentage);

  // 实时波动动画：每1.5-3秒随机波动 ±20%
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 40; // -20% 到 +20%
      const newDepth = Math.max(5, Math.min(100, order.depthPercentage + variation));
      setAnimatedDepth(newDepth);
    }, 1500 + Math.random() * 1500); // 1.5-3秒随机间隔

    return () => clearInterval(interval);
  }, [order.depthPercentage]);

  const depthColor = type === 'sell'
    ? 'rgba(239, 68, 68, 0.15)'
    : 'rgba(16, 185, 129, 0.15)';

  const priceColor = type === 'sell' ? 'text-error' : 'text-success';

  return (
    <div
      className="relative px-3 py-2 hover:bg-white/5 cursor-pointer transition-colors duration-200"
      onClick={() => onClick(order.price)}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to left, ${depthColor} 0%, ${depthColor} ${animatedDepth}%, transparent ${animatedDepth}%)`
        }}
        initial={false}
        animate={{
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 2 + Math.random(),
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <div className="relative z-10 grid grid-cols-3 gap-2 text-sm font-mono">
        <span className={`${priceColor} font-semibold`}>
          {order.price.toFixed(4)}
        </span>
        <span className="text-md-on-surface text-right">
          {order.quantity.toFixed(2)}
        </span>
        <span className="text-md-on-surface-variant text-right">
          {order.totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
