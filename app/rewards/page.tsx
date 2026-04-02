'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { mockRewardProducts, type RewardProduct } from '@/lib/mock-data';
import RewardProductCard from '@/components/RewardProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import RedemptionModal from '@/components/RedemptionModal';
import SuccessNotification from '@/components/SuccessNotification';
import AtmosphericBackground from '@/components/AtmosphericBackground';

export default function RewardsPage() {
  const router = useRouter();
  const user = useStore(state => state.user);
  const redeemProduct = useStore(state => state.redeemProduct);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<RewardProduct | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redeemedProduct, setRedeemedProduct] = useState<RewardProduct | null>(null);

  // 获取所有分类
  const categories = ['全部', ...Array.from(new Set(mockRewardProducts.map(p => p.category)))];

  // 筛选商品
  const filteredProducts = activeCategory === '全部'
    ? mockRewardProducts
    : mockRewardProducts.filter(p => p.category === activeCategory);

  const handleRedeem = (product: RewardProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirmRedeem = (productId: string) => {
    if (!selectedProduct) return;

    const success = redeemProduct(
      productId,
      selectedProduct.name,
      selectedProduct.merchantName,
      selectedProduct.pointCost
    );

    if (success) {
      setIsModalOpen(false);
      setRedeemedProduct(selectedProduct);
      setSelectedProduct(null);

      // 显示成功通知
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setRedeemedProduct(null);
        router.push('/dashboard');
      }, 3000);

      // 移除自动跳转: router.push('/dashboard');
    }
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
                  兑换
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
            使用 Point 兑换心仪商品，1 Point = ¥1 商品价值
          </p>
        </motion.div>

        {/* Category Filter */}
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

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product, index) => (
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
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-1">
              该分类暂无商品
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
      <SuccessNotification
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setRedeemedProduct(null);
          router.push('/dashboard');
        }}
        title="兑换成功!"
        amount={redeemedProduct ? -redeemedProduct.pointCost : 0}
        unit="Point"
        message={`商品将在 3-5 个工作日内发送
正在跳转到资产页面...`}
        emoji="🎁"
        countdown={3}
      />
    </AtmosphericBackground>
  );
}
