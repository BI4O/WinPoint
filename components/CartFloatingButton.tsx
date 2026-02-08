'use client';

import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface CartFloatingButtonProps {
  itemCount: number;
  totalAmount: number;
  onClick: () => void;
}

export default function CartFloatingButton({
  itemCount,
  totalAmount,
  onClick
}: CartFloatingButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', duration: 0.3, stiffness: 200 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 h-14 rounded-full bg-md-tertiary text-md-on-primary shadow-lg hover:shadow-xl transition-shadow flex items-center gap-3 px-5 pr-6"
    >
      {/* 购物车图标 + 徽章 */}
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />

        {/* 数量徽章 */}
        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={itemCount}
            transition={{ type: 'spring', duration: 0.3, stiffness: 300 }}
            className="absolute -top-2 -right-2 min-w-5 h-5 rounded-full bg-md-error text-white text-xs font-bold flex items-center justify-center px-1"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.div>
        )}
      </div>

      {/* 分隔线 */}
      <div className="w-px h-6 bg-white/30" />

      {/* 金额显示 */}
      <div className="flex flex-col items-start">
        <span className="text-xs opacity-90">预计支付</span>
        <span className="text-base font-bold">
          ¥{totalAmount.toFixed(2)}
        </span>
      </div>
    </motion.button>
  );
}
