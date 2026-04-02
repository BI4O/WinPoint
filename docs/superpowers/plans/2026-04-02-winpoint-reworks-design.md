# WinPoint 转型：RWA双资产 → 积分商城 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有RWA双资产模型Demo转变为纯积分商城，删除/stake和/market，添加商户管理后台/merchant/manage

**Architecture:**
- 移除所有RWA相关代码（质押、市场交易）
- 商品有现金价和积分价（积分可抵扣部分现金）
- 商户可管理商品上下架、积分价、库存
- 用户兑换需填收货地址（线上发货）

**Tech Stack:** Next.js 16, Zustand, Tailwind CSS v4, Framer Motion, Lucide React

---

## File Structure

```
app/
├── stake/page.tsx          [DELETE]
├── market/page.tsx         [DELETE]
├── rewards/page.tsx        [MODIFY - becomes 积分商城]
├── dashboard/page.tsx       [MODIFY - remove RWA]
├── merchant/manage/page.tsx [CREATE -商户管理后台]

components/
├── StakeForm.tsx           [DELETE]
├── TradingForm.tsx          [DELETE]
├── OrderBook.tsx           [DELETE]
├── OrderHistoryTabs.tsx     [DELETE]
├── OrderHistoryTable.tsx    [DELETE]
├── RedemptionModal.tsx      [MODIFY - add address input]
├── RewardProductCard.tsx    [MODIFY - show stock]
├── [new] MerchantProductRow.tsx [CREATE - editable product row]
├── [new] MerchantOrderRow.tsx    [CREATE - order with ship button]

lib/
├── store.ts                [MODIFY - major restructure]
├── mock-data.ts            [MODIFY - add merchant products with pointPrice]

Header.tsx                  [MODIFY - remove market/stake nav, add merchant]
```

---

## Task 1: Update mock-data.ts - Add merchant products with point pricing

**Files:**
- Modify: `lib/mock-data.ts`

- [ ] **Step 1: Add MerchantProduct interface and update Product**

Add after line 11 (after Product interface):

```typescript
// 商户商品接口（含积分定价和上架状态）
export interface MerchantProduct {
  id: string;
  merchantId: string;
  name: string;
  cashPrice: number;        // 现金价格
  pointPrice: number;       // 积分价格（积分可抵扣部分）
  image: string;
  description?: string;
  stock: number;            // 库存数量
  isListed: boolean;        // 是否上架积分商城
  category?: string;
}
```

- [ ] **Step 2: Add MerchantOrder interface**

Add after MerchantProduct:

```typescript
// 商户订单接口
export interface MerchantOrder {
  id: string;
  userId: string;
  userAddress: string;
  productId: string;
  productName: string;
  merchantId: string;
  merchantName: string;
  cashPrice: number;
  pointPrice: number;
  quantity: number;
  timestamp: number;
  status: 'pending' | 'shipped';
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
  };
}
```

- [ ] **Step 3: Create mockMerchantProducts data**

Add after mockRewardProducts (around line 633). Use starbucks, nike, apple, baby, jewelry as merchantIds:

