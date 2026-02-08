# 商城购物体验升级 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将简化的"输入金额"消费模式升级为完整的电商购物体验，包括商品浏览、购物车、结算流程

**Architecture:** 采用 Next.js 16 App Router 架构，使用 Zustand 管理购物车状态，Framer Motion 实现动画效果。购物车采用侧边抽屉（Drawer）设计，避免页面跳转。所有数据使用 Mock 数据，不涉及真实后端。

**Tech Stack:** Next.js 16, React 19, TypeScript, Zustand, Tailwind CSS v4, Framer Motion, Lucide React

---

## Phase 1: 数据层基础 (Data Layer Foundation)

### Task 1.1: 扩展商品数据模型

**Files:**
- Modify: `lib/mock-data.ts`
- Read: `guide/PRD_V2.md:228-294` (数据结构设计)

**Step 1: 添加 Product 接口定义**

在 `lib/mock-data.ts` 文件顶部添加：

```typescript
export interface Product {
  id: string;
  merchantId: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  stock: number;
  category?: string;
}
```

**Step 2: 扩展 Merchant 接口**

```typescript
export interface Merchant {
  id: string;
  name: string;
  category: string;
  logo: string;
  description: string;
  creditRate: number;
  products: Product[];  // 新增字段
}
```

**Step 3: 创建星巴克商品数据**

```typescript
const starbucksProducts: Product[] = [
  { id: 'sb-1', merchantId: 'starbucks', name: '☕ 美式咖啡', price: 32, image: 'emoji:☕', stock: 999 },
