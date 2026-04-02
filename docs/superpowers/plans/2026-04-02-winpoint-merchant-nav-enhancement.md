# WinPoint 商户导航增强 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 扩展商户模式导航：积分商城（只看自家商品）、商家（跳转自家店铺）、商户管理内新增数据概览 tab

**Architecture:**
- Header 导航在商户模式下显示三个 nav items：商户管理、积分商城、商家
- 积分商城页面在商户模式下隐藏分类筛选、只显示自家商品、隐藏兑换功能改为预览
- 商户管理页面新增"数据概览"tab，展示销售数据、订单量、库存预警

**Tech Stack:** Next.js 16, Zustand, Tailwind CSS v4, Framer Motion, Lucide React

---

## File Structure

```
components/
├── Header.tsx              [MODIFY - 扩展商户模式导航]
├── MerchantStatsCard.tsx   [CREATE - 数据概览卡片组件]

app/
├── rewards/page.tsx        [MODIFY - 商户模式过滤和预览]
├── merchant/manage/page.tsx [MODIFY - 新增数据概览 tab]
```

---

## Task 1: Update Header.tsx - Add merchant mode nav items

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: Read Header.tsx to understand current structure**

- [ ] **Step 2: Update merchant mode navItems**

Change from:
```typescript
  // Determine nav items based on identity mode
  const navItems = identityMode === 'merchant'
    ? [
        { href: '/merchant/manage', label: '商户管理', icon: Store },
      ]
    : [
        { href: '/', label: '首页', icon: Home },
        { href: '/merchants', label: '商家', icon: Store },
        { href: '/rewards', label: '积分商城', icon: Gift },
        { href: '/dashboard', label: '资产', icon: LayoutDashboard },
      ];
```

To:
```typescript
  // Determine nav items based on identity mode
  const navItems = identityMode === 'merchant'
    ? [
        { href: '/merchant/manage', label: '商户管理', icon: Store },
        { href: '/rewards', label: '积分商城', icon: Gift },
        { href: '/merchants', label: '商家', icon: Store },
      ]
    : [
        { href: '/', label: '首页', icon: Home },
        { href: '/merchants', label: '商家', icon: Store },
        { href: '/rewards', label: '积分商城', icon: Gift },
        { href: '/dashboard', label: '资产', icon: LayoutDashboard },
      ];
```

- [ ] **Step 3: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: expand merchant mode header navigation"
```

---

## Task 2: Update rewards page for merchant mode

**Files:**
- Modify: `app/rewards/page.tsx`

- [ ] **Step 1: Read rewards/page.tsx to understand current structure**

- [ ] **Step 2: Import useStore identity state and currentMerchantId**

Add to imports:
```typescript
const identityMode = useStore(state => state.identityMode);
const currentMerchantId = useStore(state => state.currentMerchantId);
```

- [ ] **Step 3: Add merchant mode filtering**

After the existing filteredProducts logic (around line 29-31), add:

```typescript
  // 商户模式下只显示自家商品
  const isMerchantMode = identityMode === 'merchant' && currentMerchantId;
  const merchantFilteredProducts = isMerchantMode
    ? filteredProducts.filter(p => p.merchantId === currentMerchantId)
    : filteredProducts;
```

- [ ] **Step 4: Update products rendering to use merchantFilteredProducts**

Replace `filteredProducts` with `merchantFilteredProducts` in the rendering section (around line 114).

- [ ] **Step 5: Hide category filter in merchant mode**

Find the CategoryFilter section (around line 100-105) and wrap it:

```typescript
        {/* Category Filter - 仅用户模式显示 */}
        {!isMerchantMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, type: 'tween', duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="mb-8"
          >
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </motion.div>
        )}
```

- [ ] **Step 6: Update empty state message for merchant mode**

Update the empty state (around line 143-144):
```typescript
              <p className="text-gray-1">
                {isMerchantMode ? '暂无上架商品' : '该分类暂无商品'}
              </p>
```

- [ ] **Step 7: Commit**

```bash
git add app/rewards/page.tsx
git commit -m "feat: rewards page merchant mode filtering"
```

---

## Task 3: Create MerchantStatsCard component

**Files:**
- Create: `components/MerchantStatsCard.tsx`

- [ ] **Step 1: Create MerchantStatsCard component**

```typescript
'use client';

import { motion } from 'framer-motion';
import Card from './Card';

interface MerchantStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function MerchantStatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue
}: MerchantStatsCardProps) {
  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-333">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
            }`}>
              <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/MerchantStatsCard.tsx
git commit -m "feat: add MerchantStatsCard component"
```

---

## Task 4: Add data overview tab to merchant manage page

**Files:**
- Modify: `app/merchant/manage/page.tsx`

- [ ] **Step 1: Read merchant/manage/page.tsx**

- [ ] **Step 2: Update activeTab type to include 'stats'**

Change:
```typescript
const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
```
To:
```typescript
const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stats'>('products');
```

- [ ] **Step 3: Import MerchantStatsCard**

Add to imports:
```typescript
import MerchantStatsCard from '@/components/MerchantStatsCard';
import { Package, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';
```