```typescript
// 商户商品数据（积分商城用）
export const mockMerchantProducts: MerchantProduct[] = [
  // 星巴克
  { id: 'mp-sb-1', merchantId: 'starbucks', name: '☕ 美式咖啡', cashPrice: 22, pointPrice: 100, image: 'emoji:☕', stock: 100, isListed: true, category: '餐饮' },
  { id: 'mp-sb-2', merchantId: 'starbucks', name: '☕ 拿铁咖啡', cashPrice: 28, pointPrice: 100, image: 'emoji:☕', stock: 100, isListed: true, category: '餐饮' },
  { id: 'mp-sb-3', merchantId: 'starbucks', name: '☕ 卡布奇诺', cashPrice: 28, pointPrice: 100, image: 'emoji:☕', stock: 100, isListed: false, category: '餐饮' },
  // Nike
  { id: 'mp-nk-1', merchantId: 'nike', name: '👟 Air Max 运动鞋', cashPrice: 799, pointPrice: 1000, image: 'emoji:👟', stock: 50, isListed: true, category: '运动' },
  { id: 'mp-nk-2', merchantId: 'nike', name: '👕 Dri-FIT 运动T恤', cashPrice: 199, pointPrice: 300, image: 'emoji:👕', stock: 80, isListed: true, category: '运动' },
  { id: 'mp-nk-3', merchantId: 'nike', name: '🩳 运动短裤', cashPrice: 299, pointPrice: 400, image: 'emoji:🩳', stock: 60, isListed: false, category: '运动' },
  // Apple
  { id: 'mp-ap-1', merchantId: 'apple', name: '🎧 AirPods Pro', cashPrice: 1499, pointPrice: 2000, image: 'emoji:🎧', stock: 30, isListed: true, category: '电子产品' },
  { id: 'mp-ap-2', merchantId: 'apple', name: '⌚ Apple Watch SE', cashPrice: 1699, pointPrice: 2000, image: 'emoji:⌚', stock: 20, isListed: true, category: '电子产品' },
  // 母婴
  { id: 'mp-bb-1', merchantId: 'baby', name: 'Ealing 4合1滑梯秋千套装', cashPrice: 669, pointPrice: 800, image: '/products/baby/bb-1.jpeg', stock: 10, isListed: true, category: '母婴' },
  { id: 'mp-bb-2', merchantId: 'baby', name: 'Ealing 儿童沙发滑梯', cashPrice: 429, pointPrice: 500, image: '/products/baby/bb-2.jpeg', stock: 15, isListed: true, category: '母婴' },
  // 珠宝
  { id: 'mp-jw-1', merchantId: 'jewelry', name: '18K白金橄榄石戒指', cashPrice: 3100, pointPrice: 5000, image: '/products/jewelry/01-olivine-ring.png', stock: 5, isListed: true, category: '奢侈品' },
  { id: 'mp-jw-2', merchantId: 'jewelry', name: '18K白红金粉红宝石戒指', cashPrice: 1400, pointPrice: 3000, image: '/products/jewelry/02-ruby-ring.png', stock: 3, isListed: false, category: '奢侈品' },
];
```

- [ ] **Step 4: Create mockMerchantOrders data**

Add after mockMerchantProducts:

```typescript
// 商户订单数据
export const mockMerchantOrders: MerchantOrder[] = [
  {
    id: 'mo-1',
    userId: '0x1234...5678',
    userAddress: '0x1234...5678',
    productId: 'mp-sb-1',
    productName: '☕ 美式咖啡',
    merchantId: 'starbucks',
    merchantName: '星巴克咖啡',
    cashPrice: 22,
    pointPrice: 100,
    quantity: 1,
    timestamp: Date.now() - 86400000,
    status: 'pending',
    shippingAddress: { name: '张三', phone: '13800138000', address: '北京市朝阳区某某路123号' }
  },
  {
    id: 'mo-2',
    userId: '0x1234...5678',
    userAddress: '0x1234...5678',
    productId: 'mp-nk-1',
    productName: '👟 Air Max 运动鞋',
    merchantId: 'nike',
    merchantName: 'Nike 运动',
    cashPrice: 799,
    pointPrice: 1000,
    quantity: 1,
    timestamp: Date.now() - 172800000,
    status: 'shipped',
    shippingAddress: { name: '李四', phone: '13900139000', address: '上海市浦东新区某某大道456号' }
  }
];
```

- [ ] **Step 5: Commit**

```bash
git add lib/mock-data.ts
git commit -m "feat: add merchant product and order types with mock data"
```

---

## Task 2: Restructure store.ts - Remove RWA, add merchant management

**Files:**
- Modify: `lib/store.ts`

- [ ] **Step 1: Simplify imports**

Change imports to:

```typescript
import { create } from 'zustand';
import {
  mockUserInitial,
  mockOrdersInitial,
  mockActivitiesInitial,
  mockMerchantProducts,
  mockMerchantOrders,
  type Order,
  type Activity,
  type MerchantProduct,
  type MerchantOrder
} from './mock-data';
```

- [ ] **Step 2: Simplify UserState interface**

Replace UserState (lines 17-22):

