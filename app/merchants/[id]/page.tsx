'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Store, Tag } from 'lucide-react';
import { useStore } from '@/lib/store';
import { mockMerchants } from '@/lib/mock-data';
import ProductCard from '@/components/ProductCard';
import CartFloatingButton from '@/components/CartFloatingButton';
import ShoppingCartDrawer from '@/components/ShoppingCartDrawer';

export default function MerchantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const merchantId = params.id as string;

  const [isCartOpen, setIsCartOpen] = useState(false);

  const cart = useStore(state => state.cart);
  const addToCart = useStore(state => state.addToCart);
  const getCartItemCount = useStore(state => state.getCartItemCount);
  const getCartTotal = useStore(state => state.getCartTotal);

  // 查找商家
  const merchant = mockMerchants.find(m => m.id === merchantId);

  if (!merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-md-on-surface-variant mb-4">商家不存在</p>
          <button
            onClick={() => router.push('/merchants')}
            className="text-md-primary hover:underline"
          >
            返回商家列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-md-background pb-24">
      {/* 返回按钮 */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-md-on-surface hover:text-md-primary transition-colors"
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
        <div className="bg-md-surface-container rounded-[32px] p-8 shadow-sm">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-md-primary/10 flex items-center justify-center text-4xl flex-shrink-0">
              {merchant.logo}
            </div>

            {/* 信息 */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-md-on-surface mb-2">
                {merchant.name}
              </h1>

              <div className="flex items-center gap-4 text-md-on-surface-variant mb-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  <span>{merchant.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>消费可获得 Credit (10:1)</span>
                </div>
              </div>

              <p className="text-md-on-surface-variant">
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
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
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
