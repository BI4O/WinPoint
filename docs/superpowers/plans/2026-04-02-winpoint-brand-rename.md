# WinPoint 品牌重命名实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将项目品牌名称从 "Point & RWA" / "P&R" 重构为 "WinPoint"，同步更新 Logo 使用。

**Architecture:** 创建两个颜色版本的 Logo SVG，在 Header/Footer 等位置根据背景色使用对应版本，全局替换文字品牌名为 WinPoint。

**Tech Stack:** Next.js 16, SVG, Tailwind CSS v4

---

## 文件变更概览

| 操作 | 文件路径 | 改动说明 |
|------|----------|----------|
| 创建 | `public/images/winpoint_logo_white.svg` | 白色 Logo，用于红底背景 |
| 创建 | `public/images/winpoint_logo_red.svg` | 红色 Logo，用于白底背景 |
| 修改 | `components/Header.tsx` | 文字 Logo 替换为图片 |
| 修改 | `components/Footer.tsx` | 文字 Logo 替换为图片 |
| 修改 | `app/layout.tsx` | 页面 title 更新 |
| 修改 | 各页面/组件文件 | 文字替换 "Point & RWA" → "WinPoint" |

---

## Task 1: 创建 Logo SVG 文件

**Files:**
- Create: `public/images/winpoint_logo_white.svg`
- Create: `public/images/winpoint_logo_red.svg`

- [ ] **Step 1: 创建 public/images 目录**

```bash
mkdir -p public/images
```

- [ ] **Step 2: 创建白色 Logo (winpoint_logo_white.svg)**

从 `guide/winpoint_logo.svg` 复制，修改 fill 为 `#FFFFFF`：

```svg
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
   width="100%" viewBox="0 0 288 256" enable-background="new 0 0 288 256" xml:space="preserve">
<path fill="#FFFFFF" opacity="1.000000" stroke="none" d="
M92.242722,26.510944
...
"/>
<!-- 其他 path 的 fill="#000000" 改为 fill="#FFFFFF" -->
</svg>
```

- [ ] **Step 3: 创建红色 Logo (winpoint_logo_red.svg)**

从 `guide/winpoint_logo.svg` 复制，修改 fill 为 `#9B2335`：

```svg
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
   width="100%" viewBox="0 0 288 256" enable-background="new 0 0 288 256" xml:space="preserve">
<!-- 所有 fill="#000000" 改为 fill="#9B2335" -->
</svg>
```

- [ ] **Step 4: 提交**

```bash
git add public/images/
git commit -m "feat: add WinPoint logo SVG files (white and red versions)"
```

---

## Task 2: 更新 Header 组件

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: 更新桌面端 Logo**

将第 34-37 行：
```tsx
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-md-primary to-md-secondary-container text-md-on-primary font-bold text-lg shadow-md">
  P&R
</div>
<span className="font-bold text-lg">Point & RWA</span>
```

替换为：
```tsx
<Image
  src="/images/winpoint_logo_white.svg"
  alt="WinPoint"
  width={40}
  height={40}
  className="h-10 w-10"
/>
<span className="font-bold text-lg">WinPoint</span>
```

- [ ] **Step 2: 更新移动端侧边栏 Logo**

将第 144-147 行：
```tsx
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-md-primary to-md-secondary-container text-md-on-primary font-bold text-lg shadow-md">
  P&R
</div>
<span className="font-bold text-lg">Point & RWA</span>
```

替换为：
```tsx
<Image
  src="/images/winpoint_logo_white.svg"
  alt="WinPoint"
  width={40}
  height={40}
  className="h-10 w-10"
/>
<span className="font-bold text-lg">WinPoint</span>
```

- [ ] **Step 3: 添加 Image import（如没有）**

```tsx
import Image from 'next/image';
```

- [ ] **Step 4: 提交**

```bash
git add components/Header.tsx
git commit -m "refactor: update Header logo to WinPoint"
```

---

## Task 3: 更新 Footer 组件

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: 更新 Logo 区域**