```typescript
interface UserState {
  address: string;
  point: number;
  earnings: number;
}
```

- [ ] **Step 3: Simplify AppState interface**

Replace AppState (lines 24-70):

```typescript
interface AppState {
  user: UserState;
  orders: Order[];
  activities: Activity[];

  // 商户商品管理
  merchantProducts: MerchantProduct[];
  merchantOrders: MerchantOrder[];

  // 原有 actions
  consumeAtMerchant: (merchantId: string, merchantName: string, amount: number) => void;

  // 商户商品 actions
  updateMerchantProduct: (productId: string, updates: Partial<MerchantProduct>) => void;
  getMerchantProducts: (merchantId: string) => MerchantProduct[];

  // 商户订单 actions
  shipOrder: (orderId: string) => void;
  getMerchantOrders: (merchantId: string) => MerchantOrder[];

  // 用户兑换 actions
  redeemProduct: (
    productId: string,
    productName: string,
    merchantId: string,
    merchantName: string,
    cashPrice: number,
    pointPrice: number,
    shippingAddress: { name: string; phone: string; address: string }
  ) => boolean;
}
```

- [ ] **Step 4: Rewrite store implementation**

Replace the entire store implementation (lines 72-454) with:

```typescript
export const useStore = create<AppState>((set, get) => ({
  user: {
    address: mockUserInitial.address,
    point: mockUserInitial.point,
    earnings: mockUserInitial.earnings
  },
  orders: mockOrdersInitial,
  activities: mockActivitiesInitial,
  merchantProducts: mockMerchantProducts,
  merchantOrders: mockMerchantOrders,

  consumeAtMerchant: (merchantId, merchantName, amount) => {
    const pointEarned = amount / 10;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      timestamp: Date.now(),
      merchantId,
      merchantName,
      items: [{ productId: 'manual', productName: '手动输入消费', price: amount, quantity: 1 }],
      totalAmount: amount,
      pointEarned,
      status: 'completed'
    };

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      type: 'point_earned',
      amount: pointEarned,
      merchant: merchantName,
      timestamp: Date.now()
    };

    set(state => ({
      user: {
        ...state.user,
        point: state.user.point + pointEarned
      },
      orders: [newOrder, ...state.orders],
      activities: [newActivity, ...state.activities]
    }));
  },

  // 商户商品 actions
  updateMerchantProduct: (productId, updates) => {
    set(state => ({
      merchantProducts: state.merchantProducts.map(p =>
        p.id === productId ? { ...p, ...updates } : p
      )
    }));
  },

  getMerchantProducts: (merchantId) => {
    return get().merchantProducts.filter(p => p.merchantId === merchantId);
  },

  // 商户订单 actions
  shipOrder: (orderId) => {
    set(state => ({
      merchantOrders: state.merchantOrders.map(o =>
        o.id === orderId ? { ...o, status: 'shipped' } : o
      )
    }));
  },

  getMerchantOrders: (merchantId) => {
    return get().merchantOrders.filter(o => o.merchantId === merchantId);
  },

  // 用户兑换
  redeemProduct: (productId, productName, merchantId, merchantName, cashPrice, pointPrice, shippingAddress) => {
    const { user, merchantProducts } = get();

    // 检查积分余额
    if (user.point < pointPrice) {
      return false;
    }

    const product = merchantProducts.find(p => p.id === productId);
    if (!product || product.stock < 1) {
      return false;
    }

    // 扣积分
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      type: 'point_redeemed',
      amount: pointPrice,
      timestamp: Date.now(),
      rewardProductName: productName,
      pointSpent: pointPrice
    };

    // 创建订单
    const newOrder: MerchantOrder = {
      id: `mo-${Date.now()}`,
      userId: user.address,
      userAddress: user.address,
      productId,
      productName,
      merchantId,
      merchantName,
      cashPrice,
      pointPrice,
      quantity: 1,
      timestamp: Date.now(),
      status: 'pending',
      shippingAddress
    };

    set(state => ({
      user: {
        ...state.user,
        point: state.user.point - pointPrice
      },
      merchantProducts: state.merchantProducts.map(p =>
        p.id === productId ? { ...p, stock: p.stock - 1 } : p
      ),
      merchantOrders: [newOrder, ...state.merchantOrders],
      activities: [newActivity, ...state.activities]
    }));

    return true;
  }
}));
```

