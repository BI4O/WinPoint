'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Package } from 'lucide-react';
import { MerchantOrder } from '@/lib/mock-data';

interface OrderListProps {
  orders: MerchantOrder[];
}

// 判断是否为代金券订单
function isVoucherOrder(order: MerchantOrder): boolean {
  return order.merchantId === 'winpoint' || order.productName.includes('现金券');
}

type OrderStatus = 'pending' | 'shipped' | 'delivered';

function getStatusLabel(status: string, isVoucher: boolean): string {
  switch (status) {
    case 'pending':
      return isVoucher ? '待发放' : '待发货';
    case 'shipped':
      return isVoucher ? '发放中' : '运输中';
    case 'delivered':
      return isVoucher ? '已到账' : '待收货';
    case 'used':
      return '已使用';
    default:
      return status;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'shipped':
      return 'bg-blue-100 text-primary border-primary/20';
    case 'delivered':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'used':
      return 'bg-gray-100 text-gray-500 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderList({ orders }: OrderListProps) {
  const [activeTab, setActiveTab] = useState('all');

  // 分离代金券订单和实物订单
  const voucherOrders = orders.filter(isVoucherOrder);
  const productOrders = orders.filter(order => !isVoucherOrder(order));

  // 排序：最新订单在前
  const sortedVouchers = [...voucherOrders].sort((a, b) => b.timestamp - a.timestamp);
  const sortedProducts = [...productOrders].sort((a, b) => b.timestamp - a.timestamp);

  // 根据tab筛选（仅对实物订单生效）
  const filteredProducts = activeTab === 'all'
    ? sortedProducts
    : sortedProducts.filter(order => order.status === activeTab);

  // 各状态数量
  const statusCounts = {
    all: productOrders.length,
    pending: productOrders.filter(o => o.status === 'pending').length,
    shipped: productOrders.filter(o => o.status === 'shipped').length,
    delivered: productOrders.filter(o => o.status === 'delivered').length,
  };

  const statusTabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待发货' },
    { key: 'shipped', label: '运输中' },
    { key: 'delivered', label: '待收货' },
  ];

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="text-5xl mb-4">📦</div>
        <p className="text-gray-500">暂无订单记录</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 代金券区域 */}
      {sortedVouchers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Ticket className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-gray-800">代金券</h3>
            <span className="text-sm text-gray-500">（电子券无需物流）</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sortedVouchers.map((order, index) => {
              const status = order.status as string;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg">🎫</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{order.productName}</h4>
                        <p className="text-xs text-gray-500">{formatTime(order.timestamp)}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                      {getStatusLabel(status, true)}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-primary/10 flex items-center justify-between">
                    <span className="text-xs text-gray-500">消耗积分</span>
                    <span className="font-bold text-primary">{order.pointPrice} 积分</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 实物订单区域 */}
      {sortedProducts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-gray-800">商品订单</h3>
          </div>

          {/* Tab 筛选 */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {statusTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = statusCounts[tab.key as keyof typeof statusCounts];
              return (
                <motion.button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                    transition-all duration-200
                    ${isActive
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.label} {count > 0 && `(${count})`}
                </motion.button>
              );
            })}
          </div>

          {/* 订单网格 */}
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500">该状态下暂无订单</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((order, index) => {
                const orderType = order.pointPrice > 0 && order.cashPrice === 0 ? 'points' : 'cash';
                const status = order.status as OrderStatus;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`rounded-2xl border p-4 ${orderType === 'cash' ? 'bg-blue-50 border-blue-200' : 'bg-primary/5 border-primary/20'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 mb-1 truncate">{order.productName}</h4>
                        <p className="text-xs text-gray-500 truncate">{order.merchantName} · {formatTime(order.timestamp)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 ml-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                          {getStatusLabel(status, false)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${orderType === 'cash' ? 'bg-blue-100 text-blue-700' : 'bg-primary/10 text-primary'}`}>
                          {orderType === 'cash' ? '现金购买' : '积分兑换'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
                      <div className="flex items-center gap-3">
                        {order.pointPrice > 0 && (
                          <div className="text-xs">
                            <span className="text-gray-500">积分:</span>
                            <span className="font-semibold text-primary ml-0.5">{order.pointPrice}</span>
                          </div>
                        )}
                        {order.cashPrice > 0 && (
                          <div className="text-xs">
                            <span className="text-gray-500">现金:</span>
                            <span className="font-semibold text-blue-600 ml-0.5">¥{order.cashPrice}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">x{order.quantity}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
