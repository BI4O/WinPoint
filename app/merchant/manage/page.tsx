'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { mockMerchants } from '@/lib/mock-data';
import AddProductModal from '@/components/AddProductModal';
import MerchantStatsCard from '@/components/MerchantStatsCard';
import MerchantStatsChart from '@/components/MerchantStatsChart';
import { Plus, AlertTriangle } from 'lucide-react';
import Button from '@/components/Button';
import MerchantProductRow from '@/components/MerchantProductRow';
import MerchantOrderRow from '@/components/MerchantOrderRow';
import AtmosphericBackground from '@/components/AtmosphericBackground';
import WinPointsPanel from '@/components/WinPointsPanel';
import BenefitsList from '@/components/BenefitsList';
import BenefitOrderRow from '@/components/BenefitOrderRow';

export default function MerchantManagePage() {
  const merchantProducts = useStore(state => state.merchantProducts);
  const merchantOrders = useStore(state => state.merchantOrders);
  const merchantWinBalance = useStore(state => state.merchantWinBalance);
  const merchantBenefitOrders = useStore(state => state.merchantBenefitOrders);
  const identityMode = useStore(state => state.identityMode);
  const currentMerchantId = useStore(state => state.currentMerchantId);
  const [activeTab, setActiveTab] = useState<'win' | 'products' | 'benefits' | 'orders'>('win');
  const [showAddModal, setShowAddModal] = useState(false);
  const [userSelectedMerchantId, setUserSelectedMerchantId] = useState('starbucks');

  // 商户模式下使用 store 的 currentMerchantId，否则用用户选择的
  const selectedMerchantId = identityMode === 'merchant' && currentMerchantId ? currentMerchantId : userSelectedMerchantId;
  const currentMerchant = mockMerchants.find(m => m.id === selectedMerchantId);
  const merchantProductsList = merchantProducts.filter(p => p.merchantId === selectedMerchantId);
  const merchantOrdersList = merchantOrders.filter(o => o.merchantId === selectedMerchantId);
  const merchantBenefitOrdersList = merchantBenefitOrders.filter(o => o.merchantId === selectedMerchantId);

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
            后台管理
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
              value={userSelectedMerchantId}
              onChange={(e) => setUserSelectedMerchantId(e.target.value)}
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

        {/* Stats Overview - 商户视角直接显示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
              value={`¥${totalSales.toFixed(0)}`}
              subtitle={`积分 ${totalPointsEarned}`}
              icon="💰"
            />
            <MerchantStatsCard
              title="库存预警"
              value={lowStockProducts + outOfStockProducts}
              subtitle={`${outOfStockProducts} 已售罄`}
              icon="⚠️"
            />
          </div>

          {/* Warning Lists */}
          {(lowStockProducts > 0 || outOfStockProducts > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 低库存商品 */}
              {lowStockProducts > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
                  <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    库存不足 ({lowStockProducts})
                  </h3>
                  <div className="space-y-2">
                    {merchantProductsList
                      .filter(p => p.stock > 0 && p.stock < 10)
                      .map(product => (
                        <div key={product.id} className="flex items-center justify-between bg-white/80 rounded-xl px-4 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{product.image.startsWith('emoji:') ? product.image.replace('emoji:', '') : product.image}</span>
                            <span className="text-sm font-medium text-gray-700">{product.name}</span>
                          </div>
                          <span className="text-sm font-bold text-orange-500">剩余 {product.stock} 件</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 售罄商品 */}
              {outOfStockProducts > 0 && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-5 border border-red-200">
                  <h3 className="text-base font-bold text-red-600 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    已售罄 ({outOfStockProducts})
                  </h3>
                  <div className="space-y-2">
                    {merchantProductsList
                      .filter(p => p.stock === 0)
                      .map(product => (
                        <div key={product.id} className="flex items-center justify-between bg-white/80 rounded-xl px-4 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{product.image.startsWith('emoji:') ? product.image.replace('emoji:', '') : product.image}</span>
                            <span className="text-sm font-medium text-gray-700">{product.name}</span>
                          </div>
                          <span className="text-sm font-bold text-red-500">售罄</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* 数据趋势图表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <MerchantStatsChart />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
            {[
              { key: 'win', label: 'WIN积分' },
              { key: 'products', label: '商品管理' },
              { key: 'benefits', label: '权益管理' },
              { key: 'orders', label: '订单管理' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`pb-3 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-md-primary border-b-2 border-md-primary'
                    : 'text-gray-500 hover:text-gray-333'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === 'win' ? (
            <WinPointsPanel />
          ) : activeTab === 'benefits' ? (
            <BenefitsList />
          ) : activeTab === 'products' ? (
            // 商品管理 Tab
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
          ) : (
            // 订单管理 Tab
            <div className="space-y-6">
              {/* 商品订单 */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-333">商品订单</h3>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">商品</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">用户</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">价格</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">时间</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchantOrdersList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-500">
                          暂无商品订单
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

              {/* 权益订单 */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-333">权益订单</h3>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">权益</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">用户</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">券码</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">WIN</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">时间</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchantBenefitOrdersList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-500">
                          暂无权益订单
                        </td>
                      </tr>
                    ) : (
                      merchantBenefitOrdersList.map(order => (
                        <BenefitOrderRow key={order.id} order={order} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