- [ ] **Step 5: Commit**

```bash
git add lib/store.ts
git commit -m "feat: restructure store - remove RWA, add merchant management"
```

---

## Task 3: Delete RWA-related pages and components

**Files:**
- Delete: `app/stake/page.tsx`
- Delete: `app/market/page.tsx`
- Delete: `components/StakeForm.tsx`
- Delete: `components/TradingForm.tsx`
- Delete: `components/OrderBook.tsx`
- Delete: `components/OrderHistoryTabs.tsx`
- Delete: `components/OrderHistoryTable.tsx`
- Delete: `components/KLineChart.tsx`
- Delete: `components/OrderBookEntry.tsx`
- Delete: `components/PriceSelector.tsx`
- Delete: `components/BalanceDisplay.tsx`
- Delete: `components/SwapCard.tsx`
- Delete: `components/ConfirmDialog.tsx`
- Delete: `components/SuccessNotification.tsx`

- [ ] **Step 1: Delete files**

```bash
rm app/stake/page.tsx
rm app/market/page.tsx
rm components/StakeForm.tsx
rm components/TradingForm.tsx
rm components/OrderBook.tsx
rm components/OrderHistoryTabs.tsx
rm components/OrderHistoryTable.tsx
rm components/KLineChart.tsx
rm components/OrderBookEntry.tsx
rm components/PriceSelector.tsx
rm components/BalanceDisplay.tsx
rm components/SwapCard.tsx
rm components/ConfirmDialog.tsx
rm components/SuccessNotification.tsx
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: remove RWA-related pages and components"
```

---

## Task 4: Update Header.tsx - Remove RWA nav items

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: Update navItems array**

Change navItems (around line 16-22) to:

```typescript
const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/merchants', label: '商家', icon: Store },
  { href: '/rewards', label: '积分商城', icon: Gift },
  { href: '/dashboard', label: '资产', icon: LayoutDashboard },
  { href: '/merchant/manage', label: '商户管理', icon: Store },
];
```

Note: Keep the TrendingUp icon import if used elsewhere, or remove it if not.

- [ ] **Step 2: Update header right side point display**

Replace the point display (around line 82-99) - keep it simpler since we only have Point now:

```typescript
<motion.div
  className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/10 text-white shadow-sm"
  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
  transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
>
  <span className="text-sm font-semibold">Point</span>
  <div className="w-px h-4 bg-white/20" />
  <motion.span
    className="text-base font-bold tabular-nums"
    key={user.point}
    initial={{ scale: 1.3, opacity: 0.5 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', duration: 0.4, stiffness: 300 }}
  >
    {user.point.toFixed(1)}
  </motion.span>
</motion.div>
```

