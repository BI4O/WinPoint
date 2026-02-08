'use client';

import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { type CartItem as CartItemType } from '@/lib/mock-data';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  const isEmoji = product.image.startsWith('emoji:');
  const imageContent = isEmoji ? product.image.replace('emoji:', '') : product.image;
  const subtotal = product.price * quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      className="flex gap-4 p-4 bg-md-surface-container rounded-2xl"
    >
      {/* 商品图片 */}
      <div className="w-20 h-20 rounded-xl bg-md-surface-container-low flex items-center justify-center flex-shrink-0 overflow-hidden">
        {isEmoji ? (
          <span className="text-3xl">{imageContent}</span>
        ) : (
          <img
            src={imageContent}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 商品信息 */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-md-on-surface mb-1 line-clamp-2">
          {product.name}
        </h4>
        <p className="text-lg font-bold text-md-primary mb-3">
          ${product.price}
        </p>

        {/* 数量控制 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-md-surface-container-low rounded-full p-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="w-7 h-7 rounded-full bg-md-background hover:bg-md-primary/10 flex items-center justify-center transition-colors"
            >
              <Minus className="w-4 h-4 text-md-on-surface" />
            </motion.button>

            <span className="w-8 text-center font-medium text-md-on-surface">
              {quantity}
            </span>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="w-7 h-7 rounded-full bg-md-background hover:bg-md-primary/10 flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4 text-md-on-surface" />
            </motion.button>
          </div>

          <span className="text-sm text-md-on-surface-variant">
            小计: ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 删除按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRemove(product.id)}
        className="w-9 h-9 rounded-full hover:bg-md-error/10 flex items-center justify-center transition-colors flex-shrink-0"
      >
        <Trash2 className="w-4 h-4 text-md-error" />
      </motion.button>
    </motion.div>
  );
}
