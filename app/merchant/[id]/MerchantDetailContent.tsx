'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Store, Tag } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Merchant } from '@/lib/mock-data';
import ProductCard from '@/components/ProductCard';
import CartFloatingButton from '@/components/CartFloatingButton';
import ShoppingCartDrawer from '@/components/ShoppingCartDrawer';

interface MerchantDetailContentProps {
  merchant: Merchant;
}

export default function MerchantDetailContent({ merchant }: MerchantDetailContentProps) {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cart = useStore(state => state.cart);
  const addToCart = useStore(state => state.addToCart);
  const getCartItemCount = useStore(state => state.getCartItemCount);
  const getCartTotal = useStore(state => state.getCartTotal);
  const currentMerchantId = useStore(state => state.currentMerchantId);

  // 积分名称：POPMART 模式下叫 POP积分
  const pointLabel = currentMerchantId === 'popmart' ? 'POP积分' : 'WIN积分';

  return (
    <div className="min-h-screen bg-md-background pb-24">
      {/* 返回按钮 */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-333 hover:text-md-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">返回</span>
        </button>
      </div>

      {/* 店铺头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        className="container mx-auto px-4 mb-8"
      >
        <div className="bg-white rounded-[32px] p-8 shadow-sm">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-md-primary/10 flex items-center justify-center text-4xl flex-shrink-0">
              {merchant.logo}
            </div>

            {/* 信息 */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-333 mb-2">
                {merchant.name}
              </h1>

              <div className="flex items-center gap-4 text-gray-333-variant mb-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  <span>{merchant.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>消费可获得 {pointLabel} (10:1)</span>
                </div>
              </div>

              <p className="text-gray-333-variant">
                {merchant.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 商品网格 */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-10"
        >
          {merchant.products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + index * 0.08,
                duration: 0.3,
                ease: [0.2, 0, 0, 1]
              }}
            >
              <ProductCard
                product={product}
                onAddToCart={(product) => {
                  addToCart(product);
                  // 可选：显示成功提示
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 购物车浮动按钮 */}
      {getCartItemCount() > 0 && (
        <CartFloatingButton
          itemCount={getCartItemCount()}
          totalAmount={getCartTotal()}
          onClick={() => setIsCartOpen(true)}
        />
      )}

      {/* 购物车抽屉 */}
      <ShoppingCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}
