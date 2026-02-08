'use client';

import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { type Product } from '@/lib/mock-data';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isEmoji = product.image.startsWith('emoji:');
  const imageContent = isEmoji ? product.image.replace('emoji:', '') : product.image;

  return (
    <Card hover className="flex flex-col h-full">
      {/* 商品图片 */}
      <div className="aspect-square rounded-2xl bg-md-surface-container-low flex items-center justify-center mb-4 overflow-hidden">
        {isEmoji ? (
          <span className="text-6xl">{imageContent}</span>
        ) : (
          <img
            src={imageContent}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 商品信息 */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-base font-medium text-md-on-surface mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-auto">
          <p className="text-2xl font-bold text-md-primary mb-4">
            ${product.price}
          </p>

          <Button
            onClick={() => onAddToCart(product)}
            variant="filled"
            size="md"
            className="w-full"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            加入购物车
          </Button>
        </div>
      </div>
    </Card>
  );
}
