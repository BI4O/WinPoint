'use client';

import { motion } from 'framer-motion';
import Card from './Card';
import Button from './Button';
import { Merchant } from '@/lib/mock-data';

interface MerchantCardProps {
  merchant: Merchant;
  onConsume: () => void;
}

export default function MerchantCard({ merchant, onConsume }: MerchantCardProps) {
  return (
    <Card hover glow="primary" className="flex flex-col h-full">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Logo with subtle animation */}
        <motion.div
          className="text-6xl"
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          {merchant.logo}
        </motion.div>

        {/* Name */}
        <h3 className="text-xl font-bold text-md-on-surface">
          {merchant.name}
        </h3>

        {/* Category */}
        <motion.span
          className="inline-block px-4 py-1.5 rounded-full bg-md-secondary-container/80 text-md-on-secondary-container text-sm font-medium"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
        >
          {merchant.category}
        </motion.span>

        {/* Description */}
        <p className="text-md-on-surface-variant text-sm leading-relaxed">
          {merchant.description}
        </p>

        {/* Credit Rate Info */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-md-primary/5">
          <div className="w-2 h-2 rounded-full bg-md-primary animate-pulse" />
          <p className="text-xs text-md-on-surface-variant font-medium">
            每消费 {merchant.creditRate} 元 = 1 Credit
          </p>
        </div>
      </div>

      {/* Consume Button */}
      <div className="mt-auto pt-6">
        <Button
          onClick={onConsume}
          className="w-full"
          variant="filled"
          size="lg"
        >
          消费
        </Button>
      </div>
    </Card>
  );
}
