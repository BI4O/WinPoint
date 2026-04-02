'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { type MerchantProduct } from '@/lib/mock-data';
import RewardProductCard from '@/components/RewardProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import RedemptionModal from '@/components/RedemptionModal';
import AtmosphericBackground from '@/components/AtmosphericBackground';

export default function RewardsPage() {
  const router = useRouter();
  const merchantProducts = useStore(state => state.merchantProducts);
  const user = useStore(state => state.user);
  const redeemProduct = useStore(state => state.redeemProduct);
  const identityMode = useStore(state => state.identityMode);
  const currentMerchantId = useStore(state => state.currentMerchantId);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MerchantProduct | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redeemedProduct, setRedeemedProduct] = useState<MerchantProduct | null>(null);

  // 过滤上架商品并获取所有分类
  const listedProducts = merchantProducts.filter(p => p.isListed);
  const categories = ['全部', ...Array.from(new Set(listedProducts.map(p => p.category).filter(Boolean)))] as string[];

  // 筛选商品
  const filteredProducts = activeCategory === '全部'
    ? listedProducts
    : listedProducts.filter(p => p.category === activeCategory);

  // 商户模式下只显示自家商品
  const isMerchantMode = identityMode === 'merchant' && currentMerchantId;
  const merchantFilteredProducts = isMerchantMode
    ? filteredProducts.filter(p => p.merchantId === currentMerchantId)
    : filteredProducts;

  const handleRedeem = (product: MerchantProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirmRedeem = (productId: string) => {
    // RedemptionModal already called redeemProduct, just close modal and show success
    setIsModalOpen(false);
    setRedeemedProduct(selectedProduct);
    setShowSuccess(true);
    setSelectedProduct(null);

    setTimeout(() => {
      setShowSuccess(false);
      setRedeemedProduct(null);
    }, 3000);
  };

  return (
    <AtmosphericBackground className="min-h-screen bg-md-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-md-tertiary to-md-secondary-container flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-333">
                  积分商城
                </h1>
              </div>
            </div>

            {/* Point Balance */}
            <motion.div
              className="px-6 py-3 rounded-full bg-md-primary/10 border border-md-primary/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-1">我的 Point</span>
                <span className="text-2xl font-bold text-md-primary">
                  {user.point.toFixed(2)}
                </span>
              </div>
            </motion.div>
          </div>

          <p className="text-gray-1 ml-1">
            浏览并兑换积分商城的精选商品
          </p>
        </motion.div>

        {/* Category Filter - 仅用户模式显示 */}
        {!isMerchantMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="mb-8"
          >
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {merchantFilteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.08 * index,
                type: 'tween',
                duration: 0.5,
                ease: [0.2, 0, 0, 1]
              }}
            >
              <RewardProductCard
                product={product}
                userPoint={user.point}
                onRedeem={handleRedeem}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {merchantFilteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-1">
              {isMerchantMode ? '暂无上架商品' : '该分类暂无商品'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Redemption Modal */}
      <RedemptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        userPoint={user.point}
        onConfirm={handleConfirmRedeem}
      />

      {/* 成功通知 */}
      {showSuccess && redeemedProduct && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-2xl font-bold text-gray-333 mb-2">兑换成功!</h2>
            <p className="text-gray-1 mb-2">商品将在 3-5 个工作日内发货</p>
            <p className="text-md-primary font-bold">-{redeemedProduct.pointPrice} Point</p>
          </div>
        </motion.div>
      )}
    </AtmosphericBackground>
  );
}
