'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Button from './Button';
import CartItem from './CartItem';
import CheckoutModal from './CheckoutModal';

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCartDrawer({ isOpen, onClose }: ShoppingCartDrawerProps) {
  const router = useRouter();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const cart = useStore(state => state.cart);
  const updateCartItemQuantity = useStore(state => state.updateCartItemQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const clearCart = useStore(state => state.clearCart);
  const getCartTotal = useStore(state => state.getCartTotal);
  const getCartCreditTotal = useStore(state => state.getCartCreditTotal);

  const totalAmount = getCartTotal();
  const totalCredit = getCartCreditTotal();

  // 获取商家信息（假设购物车中的商品来自同一商家）
  const merchantId = cart.length > 0 ? cart[0].product.merchantId : '';
  const merchantName = cart.length > 0 ? cart[0].product.merchantId : '';

  const handleClearCart = () => {
    if (confirm('确定要清空购物车吗？')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
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
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* 抽屉 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-[400px] bg-md-background rounded-l-[32px] shadow-2xl flex flex-col"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-md-outline/20">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-md-primary" />
                  <h2 className="text-xl font-bold text-md-on-background">
                    购物车 ({cart.length})
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-md-primary/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-md-on-surface" />
                </motion.button>
              </div>

              {/* 商品列表 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-lg font-medium text-md-on-surface mb-2">
                      购物车是空的
                    </p>
                    <p className="text-sm text-md-on-surface-variant">
                      快去挑选心仪的商品吧
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cart.map(item => (
                      <CartItem
                        key={item.product.id}
                        item={item}
                        onUpdateQuantity={updateCartItemQuantity}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* 底部固定区域 */}
              {cart.length > 0 && (
                <div className="border-t border-md-outline/20 p-6 space-y-4">
                  {/* 总计 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-md-on-surface">
                      <span>商品总计:</span>
                      <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-md-success">
                      <span>将获得:</span>
                      <span className="font-bold">{totalCredit.toFixed(1)} Credit</span>
                    </div>
                  </div>

                  {/* 按钮 */}
                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckout}
                      variant="filled"
                      size="lg"
                      className="w-full"
                    >
                      去结算
                    </Button>
                    <Button
                      onClick={handleClearCart}
                      variant="outlined"
                      size="md"
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      清空购物车
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 结算确认弹窗 */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        merchantId={merchantId}
        merchantName={merchantName}
      />
    </>
  );
}
