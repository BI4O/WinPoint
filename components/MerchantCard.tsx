'use client';

import Card from './Card';
import Button from './Button';
import { Merchant } from '@/lib/mock-data';

interface MerchantCardProps {
  merchant: Merchant;
  onConsume: () => void;
}

export default function MerchantCard({ merchant, onConsume }: MerchantCardProps) {
  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Logo */}
        <div className="text-6xl">{merchant.logo}</div>

        {/* Name */}
        <h3 className="text-xl font-bold text-md-on-surface">
          {merchant.name}
        </h3>

        {/* Category */}
        <span className="inline-block px-3 py-1 rounded-full bg-md-secondary-container text-md-on-secondary-container text-sm">
          {merchant.category}
        </span>

        {/* Description */}
        <p className="text-md-on-surface-variant text-sm">
          {merchant.description}
        </p>

        {/* Credit Rate Info */}
        <p className="text-xs text-md-on-surface-variant">
          每消费 {merchant.creditRate} 元 = 1 Credit
        </p>
      </div>

      {/* Consume Button */}
      <div className="mt-auto pt-4">
        <Button
          onClick={onConsume}
          className="w-full"
          variant="filled"
        >
          消费
        </Button>
      </div>
    </Card>
  );
}
