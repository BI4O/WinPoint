'use client';

import { motion } from 'framer-motion';
import { Coins, Package } from 'lucide-react';
import { useStore } from '@/lib/store';
import { mockMerchantOrders } from '@/lib/mock-data';
import AtmosphericBackground from '@/components/AtmosphericBackground';
import OrderList from '@/components/OrderList';
import Card from '@/components/Card';

export default function DashboardPage() {
  const user = useStore((state) => state.user);
  const identityMode = useStore((state) => state.identityMode);
  const currentMerchantId = useStore((state) => state.currentMerchantId);

  // 是否是 POPMART 用户模式（用户视角但限定在 POPMART）
  const isPopmartUserMode = identityMode === 'user' && currentMerchantId === 'popmart';

  // 获取当前用户的订单
  let userOrders = mockMerchantOrders.filter(
    (order) => order.userAddress === user.address || order.userId === '0x1234...5678'
  );

  // POPMART 用户模式下只显示 POPMART 订单
  if (isPopmartUserMode) {
    userOrders = userOrders.filter(order => order.merchantId === 'popmart');
  }

  // 计算已购买商品数量
  const purchasedCount = userOrders.filter(
    (order) => order.status === 'shipped' || order.status === 'delivered'
  ).length + userOrders.length;

  return (
    <AtmosphericBackground className="min-h-screen bg-md-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-333 mb-2">
            我的
          </h1>
        </motion.div>

        {/* 积分余额卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="mb-10"
        >
          <Card hover className="bg-gradient-to-br from-primary to-primary/90 border-0">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Coins className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm mb-1">我的积分</p>
                  <motion.h2
                    className="text-4xl font-bold text-white"
                    key={user.point}
                    initial={{ scale: 1.2, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', duration: 0.4, stiffness: 300 }}
                  >
                    {user.point.toFixed(0)}
                  </motion.h2>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-white/80">
                  <Package className="h-5 w-5" />
                  <span className="text-lg">已购买 {purchasedCount} 件商品</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 订单记录 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-333">
              订单记录
            </h2>
          </div>
          <OrderList orders={userOrders} />
        </motion.div>
      </div>
    </AtmosphericBackground>
  );
}