- [ ] **Step 3: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: update header nav - remove market/stake, add merchant manage"
```

---

## Task 5: Update dashboard page - Remove RWA references

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Update imports**

```typescript
import { Coins, TrendingUp, ArrowUpCircle, ShoppingBag, Gift } from 'lucide-react';
```

Remove `Share2` import.

- [ ] **Step 2: Remove RWA card**

Remove the second AssetCard (lines 51-63) - the one showing RWA.

- [ ] **Step 3: Update quick actions**

Replace the quick actions section (around line 79-118) with:

```typescript
{/* Quick Actions */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
  className="mb-10"
>
  <h2 className="text-2xl font-bold text-gray-333 mb-6">
    快速操作
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Button
      variant="filled"
      size="lg"
      onClick={() => router.push('/rewards')}
      className="flex items-center justify-center gap-2"
    >
      <Gift className="h-5 w-5" />
      积分商城
    </Button>
    <Button
      variant="filled"
      size="lg"
      onClick={() => router.push('/merchants')}
      className="flex items-center justify-center gap-2"
    >
      <ShoppingBag className="h-5 w-5" />
      浏览商家
    </Button>
  </div>
</motion.div>
```

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: simplify dashboard - remove RWA, update quick actions"
```

---

## Task 6: Update app/page.tsx (homepage) - Remove RWA references

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update steps array**

Replace steps (lines 12-28) with:

```typescript
const steps = [
  {
    icon: <Wallet className="w-8 h-8" />,
    title: '消费获得积分',
    description: '在合作商家消费，每10元获得1个积分，积累消费价值'
  },
  {
    icon: <Coins className="w-8 h-8" />,
    title: '积分兑换商品',
    description: '用积分抵扣部分价格，换购心仪商品，超值优惠'
  }
];
```

- [ ] **Step 2: Update hero text**

Replace hero title (line 77):
```typescript
消费即积累，积分兑换超值好物
```

Replace hero description (lines 84-86):
```typescript
通过积分商城，让每一次消费都能兑换心仪商品
```

- [ ] **Step 3: Update CTA section**

Replace CTA text (lines 265-270):
```typescript
<h2 className="text-3xl md:text-4xl font-bold text-gray-333 mb-6">
  准备好开始了吗？
</h2>
<p className="text-lg text-gray-1 mb-8">
  立即体验积分商城，消费同时积累积分，兑换超值好物
</p>
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: update homepage - remove RWA references"
```

---

## Task 7: Update app/globals.css - Remove RWA metrics

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Update metadata description in layout.tsx**

```typescript
export const metadata: Metadata = {
  title: "WinPoint",
  description: "消费即积累，积分兑换超值好物",
};
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: update metadata description"
```

---

## Task 8: Update RedemptionModal - Add shipping address

**Files:**
- Modify: `components/RedemptionModal.tsx`

- [ ] **Step 1: Read current file to understand structure]

```bash
cat components/RedemptionModal.tsx
```

- [ ] **Step 2: Add address form fields**

Add state for shipping address:
```typescript
const [shippingAddress, setShippingAddress] = useState({
  name: '',
  phone: '',
  address: ''
});
```

- [ ] **Step 3: Add address form UI**

Add after the point cost display, before the action buttons:
```typescript
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-333 mb-2">
    收货人姓名
  </label>
  <input
    type="text"
    value={shippingAddress.name}
    onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
    placeholder="请输入收货人姓名"
  />
</div>
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-333 mb-2">
    联系电话
  </label>
  <input
    type="tel"
    value={shippingAddress.phone}
    onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
    placeholder="请输入联系电话"
  />
</div>
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-333 mb-2">
    收货地址
  </label>
  <input
    type="text"
    value={shippingAddress.address}
    onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
    placeholder="请输入详细收货地址"
  />
</div>
```

- [ ] **Step 4: Validate address before confirming**

In handleConfirm, check all address fields are filled before calling redeemProduct with address.

- [ ] **Step 5: Commit**

```bash
git add components/RedemptionModal.tsx
git commit -m "feat: add shipping address fields to redemption modal"
```

---

## Task 9: Create MerchantProductRow component

**Files:**
- Create: `components/MerchantProductRow.tsx`

- [ ] **Step 1: Create component**

```typescript
'use client';

import { useState } from 'react';
import { MerchantProduct } from '@/lib/mock-data';
import { useStore } from '@/lib/store';
import { Switch } from '@mui/material';
import { Edit2, Save, X } from 'lucide-react';

interface MerchantProductRowProps {
  product: MerchantProduct;
}

export default function MerchantProductRow({ product }: MerchantProductRowProps) {
  const updateMerchantProduct = useStore(state => state.updateMerchantProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    pointPrice: product.pointPrice,
    stock: product.stock,
    isListed: product.isListed
  });

  const handleSave = () => {
    updateMerchantProduct(product.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      pointPrice: product.pointPrice,
      stock: product.stock,
      isListed: product.isListed
    });
    setIsEditing(false);
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{product.image}</span>
          <div>
            <p className="font-medium text-gray-333">{product.name}</p>
            <p className="text-xs text-gray-500">{product.category}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        ¥{product.cashPrice}
      </td>
      <td className="py-3 px-4">
        {isEditing ? (
          <input
            type="number"
            value={editData.pointPrice}
            onChange={(e) => setEditData(prev => ({ ...prev, pointPrice: Number(e.target.value) }))}
            className="w-24 px-2 py-1 border border-gray-200 rounded-lg text-center"
          />
        ) : (
          <span className="text-md-primary font-medium">{product.pointPrice}</span>
        )}
      </td>
      <td className="py-3 px-4">
        {isEditing ? (
          <input
            type="number"
            value={editData.stock}
            onChange={(e) => setEditData(prev => ({ ...prev, stock: Number(e.target.value) }))}
            className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-center"
          />
        ) : (
          <span className={product.stock < 10 ? 'text-red-500' : 'text-gray-333'}>
            {product.stock}
          </span>
        )}
      </td>
      <td className="py-3 px-4">
        <Switch
          checked={editData.isListed}
          onChange={(e) => setEditData(prev => ({ ...prev, isListed: e.target.checked }))}
          disabled={!isEditing}
          size="small"
        />
      </td>
      <td className="py-3 px-4">
        {isEditing ? (
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={handleSave}
              className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/MerchantProductRow.tsx
git commit -m "feat: add MerchantProductRow component"
```

