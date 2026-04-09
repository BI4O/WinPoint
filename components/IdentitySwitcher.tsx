'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, type MerchantId } from '@/lib/store';
import { mockMerchants } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function IdentitySwitcher() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { identityMode, currentMerchantId, setIdentityMode } = useStore();

  const currentMerchant = currentMerchantId
    ? mockMerchants.find(m => m.id === currentMerchantId)
    : null;

  // 判断当前是否是独立站模式
  const isPopmartMode = currentMerchantId === 'popmart';
  const isPopmartUserMode = identityMode === 'user' && currentMerchantId === 'popmart';
  const displayEmoji = isPopmartMode && identityMode === 'merchant' ? '🫧' : (currentMerchant?.logo || '👤');
  const displayLabel = isPopmartUserMode ? '用户（POPMART）' : (isPopmartMode ? 'POPMART 独立站' : (currentMerchant?.name || '用户'));

  const handleSelect = (mode: 'user' | 'merchant', merchantId?: string) => {
    setIdentityMode(mode, merchantId as MerchantId);
    setIsOpen(false);

    // 切换后跳转到对应页面
    if (mode === 'user') {
      router.push('/dashboard');
    } else {
      router.push('/merchant/manage');
    }
  };

  // 普通商户（排除 POPMART）
  const regularMerchants = mockMerchants.filter(m => m.id !== 'popmart');
  const popmartMerchant = mockMerchants.find(m => m.id === 'popmart');

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-lg">{displayEmoji}</span>
        <span className="text-sm font-medium text-white hidden sm:inline">{displayLabel}</span>
        <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              {/* 用户模式 */}
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">用户模式</p>
                <button
                  onClick={() => handleSelect('user')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    identityMode === 'user' && currentMerchantId !== 'popmart'
                      ? 'bg-md-primary/10 text-md-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-medium">用户</span>
                </button>
                {/* POPMART 独立站（用户视角） */}
                {popmartMerchant && (
                  <button
                    onClick={() => handleSelect('user', 'popmart')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      identityMode === 'user' && currentMerchantId === 'popmart'
                        ? 'bg-md-primary/10 text-md-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">👤</span>
                    <span className="text-sm font-medium">用户（POPMART）</span>
                  </button>
                )}
              </div>

              {/* 商户模式 */}
              <div className="border-t border-gray-100 p-2">
                <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">商户模式</p>
                {regularMerchants.map(merchant => (
                  <button
                    key={merchant.id}
                    onClick={() => handleSelect('merchant', merchant.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      identityMode === 'merchant' && currentMerchantId === merchant.id
                        ? 'bg-md-primary/10 text-md-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{merchant.logo}</span>
                    <span className="text-sm font-medium">{merchant.name}</span>
                  </button>
                ))}
                {/* POPMART 独立站（商户视角） */}
                {popmartMerchant && (
                  <button
                    onClick={() => handleSelect('merchant', 'popmart')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      identityMode === 'merchant' && currentMerchantId === 'popmart'
                        ? 'bg-md-primary/10 text-md-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{popmartMerchant.logo}</span>
                    <span className="text-sm font-medium">{popmartMerchant.name}</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
