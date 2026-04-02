'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';
import { RewardProduct } from '@/lib/mock-data';
import { useStore } from '@/lib/store';

interface RedemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: RewardProduct | null;
  userPoint: number;
  onConfirm: (productId: string) => void;
}

export default function RedemptionModal({
  isOpen,
  onClose,
  product,
  userPoint,
  onConfirm
}: RedemptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const redeemProduct = useStore((state) => state.redeemProduct);

  if (!product) return null;

  const remainingPoint = userPoint - product.pointCost;
  const isEmoji = product.image.startsWith('emoji:');
  const imageContent = isEmoji ? product.image.replace('emoji:', '') : product.image;

  const handleConfirm = async () => {
    // Validate address fields
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address) {
      return;
    }

    setIsLoading(true);
    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 1500));
    redeemProduct(
      product.id,
      product.name,
      product.merchantId,
      product.merchantName,
      product.originalPrice,
      product.pointCost,
      shippingAddress
    );
    onConfirm(product.id);
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="bg-md-surface-container rounded-4xl p-8 max-w-md w-full shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-md-on-surface">确认兑换</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-md-on-surface/10 flex items-center justify-center transition-colors active:scale-95"
              >
                <X className="w-5 h-5 text-md-on-surface-variant" />
              </button>
            </div>

            {/* Product Info */}
            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                {/* Product Image */}
                <div className="w-24 h-24 rounded-2xl bg-md-surface-container-low flex items-center justify-center shrink-0 overflow-hidden">
                  {isEmoji ? (
                    <span className="text-4xl">{imageContent}</span>
                  ) : (
                    <img
                      src={imageContent}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <p className="text-xs text-md-on-surface-variant mb-1">
                    {product.merchantName}
                  </p>
                  <h3 className="text-lg font-bold text-md-on-surface mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-md-primary">
                      {product.pointCost}
                    </span>
                    <span className="text-sm text-md-on-surface-variant">Point</span>
                  </div>
                </div>
              </div>

              {/* Point Summary */}
              <div className="bg-md-surface-container-low rounded-2xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-md-on-surface-variant">当前 Point</span>
                  <span className="font-medium text-md-on-surface">
                    {userPoint.toFixed(2)} Point
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-md-on-surface-variant">兑换消耗</span>
                  <span className="font-medium text-md-error">
                    -{product.pointCost} Point
                  </span>
                </div>
                <div className="h-px bg-md-on-surface/10 my-2" />
                <div className="flex justify-between">
                  <span className="font-medium text-md-on-surface">剩余 Point</span>
                  <span className="text-lg font-bold text-md-primary">
                    {remainingPoint.toFixed(2)} Point
                  </span>
                </div>
              </div>
            </div>

            {/* Info Message */}
            <div className="mb-6 p-4 rounded-2xl bg-md-tertiary/10 border border-md-tertiary/20">
              <p className="text-sm text-md-on-surface-variant text-center">
                兑换后商品将在 3-5 个工作日内发货，请填写收货信息
              </p>
            </div>

            {/* Shipping Address Form */}
            <div className="mb-6 space-y-3">
              <h4 className="text-sm font-medium text-md-on-surface">收货信息</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="收货人姓名"
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-md-surface-container-low border border-md-on-surface/10 text-md-on-surface placeholder:text-md-on-surface-variant focus:outline-none focus:border-md-primary transition-colors"
                />
                <input
                  type="tel"
                  placeholder="联系电话"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-md-surface-container-low border border-md-on-surface/10 text-md-on-surface placeholder:text-md-on-surface-variant focus:outline-none focus:border-md-primary transition-colors"
                />
                <input
                  type="text"
                  placeholder="收货地址"
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-md-surface-container-low border border-md-on-surface/10 text-md-on-surface placeholder:text-md-on-surface-variant focus:outline-none focus:border-md-primary transition-colors"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outlined"
                size="lg"
                className="flex-1"
                disabled={isLoading}
              >
                取消
              </Button>
              <Button
                onClick={handleConfirm}
                variant="filled"
                size="lg"
                className="flex-1"
                disabled={isLoading || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address}
              >
                {isLoading ? '兑换中...' : '确认兑换'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
