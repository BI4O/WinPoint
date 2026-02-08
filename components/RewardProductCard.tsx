'use client';

import { motion } from 'framer-motion';
import Card from './Card';
import Button from './Button';
import { RewardProduct } from '@/lib/mock-data';

interface RewardProductCardProps {
  product: RewardProduct;
  userPoint: number;
  onRedeem: (product: RewardProduct) => void;
}

export default function RewardProductCard({
  product,
  userPoint,
  onRedeem
}: RewardProductCardProps) {
  const canAfford = userPoint >= product.pointCost;
  const isEmoji = product.image.startsWith('emoji:');
  const imageContent = isEmoji ? product.image.replace('emoji:', '') : product.image;

  return (
    <Card hover glow="tertiary" className="flex flex-col h-full">
      <div className="flex flex-col space-y-4">
        {/* Product Image */}
        <motion.div
          className="w-full aspect-square rounded-2xl bg-md-surface-container-low flex items-center justify-center overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
        >
          {isEmoji ? (
            <span className="text-6xl">{imageContent}</span>
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
          <div className="flex items-baseline gap-2">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-md-primary">
                {product.pointCost}
              </span>
              <span className="text-sm text-md-on-surface-variant">Point</span>
            </div>
            <span className="text-sm text-md-on-surface-variant line-through">
              ¥{product.originalPrice}
            </span>
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
            {canAfford ? '立即兑换' : 'Point 不足'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