将第 26-29 行：
```tsx
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary font-bold text-lg shadow-md">
  P&R
</div>
<span className="font-bold text-lg">Point & RWA</span>
```

替换为：
```tsx
<Image
  src="/images/winpoint_logo_red.svg"
  alt="WinPoint"
  width={40}
  height={40}
  className="h-10 w-10"
/>
<span className="font-bold text-lg text-primary">WinPoint</span>
```

- [ ] **Step 2: 更新版权信息**

将第 50-54 行：
```tsx
<p className="text-sm text-white/60">
  © 2026 Point & RWA. 保留所有权利.
</p>
```

替换为：
```tsx
<p className="text-sm text-white/60">
  © 2026 WinPoint. 保留所有权利.
</p>
```

- [ ] **Step 3: 添加 Image import（如没有）**

```tsx
import Image from 'next/image';
```

- [ ] **Step 4: 提交**

```bash
git add components/Footer.tsx
git commit -m "refactor: update Footer logo and copyright to WinPoint"
```

---

## Task 4: 更新布局标题

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: 更新页面 title**

将第 14 行：
```tsx
title: "P&R",
```

替换为：
```tsx
title: "WinPoint",
```

- [ ] **Step 2: 提交**

```bash
git add app/layout.tsx
git commit -m "refactor: update page title to WinPoint"
```

---

## Task 5: 全局替换文字品牌名

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/dashboard/page.tsx`
- Modify: `app/merchants/page.tsx`
- Modify: `app/stake/page.tsx`
- Modify: `app/market/page.tsx`
- Modify: `app/rewards/page.tsx`
- Modify: `lib/mock-data.ts`
- Modify: 其他包含 "Point & RWA" 或 "P&R" 的文件

- [ ] **Step 1: 全局搜索确认所有需要替换的位置**

使用 Grep 搜索 "Point & RWA" 和 "P&R"（排除 docs 目录）

- [ ] **Step 2: 替换 "Point & RWA" 为 "WinPoint"**

使用 Edit 工具的 replace_all 功能

- [ ] **Step 3: 替换 "P&R" 为 "WinPoint"**

使用 Edit 工具的 replace_all 功能

- [ ] **Step 4: 提交**

```bash
git add app/ lib/
git commit -m "refactor: replace all brand name references to WinPoint"
```

---

## Task 6: 更新 Favicon

**Files:**
- Modify: `app/favicon.ico` 或创建 `public/favicon.ico`

- [ ] **Step 1: 确认当前 favicon 位置**

检查 `app/favicon.ico` 或 `public/favicon.ico`

- [ ] **Step 2: 替换为 WinPoint 品牌图标**

将现有的 favicon 替换为 WinPoint 相关的图标（可以用 SVG 转 ICO，或直接使用纯色图标）

- [ ] **Step 3: 提交**

```bash
git add public/favicon.ico
git commit -m "refactor: update favicon to WinPoint brand"
```

---

## Task 7: 验证和测试

- [ ] **Step 1: 运行开发服务器**

```bash
pnpm run dev
```

- [ ] **Step 2: 手动检查清单**

- [ ] Header 显示 WinPoint Logo（白色） + 文字
- [ ] Footer 显示 WinPoint Logo（红色） + 文字
- [ ] 页面 title 显示 "WinPoint"
- [ ] 所有 "Point & RWA" / "P&R" 已替换为 "WinPoint"
- [ ] Favicon 显示 WinPoint 图标

- [ ] **Step 3: 运行 lint**

```bash
pnpm run lint
```

- [ ] **Step 4: 提交最终更改**

```bash
git add -A
git commit -m "feat: complete WinPoint brand rename"
```

---

## 实施检查清单

| 任务 | 状态 | 备注 |
|------|------|------|
| Task 1: 创建 Logo SVG | ⬜ |  |
| Task 2: 更新 Header | ⬜ |  |
| Task 3: 更新 Footer | ⬜ |  |
| Task 4: 更新布局标题 | ⬜ |  |
| Task 5: 全局替换文字 | ⬜ |  |
| Task 6: 更新 Favicon | ⬜ |  |
| Task 7: 验证测试 | ⬜ |  |
