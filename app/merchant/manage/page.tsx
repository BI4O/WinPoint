'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { mockMerchants } from '@/lib/mock-data';
import AddProductModal from '@/components/AddProductModal';
import MerchantStatsCard from '@/components/MerchantStatsCard';
import { Plus, AlertTriangle } from 'lucide-react';
import Button from '@/components/Button';
import MerchantProductRow from '@/components/MerchantProductRow';
import MerchantOrderRow from '@/components/MerchantOrderRow';
import AtmosphericBackground from '@/components/AtmosphericBackground';

export default function MerchantManagePage() {
  const merchantProducts = useStore(state => state.merchantProducts);
  const merchantOrders = useStore(state => state.merchantOrders);
  const identityMode = useStore(state => state.identityMode);
  const currentMerchantId = useStore(state => state.currentMerchantId);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stats'>('products');
  const [showAddModal, setShowAddModal] = useState(false);

  // 商户模式下使用 store 的 currentMerchantId，否则用默认的 starbucks
  const selectedMerchantId = identityMode === 'merchant' && currentMerchantId ? currentMerchantId : 'starbucks';
  const currentMerchant = mockMerchants.find(m => m.id === selectedMerchantId);
  const merchantProductsList = merchantProducts.filter(p => p.merchantId === selectedMerchantId);
  const merchantOrdersList = merchantOrders.filter(o => o.merchantId === selectedMerchantId);

  // 计算商户统计数据
  const totalProducts = merchantProductsList.length;
  const listedProducts = merchantProductsList.filter(p => p.isListed).length;
  const lowStockProducts = merchantProductsList.filter(p => p.stock > 0 && p.stock < 10).length;
  const outOfStockProducts = merchantProductsList.filter(p => p.stock === 0).length;
  const totalOrders = merchantOrdersList.length;
  const pendingOrders = merchantOrdersList.filter(o => o.status === 'pending').length;
  const shippedOrders = merchantOrdersList.filter(o => o.status === 'shipped').length;
  const totalSales = merchantOrdersList.reduce((sum, o) => sum + o.cashPrice * o.quantity, 0);
  const totalPointsEarned = merchantOrdersList.reduce((sum, o) => sum + o.pointPrice * o.quantity, 0);

  return (
    <AtmosphericBackground className="min-h-screen bg-md-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-333 mb-2">
            商户管理
          </h1>
          <p className="text-gray-1">
            管理您的商品和订单
          </p>
        </motion.div>

        {/* Merchant Selector - 仅用户模式显示 */}
        {identityMode !== 'merchant' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <label className="block text-sm font-medium text-gray-333 mb-2">
              当前商户
            </label>
            <select
              value={selectedMerchantId}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-md-primary focus:outline-none w-64"
            >
              {mockMerchants.map(merchant => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.logo} {merchant.name}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'products'
                  ? 'text-md-primary border-b-2 border-md-primary'
                  : 'text-gray-500 hover:text-gray-333'
              }`}
            >
              商品管理 ({merchantProductsList.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'text-md-primary border-b-2 border-md-primary'
                  : 'text-gray-500 hover:text-gray-333'
              }`}
            >
              订单管理 ({merchantOrdersList.length})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-md-primary border-b-2 border-md-primary'
                  : 'text-gray-500 hover:text-gray-333'
              }`}
            >
              数据概览
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === 'products' ? (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-333">商品列表</h3>
                <Button
                  onClick={() => setShowAddModal(true)}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  新增商品
                </Button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">商品</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">现金价</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">积分价</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">库存</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">上架</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {merchantProductsList.map(product => (
                    <MerchantProductRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'orders' ? (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">订单信息</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">商品</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">价格</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">收货信息</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {merchantOrdersList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">
                        暂无订单
                      </td>
                    </tr>
                  ) : (
                    merchantOrdersList.map(order => (
                      <MerchantOrderRow key={order.id} order={order} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 概览卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MerchantStatsCard
                  title="商品总数"
                  value={totalProducts}
                  subtitle={`${listedProducts} 上架中`}
                  icon="📦"
                />
                <MerchantStatsCard
                  title="总订单数"
                  value={totalOrders}
                  subtitle={`${pendingOrders} 待处理`}
                  icon="🛒"
                />
                <MerchantStatsCard
                  title="销售额"
                  value={`¥${totalSales.toFixed(2)}`}
                  subtitle={`积分收入: ${totalPointsEarned}`}
                  icon="💰"
                />
                <MerchantStatsCard
                  title="库存预警"
                  value={lowStockProducts + outOfStockProducts}
                  subtitle={`${outOfStockProducts} 已售罄`}
                  icon="⚠️"
                />
              </div>

              {/* 低库存商品列表 */}
              {lowStockProducts > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-333 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    库存不足
                  </h3>
                  <div className="space-y-2">
                    {merchantProductsList
                      .filter(p => p.stock > 0 && p.stock < 10)
                      .map(product => (
                        <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{product.image.startsWith('emoji:') ? product.image.replace('emoji:', '') : product.image}</span>
                            <span className="font-medium text-gray-333">{product.name}</span>
                          </div>
                          <span className="text-orange-500 font-medium">剩余 {product.stock} 件</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 售罄商品列表 */}
              {outOfStockProducts > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-333 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    已售罄
                  </h3>
                  <div className="space-y-2">
                    {merchantProductsList
                      .filter(p => p.stock === 0)
                      .map(product => (
                        <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{product.image.startsWith('emoji:') ? product.image.replace('emoji:', '') : product.image}</span>
                            <span className="font-medium text-gray-333">{product.name}</span>
                          </div>
                          <span className="text-red-500 font-medium">售罄</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        merchantId={selectedMerchantId}
        merchantName={currentMerchant?.name || ''}
      />
    </AtmosphericBackground>
  );
}
