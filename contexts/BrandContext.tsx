// contexts/BrandContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

export type Brand = 'winpoint' | 'popmart';

export interface BrandConfig {
  name: string;
  logo: string;
  logoAlt: string;
  title: string;
  copyright: string;
}

const brandConfigs: Record<Brand, BrandConfig> = {
  winpoint: {
    name: 'WinPoint',
    logo: '/images/winpoint_logo_white.svg',
    logoAlt: 'WinPoint',
    title: 'WinPoint',
    copyright: '© 2026 WinPoint. 保留所有权利.',
  },
  popmart: {
    name: 'POPMART',
    logo: '/images/popmart_logo_white.png',
    logoAlt: 'POPMART',
    title: 'POPMART',
    copyright: '© 2026 POPMART. 保留所有权利.',
  },
};

export const BrandContext = createContext<Brand>('winpoint');

export function BrandProvider({ brand, children }: { brand: Brand; children: ReactNode }) {
  return (
    <BrandContext.Provider value={brand}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrandConfig() {
  const brand = useContext(BrandContext);
  return brandConfigs[brand];
}

export { brandConfigs };
