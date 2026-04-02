# WinPoint 品牌重命名实施规范

## 设计背景

将现有项目的品牌名称从 "Point & RWA" / "P&R" 重构为 "WinPoint"，同步更新 Logo 使用。

**关键词**：WinPoint、品牌重命名、Logo 更新、全局替换

---

## Logo 系统

### Logo 文件

| 文件 | 颜色 | 用途 |
|------|------|------|
| `public/images/winpoint_logo_white.svg` | 白色 `#FFFFFF` | 红底背景（如 Header） |
| `public/images/winpoint_logo_red.svg` | 红色 `#9B2335` | 白底背景（如 落地页） |

### Logo 使用规则

- **红底背景**：使用白色 Logo
- **白底背景**：使用红色 Logo

---

## 文字替换清单

### 全局替换

| 原文本 | 替换为 |
|--------|--------|
| "Point & RWA" | "WinPoint" |
| "P&R" | "WinPoint" |

### 具体位置

| 文件 | 当前内容 | 更新后 |
|------|---------|--------|
| `components/Header.tsx` | Logo 文字 "P&R" + "Point & RWA" | Logo 图片 + "WinPoint" |
| `components/Footer.tsx` | "Point & RWA" | Logo 图片 + "WinPoint" |
| `app/layout.tsx` | 页面标题 | "WinPoint" |
| `app/page.tsx` | Hero 区域文字 | "WinPoint" |
| `lib/mock-data.ts` | 示例数据中的品牌名 | "WinPoint" |
| 其他组件 | 各种引用 | 根据上下文替换 |

---

## Favicon 更新

将 `public/favicon.ico` 或相关图标文件替换为 WinPoint 品牌图标。

---

## 实施步骤

1. 创建两个 Logo SVG 文件（白色版 + 红色版）
2. 更新 `components/Header.tsx` - 替换文字为 Logo 图片
3. 更新 `components/Footer.tsx` - 替换文字为 Logo 图片
4. 更新 `app/layout.tsx` - 页面标题
5. 更新 `app/page.tsx` - Hero 区域
6. 全局搜索替换 "Point & RWA" / "P&R" 为 "WinPoint"
7. 更新 Favicon

---

## 设计原则

1. **一致性**：所有品牌露出保持统一
2. **上下文适配**：根据背景色选择对应颜色 Logo
3. **渐进替换**：文字和 Logo 同步更新，避免混用