- [ ] **Step 4: Add data computation for stats**

After line 26 (merchantOrdersList), add:

```typescript
  // 计算商户统计数据
  const totalProducts = merchantProductsList.length;
  const listedProducts = merchantProductsList.filter(p => p.isListed).length;
  const lowStockProducts = merchantProductsList.filter(p => p.stock > 0 && p.stock < 10).length;
  const outOfStockProducts = merchantProductsList.filter(p => p.stock === 0).length;
  const totalOrders = merchantOrdersList.length;
  const pendingOrders = merchantOrdersList.filter(o => o.status === 'pending').length;
  const shippedOrders = merchantOrdersList.filter(o => o.status === 'shipped').length;
  const totalSales = merchantOrdersList.reduce((sum, o) => sum + o.cashPrice * o.quantity, 0);
  const totalPointsEarned = merchantOrdersList.reduce((sum, o) => sum + o.pointPrice * o.quantity, 0);
```

- [ ] **Step 5: Add stats tab button**

Update the tabs section (around line 77-98) to add a third tab:

```typescript
            <button
              onClick={() => setActiveTab('stats')}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-md-primary border-b-2 border-md-primary'
                  : 'text-gray-500 hover:text-gray-333'
              }`}
            >
              数据概览
            </button>
```

- [ ] **Step 6: Add stats content**

Find the content section (after line 166) and add before the closing `}`:

```typescript
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* 概览卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MerchantStatsCard
                  title="商品总数"
                  value={totalProducts}
                  subtitle={`${listedProducts} 上架中`}
                  icon="📦"
                />
                <MerchantStatsCard
                  title="总订单数"
                  value={totalOrders}
                  subtitle={`${pendingOrders} 待处理`}
                  icon="🛒"
                />
                <MerchantStatsCard
                  title="销售额"
                  value={`¥${totalSales.toFixed(2)}`}
                  subtitle={`积分收入: ${totalPointsEarned}`}
                  icon="💰"
                />
                <MerchantStatsCard
                  title="库存预警"
                  value={lowStockProducts + outOfStockProducts}
                  subtitle={`${outOfStockProducts} 已售罄`}
                  icon="⚠️"
                />
              </div>

              {/* 低库存商品列表 */}
              {lowStockProducts > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-333 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    库存不足
                  </h3>
                  <div className="space-y-2">
                    {merchantProductsList
                      .filter(p => p.stock > 0 && p.stock < 10)
                      .map(product => (
                        <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{product.image.startsWith('emoji:') ? product.image.replace('emoji:', '') : product.image}</span>
                            <span className="font-medium text-gray-333">{product.name}</span>
                          </div>
                          <span className="text-orange-500 font-medium">剩余 {product.stock} 件</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 售罄商品列表 */}
              {outOfStockProducts > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-333 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    已售罄
                  </h3>
                  <div className="space-y-2">
                    {merchantProductsList
                      .filter(p => p.stock === 0)
                      .map(product => (
                        <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{product.image.startsWith('emoji:') ? product.image.replace('emoji:', '') : product.image}</span>
                            <span className="font-medium text-gray-333">{product.name}</span>
                          </div>
                          <span className="text-red-500 font-medium">售罄</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
```

- [ ] **Step 7: Commit**

```bash
git add app/merchant/manage/page.tsx
git commit -m "feat: add data overview tab to merchant manage"
```

---

## Task 5: Handle merchant mode redirect to own store

**Files:**
- Modify: `app/merchants/page.tsx` or add logic to Header

**Note:** This task is already handled by the existing merchant/[id] routes. When merchant is in mode and clicks "商家", they go to `/merchants` page. We need to auto-redirect to their own store.

- [ ] **Step 1: Read app/merchants/page.tsx**

- [ ] **Step 2: Add merchant mode redirect logic**

We need to check if user is in merchant mode and redirect to their store page directly.

Add to top of page component (after useStore calls):
```typescript
  const identityMode = useStore(state => state.identityMode);
  const currentMerchantId = useStore(state => state.currentMerchantId);
  const router = useRouter();

  // 商户模式下直接跳转自家店铺
  useEffect(() => {
    if (identityMode === 'merchant' && currentMerchantId) {
      router.push(`/merchant/${currentMerchantId}`);
    }
  }, [identityMode, currentMerchantId, router]);
```

- [ ] **Step 3: Commit**

```bash
git add app/merchants/page.tsx
git commit -m "feat: redirect merchant to own store page"
```

---

## Final Verification Checklist

- [ ] Header 商户模式显示：商户管理、积分商城、商家
- [ ] Header 用户模式显示：首页、商家、积分商城、资产
- [ ] 积分商城在商户模式下只显示自家商品
- [ ] 积分商城在商户模式下隐藏分类筛选
- [ ] 点击"商家"在商户模式下跳转自家店铺
- [ ] 商户管理有第三个 tab：数据概览
- [ ] 数据概览显示：商品总数、总订单数、销售额、库存预警
- [ ] 数据概览显示低库存和售罄商品列表
- [ ] build 通过

---

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