---

## Task 10: Create MerchantOrderRow component

**Files:**
- Create: `components/MerchantOrderRow.tsx`

- [ ] **Step 1: Create component**

```typescript
'use client';

import { MerchantOrder } from '@/lib/mock-data';
import { useStore } from '@/lib/store';
import { Package, Truck } from 'lucide-react';

interface MerchantOrderRowProps {
  order: MerchantOrder;
}

export default function MerchantOrderRow({ order }: MerchantOrderRowProps) {
  const shipOrder = useStore(state => state.shipOrder);

  const handleShip = () => {
    shipOrder(order.id);
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <p className="font-medium text-gray-333 text-sm">{order.id}</p>
        <p className="text-xs text-gray-500">
          {new Date(order.timestamp).toLocaleString('zh-CN')}
        </p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-gray-333">{order.productName}</p>
        <p className="text-xs text-gray-500">x{order.quantity}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm">
          <span className="text-gray-500 line-through">¥{order.cashPrice + order.pointPrice}</span>
        </p>
        <p className="text-sm text-gray-333">
          ¥{order.cashPrice} + {order.pointPrice}积分
        </p>
      </td>
      <td className="py-3 px-4">
        <div className="text-sm">
          <p className="text-gray-333">{order.shippingAddress.name}</p>
          <p className="text-gray-500">{order.shippingAddress.phone}</p>
          <p className="text-gray-400 text-xs">{order.shippingAddress.address}</p>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          order.status === 'shipped'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {order.status === 'shipped' ? '已发货' : '待发货'}
        </span>
      </td>
      <td className="py-3 px-4">
        {order.status === 'pending' ? (
          <button
            onClick={handleShip}
            className="flex items-center gap-1 px-3 py-1.5 bg-md-primary text-white rounded-lg hover:bg-md-primary/90 text-sm"
          >
            <Truck className="w-4 h-4" />
            发货
          </button>
        ) : (
          <span className="flex items-center gap-1 text-gray-400 text-sm">
            <Package className="w-4 h-4" />
            已处理
          </span>
        )}
      </td>
    </tr>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/MerchantOrderRow.tsx
git commit -m "feat: add MerchantOrderRow component"
```

---

## Task 11: Create /merchant/manage page

**Files:**
- Create: `app/merchant/manage/page.tsx`

- [ ] **Step 1: Create directory and page**

```bash
mkdir -p app/merchant/manage
```

- [ ] **Step 2: Create merchant manage page**

