'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import AtmosphericBackground from '@/components/AtmosphericBackground';
import BalanceDisplay from '@/components/BalanceDisplay';
import OrderBook from '@/components/OrderBook';
import TradingForm from '@/components/TradingForm';
import OrderHistoryTabs from '@/components/OrderHistoryTabs';
import ConfirmDialog from '@/components/ConfirmDialog';
import SuccessNotification from '@/components/SuccessNotification';
import { useStore } from '@/lib/store';

export default function MarketPage() {
  const orderBook = useStore(state => state.orderBook);
  const currentOrders = useStore(state => state.currentOrders);
  const historicalOrders = useStore(state => state.historicalOrders);
  const cancelOrder = useStore(state => state.cancelOrder);

  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // 默认价格：使用最新成交价作为市价
  const defaultBuyPrice = useMemo(() => {
    return orderBook.lastPrice;
  }, [orderBook]);

  const defaultSellPrice = useMemo(() => {
    return orderBook.lastPrice;
  }, [orderBook]);

  // 处理订单簿价格点击
  const handlePriceClick = (price: number) => {
    setSelectedPrice(price);
  };

  // 处理取消订单请求
  const handleCancelOrderRequest = (orderId: string) => {
    setOrderToCancel(orderId);
    setShowCancelDialog(true);
  };

  // 确认取消订单
  const handleConfirmCancel = () => {
    if (orderToCancel) {
      const success = cancelOrder(orderToCancel);
      if (success) {
        setNotificationMessage('订单已取消');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        setNotificationMessage('取消订单失败');
        setShowError(true);
        setTimeout(() => setShowError(false), 2000);
      }
      setOrderToCancel(null);
    }
  };

  return (
    <>
      <AtmosphericBackground className="min-h-screen bg-md-background">
        <div className="container mx-auto px-4 py-8">
          {/* 顶部：标题 + 余额 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-md-on-background mb-2">
                交易市场
              </h1>
              <p className="text-md-on-surface-variant">
                实时查看 RWA 价格走势，随时进行交易
              </p>
            </div>
            <BalanceDisplay />
          </motion.div>

          {/* 主内容区：左右分栏 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 左侧：订单簿（2/3 宽度） */}
            <div className="lg:col-span-2">
              <OrderBook
                orderBook={orderBook}
                onPriceClick={handlePriceClick}
              />
            </div>

            {/* 右侧：交易表单（1/3 宽度） */}
            <div>
              <TradingForm
                initialPrice={selectedPrice}
                defaultBuyPrice={defaultBuyPrice}
                defaultSellPrice={defaultSellPrice}
              />
            </div>
          </div>

          {/* 底部：订单历史 */}
          <OrderHistoryTabs
            currentOrders={currentOrders}
            historicalOrders={historicalOrders}
            onCancelOrder={handleCancelOrderRequest}
          />
        </div>
      </AtmosphericBackground>

      {/* 取消订单确认对话框 */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleConfirmCancel}
        title="取消订单"
        message="确定要取消这个订单吗？未成交的资金将退还到您的账户。"
        confirmText="确认取消"
        cancelText="返回"
        type="warning"
      />

      {/* 成功通知 */}
      <SuccessNotification
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="操作成功"
        amount={0}
        unit=""
        message={notificationMessage}
        emoji="✅"
      />

      {/* 错误通知 */}
      <SuccessNotification
        isOpen={showError}
        onClose={() => setShowError(false)}
        title="操作失败"
        amount={0}
        unit=""
        message={notificationMessage}
        emoji="❌"
      />
    </>
  );
}
