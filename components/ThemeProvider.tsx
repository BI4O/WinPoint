'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { BrandProvider, type Brand } from '@/contexts/BrandContext';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentMerchantId = useStore((state) => state.currentMerchantId);

  // 根据 currentMerchantId 确定品牌
  const brand: Brand = currentMerchantId === 'popmart' ? 'popmart' : 'winpoint';

  useEffect(() => {
    // 如果当前商户是 POPMART，添加 popmart 主题 class
    if (currentMerchantId === 'popmart') {
      document.body.classList.add('theme-popmart');
    } else {
      document.body.classList.remove('theme-popmart');
    }

    // 清理函数
    return () => {
      document.body.classList.remove('theme-popmart');
    };
  }, [currentMerchantId]);

  return (
    <BrandProvider brand={brand}>
      {children}
    </BrandProvider>
  );
}
