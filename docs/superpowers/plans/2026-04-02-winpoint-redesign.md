# Winpoint 品牌风格重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 Next.js 项目从 Material Design 3 紫色主题重构为 Winpoint 品牌的红白黑灰克制奢华风格。

**Architecture:** 全面替换配色系统（CSS Variables）+ 改造核心布局组件（Header/Footer）+ 统一按钮卡片样式 + 适配页面文字颜色。

**Tech Stack:** Next.js 16, Tailwind CSS v4 (@theme), Framer Motion, Lucide React

---

## 文件变更概览

| 操作 | 文件路径 | 改动说明 |
|------|----------|----------|
| 修改 | `app/globals.css` | 更新所有 CSS 颜色变量 |
| 修改 | `components/Header.tsx` | 红色背景 + 白色文字 |
| 创建 | `components/Footer.tsx` | 新组件，红色背景 + 白色文字 |
| 修改 | `components/Button.tsx` | 三级按钮样式系统 |
| 修改 | `components/Card.tsx` | 极简阴影 + gray-2 边框 |
| 修改 | `app/layout.tsx` | 引入 Footer 组件 |
| 修改 | 各页面文件 | 文字颜色适配（text-md-on-background → text-gray-333） |

---

## Task 1: 更新全局 CSS 变量

**Files:**
- Modify: `app/globals.css:1-26`

- [ ] **Step 1: 备份并替换 @theme 颜色变量**

将现有的 MD3 紫色配色替换为 Winpoint 红白黑灰配色：

```css
@theme {
  /* Primary - 酒红色 */
  --color-primary: #9B2335;
  --color-primary-hover: #7A1618;
  --color-on-primary: #FFFFFF;

  /* Background */
  --color-background: #FFFFFF;
  --color-on-background: #333333;

  /* Gray scale */
  --color-gray-1: #666666;
  --color-gray-2: #E5E5E5;

  /* Surface (卡片/容器) */
  --color-surface: #FFFFFF;
  --color-surface-container: #FFFFFF;
  --color-surface-container-low: #F5F5F5;
  --color-surface-container-high: #FAFAFA;

  /* Status colors (保留) */
  --color-success: #10b981;
  --color-error: #ef4444;

  /* 兼容旧 MD3 token (映射到新色) */
  --color-md-primary: var(--color-primary);
  --color-md-on-primary: var(--color-on-primary);
  --color-md-on-background: var(--color-on-background);
  --color-md-surface: var(--color-surface);
  --color-md-surface-container: var(--color-surface-container);
}
```

- [ ] **Step 2: 更新 body 默认样式**

```css
body {
  font-family: system-ui, sans-serif;
  background-color: var(--color-background);
  color: var(--color-on-background);
}
```

- [ ] **Step 3: 添加按钮 Focus Ring 样式**

```css
/* 无障碍 Focus Ring */
.focus-ring:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

- [ ] **Step 4: 提交**

```bash
git add app/globals.css
git commit -m "refactor: update color tokens to Winpoint brand palette"
```

---

## Task 2: 重构 Header 组件

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: 更新 Header 背景和文字颜色**

主要改动（第 25 行起）：

```tsx
// 原来的
className="sticky top-0 z-50 w-full border-b border-md-border/20 bg-md-background/80 backdrop-blur-md"

// 改为
className="sticky top-0 z-50 w-full bg-primary text-white"
```

- [ ] **Step 2: 更新导航栏容器样式**

```tsx
// 原来的 (第 43 行)
className="relative flex items-center bg-md-surface-container p-1 rounded-2xl"

// 改为
className="relative flex items-center bg-white/10 p-1 rounded-2xl"
```

- [ ] **Step 3: 更新导航项激活状态颜色**

```tsx
// 原来的 (第 52-61 行)
isActive
  ? 'text-md-on-secondary-container'
  : 'text-md-on-surface-variant'

// 改为
isActive
  ? 'text-white bg-white/20'
  : 'text-white/80 hover:text-white hover:bg-white/10'
```

- [ ] **Step 4: 更新 Point 显示区域**

```tsx
// 原来的 (第 78-94 行)
className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-md-secondary-container text-md-on-secondary-container shadow-sm"

