import { useContext } from 'react';
import { BrandContext, useBrandConfig, type Brand, type BrandConfig } from '@/contexts/BrandContext';

// 获取当前品牌
export function useBrand(): Brand {
  return useContext(BrandContext);
}

// 获取品牌配置
export function useBrandInfo(): BrandConfig {
  return useBrandConfig();
}
