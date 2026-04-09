'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentMerchantId = useStore((state) => state.currentMerchantId);

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

  return <>{children}</>;
}