// 改为
className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/10 text-white shadow-sm"
```

- [ ] **Step 5: 更新连接钱包按钮**

```tsx
// 原来的 (第 95-103 行)
className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-md-primary text-md-on-primary shadow-sm hover:shadow-md"

// 改为 (保持 primary 红色但确保 hover 效果正确)
className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white text-primary font-semibold shadow-sm hover:bg-white/90"
```

- [ ] **Step 6: 更新汉堡菜单按钮**

```tsx
// 原来的 (第 106-113 行)
className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-md-surface-container text-md-on-surface"

// 改为
className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white"
```

- [ ] **Step 7: 更新移动端侧边栏**

```tsx
// 侧边栏背景 (第 138 行)
className="fixed top-0 right-0 z-50 h-full w-72 bg-md-surface md:hidden shadow-2xl"

// 改为
className="fixed top-0 right-0 z-50 h-full w-72 bg-white md:hidden shadow-2xl"

// 侧边栏内的文字颜色也需要更新为 gray-333
```

- [ ] **Step 8: 提交**

```bash
git add components/Header.tsx
git commit -m "refactor: apply red header with white text per brand guidelines"
```

---

## Task 3: 创建 Footer 组件

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: 创建 Footer 组件**

```tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const footerLinks = [
    { href: '/about', label: '关于我们' },
    { href: '/terms', label: '服务条款' },
    { href: '/privacy', label: '隐私政策' },
    { href: '/contact', label: '联系我们' },
  ];

  return (
    <footer className="w-full bg-primary text-white">
      <div className="container mx-auto px-4 py-8">
        {/* 主要内容区 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo 和版权 */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary font-bold text-lg shadow-md">
              P&R
            </div>
            <span className="font-bold text-lg">Point & RWA</span>
          </motion.div>

          {/* 链接 */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/80 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 分隔线 */}
        <div className="my-6 border-t border-white/20" />

        {/* 版权信息 */}
        <div className="text-center">
          <p className="text-sm text-white/60">
            © 2026 Point & RWA. 保留所有权利.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add components/Footer.tsx
git commit -m "feat: add Footer component with brand red background"
```

---

## Task 4: 重构 Button 组件

**Files:**
- Modify: `components/Button.tsx`

- [ ] **Step 1: 更新按钮变体样式**

将原有的 MD3 变体（filled, tonal, outlined, text）替换为新的三级按钮系统：

```tsx
const variants = {
  filled: `
    bg-primary text-white
    hover:bg-primary-hover
    focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
  `,
  secondary: `
    bg-gray-333 text-white
    hover:bg-gray-222
    focus-visible:outline-2 focus-visible:outline-gray-333 focus-visible:outline-offset-2
  `,
  outlined: `
    bg-white text-gray-333 border border-gray-2
    hover:bg-gray-100
    focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
  `,
};
```

- [ ] **Step 2: 移除圆角 full，改用 6px**

```tsx
// 原来的
className="inline-flex items-center justify-center rounded-full font-medium"

// 改为
className="inline-flex items-center justify-center rounded-md font-medium"
```

- [ ] **Step 3: 更新接口文档（注释）**

```tsx
/**
 * variant: 'filled' | 'secondary' | 'outlined'
 * - filled: 主按钮，红色背景，白色文字
 * - secondary: 次要按钮，深灰背景，白色文字
 * - outlined: 再次要按钮，白色背景，灰色边框
 */
```

- [ ] **Step 4: 提交**

```bash
git add components/Button.tsx
git commit -m "refactor: replace button variants with 3-level brand button system"
```

---

## Task 5: 重构 Card 组件

**Files:**
- Modify: `components/Card.tsx`

- [ ] **Step 1: 更新卡片样式**

```tsx
className={cn(
  'group',
  'rounded-xl bg-white border border-gray-2 p-6',  // 原来是 rounded-3xl bg-md-surface-container
  'shadow-none hover:shadow-sm',  // 原来是 shadow-sm hover:shadow-md
  'transition-all duration-300 ease-md',
  hover && 'hover:scale-[1.01] cursor-pointer',
  className
)}
```

- [ ] **Step 2: 移除 glow 相关逻辑（品牌不需要 glow 效果）**

```tsx
// 删除 glow prop 和相关逻辑
interface CardProps extends Omit<HTMLMotionProps<'div'>, 'whileHover'> {
  hover?: boolean;
  // glow?: 'primary' | 'tertiary' | 'none';  // 删除
  children: ReactNode;
}
```

- [ ] **Step 3: 简化类名**

```tsx
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <MotionDiv
        ref={ref}
        className={cn(
          'group',
          'rounded-xl bg-white border border-gray-2 p-6',
          'shadow-none hover:shadow-sm',
          'transition-all duration-300 ease-md',
          hover && 'hover:scale-[1.01] cursor-pointer',
          className
        )}
        whileHover={hover ? { y: -2 } : undefined}
        transition={{ type: 'tween' as const, duration: 0.3, ease: [0.2, 0, 0, 1] as const }}
        {...props}
      >
        {children}
      </MotionDiv>
    );
  }
);
```

- [ ] **Step 4: 提交**

```bash
git add components/Card.tsx
git commit -m "refactor: apply minimal card style with gray-2 border"
```

---

## Task 6: 更新布局引入 Footer

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: 导入 Footer 组件**

```tsx
import Footer from '@/components/Footer';
```

- [ ] **Step 2: 在 Header 后添加 Footer**

```tsx
<Header />
<main>{children}</main>
<Footer />  {/* 新增 */}
```

- [ ] **Step 3: 提交**

```bash
git add app/layout.tsx
git commit -m "feat: add Footer to app layout"
```

---

## Task 7: 更新页面文字颜色

**Files:**
- Modify: `app/page.tsx`, `app/dashboard/page.tsx`, `app/merchants/page.tsx`, `app/stake/page.tsx`, `app/market/page.tsx`, `app/rewards/page.tsx`

这是一个批量替换任务，主要将：
- `text-md-on-background` → `text-gray-333`
- `text-md-on-surface` → `text-gray-333`
- `text-md-on-surface-variant` → `text-gray-1` 或 `text-gray-666`

- [ ] **Step 1: 全局搜索并替换文字颜色类**

使用 replace_all 模式：

| 搜索 | 替换 |
|------|------|
| `text-md-on-background` | `text-gray-333` |
| `text-md-on-surface` | `text-gray-333` |
| `text-md-on-surface-variant` | `text-gray-1` |
| `text-md-on-primary` | `text-white` |
| `bg-md-surface-container` | `bg-white` |
| `bg-md-surface-container-low` | `bg-gray-50` |

- [ ] **Step 2: 提交**

```bash
git add app/page.tsx app/dashboard/page.tsx app/merchants/page.tsx app/stake/page.tsx app/market/page.tsx app/rewards/page.tsx
git commit -m "refactor: update text colors to gray-333 per brand guidelines"
```

---

## Task 8: 验证和测试

- [ ] **Step 1: 运行开发服务器**

```bash
pnpm run dev
```

- [ ] **Step 2: 手动检查清单**

- [ ] Header 显示红色背景 `#9B2335` + 白色文字
- [ ] Footer 显示红色背景 `#9B2335` + 白色文字
- [ ] 主按钮为红色背景 + 白色文字
- [ ] 次要按钮为深灰背景 + 白色文字
- [ ] Tertiary 按钮为白色背景 + 灰色边框
- [ ] 卡片有 1px gray-2 边框和极简阴影
- [ ] 正文文字为 `#333333`（不是纯黑）
- [ ] 次要文字为 `#666666`
- [ ] Focus Ring 在键盘导航时可见

- [ ] **Step 3: 运行 lint**

```bash
pnpm run lint
```

- [ ] **Step 4: 提交最终更改**

```bash
git add -A
git commit -m "feat: complete Winpoint brand style refactor"
```

---

## 实施检查清单

| 任务 | 状态 | 备注 |
|------|------|------|
| Task 1: globals.css | ⬜ |  |
| Task 2: Header | ⬜ |  |
| Task 3: Footer | ⬜ |  |
| Task 4: Button | ⬜ |  |
| Task 5: Card | ⬜ |  |
| Task 6: Layout | ⬜ |  |
| Task 7: 页面文字颜色 | ⬜ |  |
| Task 8: 验证测试 | ⬜ |  |
