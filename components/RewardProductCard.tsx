'use client';

import { motion } from 'framer-motion';
import Card from './Card';
import Button from './Button';
import { MerchantProduct } from '@/lib/mock-data';

interface RewardProductCardProps {
  product: MerchantProduct;
  userPoint: number;
  onRedeem: (product: MerchantProduct) => void;
}

export default function RewardProductCard({
  product,
  userPoint,
  onRedeem
}: RewardProductCardProps) {
  const canAfford = userPoint >= product.pointPrice;
  const isEmoji = product.image.startsWith('emoji:');
  const imageContent = isEmoji ? product.image.replace('emoji:', '') : product.image;

  return (
    <Card hover className="flex flex-col h-full">
      <div className="flex flex-col space-y-3">
        {/* Product Image */}
        <motion.div
          className="w-24 h-24 rounded-2xl bg-md-surface-container-low flex items-center justify-center overflow-hidden mx-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
        >
          {isEmoji ? (
            <span className="text-5xl">{imageContent}</span>
          ) : (
            <img
              src={imageContent}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>

        {/* Product Info */}
        <div className="flex-1 space-y-2">
          {/* Merchant Name */}
          <p className="text-xs text-md-on-surface-variant font-medium">
            {product.merchantName}
          </p>

          {/* Product Name */}
          <h3 className="text-lg font-bold text-md-on-surface line-clamp-2">
            {product.name}
          </h3>

          {/* Price Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-md-primary">
                {product.pointPrice}
              </span>
              <span className="text-sm text-md-on-surface-variant">积分</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-md-on-surface-variant">+</span>
              <span className="text-base font-medium text-md-on-surface-variant">
                ¥{product.cashPrice}
              </span>
            </div>
          </div>

          {/* Stock Info */}
          <div className="flex items-center gap-2 text-xs text-md-on-surface-variant">
            <div className="w-1.5 h-1.5 rounded-full bg-md-tertiary" />
            <span>库存 {product.stock} 件</span>
          </div>
        </div>

        {/* Redeem Button */}
        <div className="pt-4">
          <Button
            onClick={() => onRedeem(product)}
            className="w-full"
            variant={canAfford ? 'filled' : 'outlined'}
            size="lg"
            disabled={!canAfford}
          >
            {canAfford ? '立即兑换' : '积分不足'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