```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { mockMerchants } from '@/lib/mock-data';
import MerchantProductRow from '@/components/MerchantProductRow';
import MerchantOrderRow from '@/components/MerchantOrderRow';
import AtmosphericBackground from '@/components/AtmosphericBackground';

export default function MerchantManagePage() {
  const merchantProducts = useStore(state => state.merchantProducts);
  const merchantOrders = useStore(state => state.merchantOrders);
  const [selectedMerchantId, setSelectedMerchantId] = useState('starbucks');
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  const currentMerchant = mockMerchants.find(m => m.id === selectedMerchantId);
  const merchantProductsList = merchantProducts.filter(p => p.merchantId === selectedMerchantId);
  const merchantOrdersList = merchantOrders.filter(o => o.merchantId === selectedMerchantId);

  return (
    <AtmosphericBackground className="min-h-screen bg-md-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-333 mb-2">
            商户管理
          </h1>
          <p className="text-gray-1">
            管理您的商品和订单
          </p>
        </motion.div>

        {/* Merchant Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium text-gray-333 mb-2">
            当前商户
          </label>
          <select
            value={selectedMerchantId}
            onChange={(e) => setSelectedMerchantId(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-md-primary focus:outline-none w-64"
          >
            {mockMerchants.map(merchant => (
              <option key={merchant.id} value={merchant.id}>
                {merchant.logo} {merchant.name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'products'
                  ? 'text-md-primary border-b-2 border-md-primary'
                  : 'text-gray-500 hover:text-gray-333'
              }`}
            >
              商品管理 ({merchantProductsList.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'text-md-primary border-b-2 border-md-primary'
                  : 'text-gray-500 hover:text-gray-333'
              }`}
            >
              订单管理 ({merchantOrdersList.length})
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === 'products' ? (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">商品</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">现金价</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">积分价</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">库存</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">上架</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {merchantProductsList.map(product => (
                    <MerchantProductRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">订单信息</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">商品</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">价格</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">收货信息</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {merchantOrdersList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">
                        暂无订单
                      </td>
                    </tr>
                  ) : (
                    merchantOrdersList.map(order => (
                      <MerchantOrderRow key={order.id} order={order} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AtmosphericBackground>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/merchant/manage/page.tsx
git commit -m "feat: add merchant management page"
```

---

## Task 12: Update rewards page - Integrate with merchant products

**Files:**
- Modify: `app/rewards/page.tsx`

- [ ] **Step 1: Update to use merchantProducts instead of mockRewardProducts**

Replace imports and logic:

```typescript
import { useStore } from '@/lib/store';
import { type MerchantProduct } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AtmosphericBackground from '@/components/AtmosphericBackground';

// Inside component:
const merchantProducts = useStore(state => state.merchantProducts);
const user = useStore(state => state.user);
const redeemProduct = useStore(state => state.redeemProduct);

// Filter only listed products
const listedProducts = merchantProducts.filter(p => p.isListed);
const categories = ['全部', ...Array.from(new Set(listedProducts.map(p => p.category)))];
const filteredProducts = activeCategory === '全部'
  ? listedProducts
  : listedProducts.filter(p => p.category === activeCategory);

// Update handleRedeem and handleConfirmRedeem to pass all required fields including cashPrice
```

- [ ] **Step 2: Update page title**

Change h1 to "积分商城" and update description.

- [ ] **Step 3: Commit**

```bash
git add app/rewards/page.tsx
git commit -m "feat: integrate rewards page with merchant products"
```

---

## Task 13: Update RewardProductCard - Show stock and cash+point price

**Files:**
- Modify: `components/RewardProductCard.tsx`

- [ ] **Step 1: Update to use MerchantProduct type and show both prices**

- [ ] **Step 2: Commit**

```bash
git add components/RewardProductCard.tsx
git commit -m "feat: update reward product card for new data model"
```

---

## Final Verification

- [ ] Run `pnpm run lint` to check for errors
- [ ] Run `pnpm run build` to verify production build
- [ ] Navigate to http://localhost:3000 - Homepage should show 2-step flow (no RWA)
- [ ] Navigate to http://localhost:3000/rewards - Should show 积分商城 with products
- [ ] Navigate to http://localhost:3000/merchant/manage - Should show merchant selector and product/order tabs
- [ ] Switch merchant in dropdown - Products should update to show selected merchant's items
- [ ] Toggle product isListed switch - Product should update
- [ ] Edit product pointPrice - Value should persist
- [ ] Try redemption flow on rewards page - Modal should show address fields
- [ ] Complete redemption - Order should appear in merchant orders tab with pending status
- [ ] Click ship button in orders - Status should change to shipped
- [ ] Verify /stake and /market return 404

---

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
