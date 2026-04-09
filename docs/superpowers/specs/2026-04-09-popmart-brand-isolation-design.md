# POPMART 品牌隔离设计

## 概述

在 POPMART 用户模式或商户模式下，隐藏所有 WinPoint 品牌元素，显示 POPMART 品牌相关内容，提供完整的品牌沉浸体验。

## 背景

当前 POPMART 模式下仍存在以下 WinPoint 残留：
- Header Logo + "WinPoint" 文字
- Footer Logo + "WinPoint" + 版权信息
- 页面 title "WinPoint"
- 探索页标题 "WinPoint网购"
- 移动端侧边栏 Logo

## 架构设计

### 品牌上下文

扩展 ThemeProvider，添加品牌上下文：

```tsx
type Brand = 'winpoint' | 'popmart';
```

创建 `useBrand()` hook，组件通过此 hook 获取当前品牌。

### 品牌配置

| 属性 | WinPoint | POPMART |
|------|----------|---------|
| name | WinPoint | POPMART |
| logo | /images/winpoint_logo_white.svg | /images/popmart_logo_white.svg |
| title | WinPoint | POPMART |
| copyright | © 2026 WinPoint | © 2026 POPMART |

## 改造组件

| 组件 | 改动内容 |
|------|----------|
| ThemeProvider | 注入品牌上下文 |
| useBrand hook | 返回当前品牌配置 |
| Header | 根据品牌显示对应 logo + 名称 |
| Footer | 根据品牌显示对应 logo + 版权 |
| 移动端侧边栏 | 同 Header |
| layout.tsx | 动态页面 title |
| 探索页 | POPMART 模式显示 "POPMART" 而非 "WinPoint网购" |

## 实现步骤

1. 创建 `contexts/BrandContext.tsx` - 品牌上下文
2. 创建 `hooks/useBrand.ts` - useBrand hook
3. 扩展 ThemeProvider，注入品牌
4. 更新 Header 组件
5. 更新 Footer 组件
6. 更新移动端侧边栏
7. 更新 layout.tsx 动态 title
8. 更新探索页标题逻辑

## 文件变更

- 新增: `contexts/BrandContext.tsx`
- 新增: `hooks/useBrand.ts`
- 修改: `components/ThemeProvider.tsx`
- 修改: `components/Header.tsx`
- 修改: `components/Footer.tsx`
- 修改: `app/layout.tsx`
- 修改: `app/merchants/page.tsx`
