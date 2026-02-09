'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { mockMerchants } from '@/lib/mock-data';
import Button from './Button';
import SuccessNotification from './SuccessNotification';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutSuccess?: () => void;
  merchantId: string;
  merchantName: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onCheckoutSuccess,
  merchantId,
  merchantName
}: CheckoutModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [earnedPoint, setEarnedPoint] = useState(0);

  const cart = useStore(state => state.cart);
  const checkout = useStore(state => state.checkout);
  const getCartTotal = useStore(state => state.getCartTotal);
  const getCartPointTotal = useStore(state => state.getCartPointTotal);

  const totalAmount = getCartTotal();
  const totalPoint = getCartPointTotal();

  // 获取商家信息
  const merchant = mockMerchants.find(m => m.id === merchantId);

  const handleConfirm = async () => {
    setIsSubmitting(true);

    // 模拟支付处理
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 保存 Point 值(checkout 会清空购物车)
    const pointToEarn = getCartPointTotal();
    setEarnedPoint(pointToEarn);

    // 执行结算
    checkout(merchantId, merchant?.name || merchantName);

    setIsSubmitting(false);
    onClose();

    // 显示成功通知
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      router.push('/dashboard');
    }, 2000);

    // 通知父组件关闭购物车
    onCheckoutSuccess?.();

    // 移除自动跳转: router.push('/dashboard');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* 模态框 */}
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
                className="bg-md-background rounded-[32px] shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-md-outline/20">
                  <h2 className="text-xl font-bold text-md-on-background">
                    确认订单
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-10 h-10 rounded-full hover:bg-md-primary/10 flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-md-on-surface" />
                  </motion.button>
                </div>

                {/* 内容 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* 商家信息 */}
                  <div>
                    <p className="text-sm text-md-on-surface-variant mb-1">商家</p>
                    <p className="text-lg font-medium text-md-on-surface">
                      {merchant?.name || merchantName}
                    </p>
                  </div>

                  {/* 订单明细 */}
                  <div>
                    <p className="text-sm text-md-on-surface-variant mb-3">订单明细</p>
                    <div className="space-y-2">
                      {cart.map(item => (
                        <div
                          key={item.product.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-md-on-surface">
                            {item.product.name} × {item.quantity}
                          </span>
                          <span className="font-medium text-md-on-surface">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 总计 */}
                  <div className="pt-4 border-t border-md-outline/20 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-md-on-surface">商品总计:</span>
                      <span className="text-xl font-bold text-md-on-surface">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-md-success">将获得 Point:</span>
                      <span className="text-lg font-bold text-md-success">
                        {totalPoint.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* 提示信息 */}
                  <div className="bg-md-primary-container/40 rounded-2xl p-4">
                    <p className="text-sm text-md-on-surface-variant">
                      💡 提示: Point 可用于质押获得 RWA，参与收益分配
                    </p>
                  </div>
                </div>

                {/* 底部按钮 */}
                <div className="p-6 border-t border-md-outline/20 flex gap-3">
                  <Button
                    onClick={onClose}
                    variant="outlined"
                    size="lg"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    variant="filled"
                    size="lg"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                        />
                        处理中...
                      </span>
                    ) : (
                      '确认支付'
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* 成功通知 */}
      <SuccessNotification
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.push('/dashboard');
        }}
        title="购买成功!"
        amount={earnedPoint}
        unit="积分"
        message={`积分已到账，可用于质押或兑换商品
正在跳转到资产页面...`}
        emoji="🎉"
      />
    </>
  );
}
