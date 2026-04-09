# POPMART 品牌隔离实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 POPMART 用户模式或商户模式下，隐藏所有 WinPoint 品牌元素，显示 POPMART 品牌相关内容。

**Architecture:** 扩展 ThemeProvider，添加品牌上下文。创建 useBrand() hook 让组件获取当前品牌配置。所有品牌相关元素（logo、名称、版权）从配置读取。

**Tech Stack:** Next.js App Router, React Context, Zustand

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `contexts/BrandContext.tsx` | 新增 | 品牌上下文定义 |
| `hooks/useBrand.ts` | 新增 | useBrand hook |
| `components/ThemeProvider.tsx` | 修改 | 注入品牌上下文 |
| `components/Header.tsx` | 修改 | 使用品牌配置显示 logo/名称 |
| `components/Footer.tsx` | 修改 | 使用品牌配置显示 logo/版权 |
| `app/layout.tsx` | 修改 | 动态页面 title |
| `app/merchants/page.tsx` | 修改 | 动态页面标题 |

---

## Task 1: 创建 BrandContext

**Files:**
- 创建: `contexts/BrandContext.tsx`

- [ ] **Step 1: 创建 BrandContext 文件**

```tsx
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
    logo: '/images/popmart_logo_white.svg',
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
```

- [ ] **Step 2: 提交**

```bash
git add contexts/BrandContext.tsx
git commit -m "feat: add BrandContext for brand isolation"
```

---

## Task 2: 创建 useBrand Hook

**Files:**
- 创建: `hooks/useBrand.ts`

- [ ] **Step 1: 创建 useBrand hook**

```ts
// hooks/useBrand.ts
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
```

- [ ] **Step 2: 提交**

```bash
git add hooks/useBrand.ts
git commit -m "feat: add useBrand hook"
```

---

## Task 3: 扩展 ThemeProvider

**Files:**
- 修改: `components/ThemeProvider.tsx`

- [ ] **Step 1: 更新 ThemeProvider 注入品牌上下文**

```tsx
// components/ThemeProvider.tsx
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
```

- [ ] **Step 2: 提交**

```bash
git add components/ThemeProvider.tsx
git commit -m "feat: extend ThemeProvider with BrandContext"
```

---

## Task 4: 更新 Header 组件

**Files:**
- 修改: `components/Header.tsx`

- [ ] **Step 1: 更新 Header 使用品牌配置**

Header 需要：
1. 引入 `useBrandInfo` hook
2. 将硬编码的 "WinPoint" 替换为 `brandInfo.name`
3. 将硬编码的 logo 路径替换为 `brandInfo.logo`
4. POPMART 模式下的额外标签可以移除（因为整体已经是 POPMART 品牌了）

主要改动在第 44-60 行：

```tsx
// 在文件顶部添加 import
import { useBrandInfo } from '@/hooks/useBrand';

// 在组件内获取品牌配置
const brandInfo = useBrandInfo();

// 将 logo 和名称替换
<Image
  src={brandInfo.logo}
  alt={brandInfo.logoAlt}
  width={60}
  height={60}
  className="h-14 w-14"
/>
<span className="font-bold text-lg">{brandInfo.name}</span>

// 移除 isPopmart 时的额外标签（因为品牌已经切换了）
```

- [ ] **Step 2: 提交**

```bash
git add components/Header.tsx
git commit -m "feat: update Header to use brand config"
```

---

## Task 5: 更新 Footer 组件

**Files:**
- 修改: `components/Footer.tsx`

- [ ] **Step 1: 更新 Footer 使用品牌配置**

```tsx
// 在文件顶部添加 import
import { useBrandInfo } from '@/hooks/useBrand';

// 在组件内获取品牌配置
const brandInfo = useBrandInfo();

// 将 logo 和名称替换
<Image
  src={brandInfo.logo.replace('_white', '_red')}
  alt={brandInfo.logoAlt}
  width={40}
  height={40}
  className="h-10 w-10"
/>
<span className="font-bold text-lg text-primary">{brandInfo.name}</span>

// 版权信息替换
<p className="text-sm text-white/60">
  {brandInfo.copyright}
</p>
```

注意：Footer 的 logo 是红色版本，所以需要将 `_white` 替换为 `_red`。如果 POPMART 的红色 logo 文件名不同，需要调整。

- [ ] **Step 2: 提交**

```bash
git add components/Footer.tsx
git commit -m "feat: update Footer to use brand config"
```

---

## Task 6: 更新移动端侧边栏

**Files:**
- 修改: `components/Header.tsx`（同一个文件）

移动端侧边栏在 Header.tsx 的第 155-170 行左右，也需要更新：

```tsx
// 移动端侧边栏内的 logo 和名称
<Image
  src={brandInfo.logo}
  alt={brandInfo.logoAlt}
  width={60}
  height={60}
  className="h-14 w-14"
/>
<span className="font-bold text-lg">{brandInfo.name}</span>
```

- [ ] **Step 2: 提交**

```bash
git add components/Header.tsx
git commit -m "feat: update mobile sidebar to use brand config"
```

---

## Task 7: 更新 layout.tsx 动态 Title

**Files:**
- 修改: `app/layout.tsx`

由于 Next.js 的 metadata 是静态的，需要创建一个客户端组件来动态设置 title。

- [ ] **Step 1: 创建 BrandTitle 客户端组件**

在 `app/` 目录下创建 `BrandTitle.tsx`：

```tsx
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
```

- [ ] **Step 2: 更新 layout.tsx 引入 BrandTitle**

```tsx
import BrandTitle from './BrandTitle';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={roboto.className}>
      <body>
        <ThemeProvider>
          <BrandTitle />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: 提交**

```bash
git add app/BrandTitle.tsx app/layout.tsx
git commit -m "feat: add dynamic brand title"
```

---

## Task 8: 更新探索页标题

**Files:**
- 修改: `app/merchants/page.tsx`

- [ ] **Step 1: 更新探索页标题使用品牌配置**

```tsx
// 在组件内获取品牌配置
const brandInfo = useBrandInfo();

// 将标题替换
<h1 className="text-4xl font-bold text-gray-333">
  {brandInfo.name === 'POPMART' ? 'POPMART' : 'WinPoint网购'}
</h1>
```

- [ ] **Step 2: 提交**

```bash
git add app/merchants/page.tsx
git commit -m "feat: update merchants page title to use brand config"
```

---

## 验证检查清单

- [ ] POPMART 用户模式下：
  - [ ] Header 显示 POPMART logo 和名称
  - [ ] Footer 显示 POPMART logo、名称和版权
  - [ ] 页面 title 显示 "POPMART"
  - [ ] 探索页标题显示 "POPMART"
  - [ ] 移动端侧边栏显示 POPMART logo 和名称

- [ ] WinPoint 用户模式下：
  - [ ] Header 显示 WinPoint logo 和名称
  - [ ] Footer 显示 WinPoint logo、名称和版权
  - [ ] 页面 title 显示 "WinPoint"
  - [ ] 探索页标题显示 "WinPoint网购"

---

## 总结

完成上述任务后，POPMART 模式下将完全隐藏 WinPoint 品牌元素，显示 POPMART 品牌内容，提供完整的品牌沉浸体验。
