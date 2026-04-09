'use client';

import { useEffect } from 'react';
import { useBrandInfo } from '@/hooks/useBrand';

export default function BrandTitle() {
  const brandInfo = useBrandInfo();

  useEffect(() => {
    // 更新页面 title
    document.title = brandInfo.title;
  }, [brandInfo.title]);

  return null;
}
