# WinPoint 商户 WIN 积分后台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现商户 WIN 积分管理后台，包括 WIN 钱包、权益管理、券码核销

**Architecture:**
- 在 store 中新增 WIN 积分相关状态和 actions
- 在 mock-data.ts 中新增 MerchantBenefit 和 MerchantBenefitOrder 类型
- 后台管理页面新增 WIN积分 和 权益管理 tabs
- 新增 AddBenefitModal 组件用于创建权益
- 新增 BenefitOrderRow 组件用于展示权益订单

**Tech Stack:** Next.js 16, Zustand, Tailwind CSS v4, Framer Motion, Lucide React

---

## File Structure

```
lib/
├── store.ts                    [MODIFY - 新增 WIN 积分状态和 actions]
├── mock-data.ts               [MODIFY - 新增 MerchantBenefit, MerchantBenefitOrder 类型和数据]

components/
├── WinPointsPanel.tsx         [CREATE - WIN 积分钱包面板]
├── BenefitsList.tsx           [CREATE - 权益列表组件]
├── AddBenefitModal.tsx        [CREATE - 新增权益弹窗]
├── BenefitOrderRow.tsx        [CREATE - 权益订单行组件]

app/
├── merchant/manage/page.tsx   [MODIFY - 新增 WIN积分 和 权益管理 tabs]
```

---

## Task 1: Add WIN types and mock data

**Files:**
- Modify: `lib/mock-data.ts`

- [ ] **Step 1: Read mock-data.ts to find where to add new types**

- [ ] **Step 2: Add MerchantBenefit interface after MerchantProduct (around line 26)**

```typescript
// 商户权益接口
export interface MerchantBenefit {
  id: string;
  merchantId: string;
  merchantName: string;
  name: string;
  type: 'parking' | 'dining' | 'gift' | 'beverage' | 'custom';
  winPrice: number;
  stock: number | null;       // null = 无限
  dailyLimit: number | null;   // null = 无限
  validDays: number;           // 有效期（天）
  isListed: boolean;
  description?: string;
  image: string;              // emoji:☕ 格式
}
```

- [ ] **Step 3: Add MerchantBenefitOrder interface after MerchantBenefit**

```typescript
// 商户权益订单接口
export interface MerchantBenefitOrder {
  id: string;
  benefitId: string;
  benefitName: string;
  merchantId: string;
  merchantName: string;
  userId: string;
  userAddress: string;
  winPrice: number;
  cashPrice: number;
  voucherCode: string;        // WIN-ABC12345 格式
  status: 'pending' | 'used' | 'expired' | 'cancelled';
  timestamp: number;
  usedAt?: number;            // 核销时间
}
```

- [ ] **Step 4: Add BENEFIT_TYPES constant after interfaces**

```typescript
// 权益类型预设
export const BENEFIT_TYPES = [
  { type: 'parking' as const, icon: '🅿️', label: '停车券' },
  { type: 'dining' as const, icon: '🍽️', label: '餐饮券' },
  { type: 'gift' as const, icon: '🎁', label: '礼品券' },
  { type: 'beverage' as const, icon: '☕', label: '饮品券' },
  { type: 'custom' as const, icon: '📦', label: '自定义' },
];
```

- [ ] **Step 5: Add mockMerchantBenefits after mockMerchantOrders (around line 680)**

```typescript
// 商户权益数据
export const mockMerchantBenefits: MerchantBenefit[] = [
  // 星巴克
  { id: 'mb-sb-1', merchantId: 'starbucks', merchantName: '星巴克咖啡', name: '停车2小时', type: 'parking', winPrice: 100, stock: 50, dailyLimit: null, validDays: 30, isListed: true, description: '适用于星巴克门店停车场', image: 'emoji:🅿️' },
  { id: 'mb-sb-2', merchantId: 'starbucks', merchantName: '星巴克咖啡', name: '免费升杯', type: 'beverage', winPrice: 50, stock: null, dailyLimit: 1, validDays: 7, isListed: true, description: '任意中杯升大杯', image: 'emoji:☕' },
  { id: 'mb-sb-3', merchantId: 'starbucks', merchantName: '星巴克咖啡', name: '月饼礼盒8折券', type: 'dining', winPrice: 200, stock: 20, dailyLimit: null, validDays: 30, isListed: false, description: '中秋月饼礼盒专属折扣', image: 'emoji:🥮' },
  // Nike
  { id: 'mb-nk-1', merchantId: 'nike', merchantName: 'Nike 运动', name: '运动毛巾', type: 'gift', winPrice: 200, stock: 30, dailyLimit: null, validDays: 30, isListed: true, description: '精选运动毛巾一条', image: 'emoji:🎁' },
  { id: 'mb-nk-2', merchantId: 'nike', merchantName: 'Nike 运动', name: '85折优惠券', type: 'dining', winPrice: 300, stock: 15, dailyLimit: null, validDays: 14, isListed: true, description: '正价商品85折', image: 'emoji:🏷️' },
  // Apple
  { id: 'mb-ap-1', merchantId: 'apple', merchantName: 'Apple Store', name: '免费贴膜服务', type: 'custom', winPrice: 150, stock: 20, dailyLimit: 5, validDays: 14, isListed: true, description: '指定门店贴膜服务', image: 'emoji:🛡️' },
  { id: 'mb-ap-2', merchantId: 'apple', merchantName: 'Apple Store', name: 'AirPods清洁服务', type: 'beverage', winPrice: 100, stock: null, dailyLimit: null, validDays: 7, isListed: true, description: 'AirPods 专业清洁', image: 'emoji:🎧' },
  // 母婴
  { id: 'mb-bb-1', merchantId: 'baby', merchantName: 'Ealing 母婴旗舰店', name: '免费理发一次', type: 'custom', winPrice: 250, stock: 10, dailyLimit: null, validDays: 30, isListed: true, description: '0-6岁儿童专业理发', image: 'emoji:✂️' },
  { id: 'mb-bb-2', merchantId: 'baby', merchantName: 'Ealing 母婴旗舰店', name: '孕妇摄影套餐', type: 'gift', winPrice: 500, stock: 5, dailyLimit: null, validDays: 60, isListed: true, description: '孕妇摄影套餐抵用券', image: 'emoji:📷' },
  // 珠宝
  { id: 'mb-jw-1', merchantId: 'jewelry', merchantName: 'DIMD 珠宝精品', name: '免费清洗服务', type: 'custom', winPrice: 100, stock: null, dailyLimit: null, validDays: 7, isListed: true, description: '珠宝专业清洗保养', image: 'emoji:💎' },
  { id: 'mb-jw-2', merchantId: 'jewelry', merchantName: 'DIMD 珠宝精品', name: '新品体验券', type: 'dining', winPrice: 300, stock: 10, dailyLimit: null, validDays: 30, isListed: false, description: '新品体验专属优惠', image: 'emoji:🎀' },
];
```

- [ ] **Step 6: Add mockBenefitOrders after mockMerchantBenefits**

```typescript
// 商户权益订单数据
export const mockBenefitOrders: MerchantBenefitOrder[] = [
  {
    id: 'bo-1',
    benefitId: 'mb-sb-1',
    benefitName: '停车2小时',
    merchantId: 'starbucks',
    merchantName: '星巴克咖啡',
    userId: '0x1234...5678',
    userAddress: '0x1234...5678',
    winPrice: 100,
    cashPrice: 0,
    voucherCode: 'WIN-A1B2C3D4',
    status: 'pending',
    timestamp: Date.now() - 3600000,
  },
  {
    id: 'bo-2',
    benefitId: 'mb-nk-1',
    benefitName: '运动毛巾',
    merchantId: 'nike',
    merchantName: 'Nike 运动',
    userId: '0x2345...6789',
    userAddress: '0x2345...6789',
    winPrice: 200,
    cashPrice: 0,
    voucherCode: 'WIN-E5F6G7H8',
    status: 'used',
    timestamp: Date.now() - 86400000,
    usedAt: Date.now() - 43200000,
  },
  {
    id: 'bo-3',
    benefitId: 'mb-ap-1',
    benefitName: '免费贴膜服务',
    merchantId: 'apple',
    merchantName: 'Apple Store',
    userId: '0x3456...7890',
    userAddress: '0x3456...7890',
    winPrice: 150,
    cashPrice: 0,
    voucherCode: 'WIN-I9J0K1L2',
    status: 'pending',
    timestamp: Date.now() - 7200000,
  },
];
```

- [ ] **Step 7: Verify and commit**

```bash
git add lib/mock-data.ts && git commit -m "feat: add MerchantBenefit and MerchantBenefitOrder types and mock data"
```

---

## Task 2: Update store with WIN积分 state and actions

**Files:**
- Modify: `lib/store.ts`

- [ ] **Step 1: Read store.ts**

- [ ] **Step 2: Update imports to include new types**

Change:
```typescript
import {
  mockUserInitial,
  mockOrdersInitial,
  mockActivitiesInitial,
  mockMerchantProducts,
  mockMerchantOrders,
  type Order,
  type Activity,
  type MerchantProduct,
  type MerchantOrder,
  type Product,
  type CartItem
} from './mock-data';
```

To:
```typescript
import {
  mockUserInitial,
  mockOrdersInitial,
  mockActivitiesInitial,
  mockMerchantProducts,
  mockMerchantOrders,
  mockMerchantBenefits,
  mockBenefitOrders,
  type Order,
  type Activity,
  type MerchantProduct,
  type MerchantOrder,
  type MerchantBenefit,
  type MerchantBenefitOrder,
  type Product,
  type CartItem
} from './mock-data';
```

- [ ] **Step 3: Add new state to AppState interface (after line 36)**

```typescript
  // WIN 积分相关
  merchantWinBalance: Record<string, number>;  // 商户WIN余额 merchantId -> balance
  merchantBenefits: MerchantBenefit[];          // 商户权益列表
  merchantBenefitOrders: MerchantBenefitOrder[]; // 权益订单列表

  // WIN 积分 actions
  purchaseWin: (merchantId: string, amount: number) => void;
  addMerchantBenefit: (benefit: Omit<MerchantBenefit, 'id'>) => void;
  updateMerchantBenefit: (benefitId: string, updates: Partial<MerchantBenefit>) => void;
  deleteMerchantBenefit: (benefitId: string) => void;
  redeemBenefit: (benefitId: string, userId: string) => boolean;
  useVoucher: (voucherCode: string) => boolean;
```

- [ ] **Step 4: Add initial state (after merchantOrders line)**

```typescript
  merchantWinBalance: {
    starbucks: 10000,
    nike: 8000,
    apple: 12000,
    baby: 6000,
    jewelry: 15000,
  },
  merchantBenefits: mockMerchantBenefits,
  merchantBenefitOrders: mockBenefitOrders,
```

- [ ] **Step 5: Add action implementations (after the redeemProduct action)**

```typescript
  // WIN 积分 actions
  purchaseWin: (merchantId, amount) => {
    set(state => ({
      merchantWinBalance: {
        ...state.merchantWinBalance,
        [merchantId]: (state.merchantWinBalance[merchantId] || 0) + amount
      }
    }));
  },

  addMerchantBenefit: (benefit) => {
    const newBenefit: MerchantBenefit = {
      ...benefit,
      id: `mb-${Date.now()}`
    };
    set(state => ({
      merchantBenefits: [...state.merchantBenefits, newBenefit]
    }));
  },

  updateMerchantBenefit: (benefitId, updates) => {
    set(state => ({
      merchantBenefits: state.merchantBenefits.map(b =>
        b.id === benefitId ? { ...b, ...updates } : b
      )
    }));
  },

  deleteMerchantBenefit: (benefitId) => {
    set(state => ({
      merchantBenefits: state.merchantBenefits.filter(b => b.id !== benefitId)
    }));
  },

  redeemBenefit: (benefitId, userId) => {
    const { merchantBenefits, user, merchantWinBalance } = get();
    const benefit = merchantBenefits.find(b => b.id === benefitId);

    if (!benefit || !benefit.isListed) return false;
    if (benefit.stock !== null && benefit.stock < 1) return false;
    if (user.point < benefit.winPrice) return false;

    // 生成券码
    const voucherCode = `WIN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const newOrder: MerchantBenefitOrder = {
      id: `bo-${Date.now()}`,
      benefitId: benefit.id,
      benefitName: benefit.name,
      merchantId: benefit.merchantId,
      merchantName: benefit.merchantName,
      userId,
      userAddress: user.address,
      winPrice: benefit.winPrice,
      cashPrice: benefit.cashPrice || 0,
      voucherCode,
      status: 'pending',
      timestamp: Date.now()
    };

    set(state => ({
      user: {
        ...state.user,
        point: state.user.point - benefit.winPrice
      },
      merchantBenefits: state.merchantBenefits.map(b =>
        b.id === benefitId && b.stock !== null
          ? { ...b, stock: b.stock - 1 }
          : b
      ),
      merchantBenefitOrders: [newOrder, ...state.merchantBenefitOrders]
    }));

    return true;
  },

  useVoucher: (voucherCode) => {
    const { merchantBenefitOrders } = get();
    const order = merchantBenefitOrders.find(o => o.voucherCode === voucherCode);

    if (!order || order.status !== 'pending') return false;

    set(state => ({
      merchantBenefitOrders: state.merchantBenefitOrders.map(o =>
        o.voucherCode === voucherCode
          ? { ...o, status: 'used', usedAt: Date.now() }
          : o
      )
    }));

    return true;
  },
```

- [ ] **Step 6: Verify lint and commit**

```bash
pnpm run lint 2>&1 | head -20
git add lib/store.ts && git commit -m "feat: add WIN points state and actions to store"
```

---

## Task 3: Create WinPointsPanel component

**Files:**
- Create: `components/WinPointsPanel.tsx`

- [ ] **Step 1: Create WinPointsPanel component**

```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useStore } from '@/lib/store';

export default function WinPointsPanel() {
  const currentMerchantId = useStore(state => state.currentMerchantId);
  const merchantWinBalance = useStore(state => state.merchantWinBalance);
  const purchaseWin = useStore(state => state.purchaseWin);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [showPurchase, setShowPurchase] = useState(false);

  const balance = currentMerchantId ? merchantWinBalance[currentMerchantId] || 0 : 0;

  const handlePurchase = () => {
    if (!currentMerchantId || !purchaseAmount) return;
    const amount = parseInt(purchaseAmount, 10);
    if (amount > 0) {
      purchaseWin(currentMerchantId, amount);
      setPurchaseAmount('');
      setShowPurchase(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* WIN 余额卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover className="p-6 bg-gradient-to-br from-md-primary/10 to-md-primary/5 border border-md-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">WIN 积分余额</p>
              <p className="text-4xl font-bold text-md-primary">{balance.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-1">≈ ¥{(balance / 10).toFixed(0)}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-md-primary/20 flex items-center justify-center">
              <Coins className="w-7 h-7 text-md-primary" />
            </div>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">本月收入</p>
              <p className="text-3xl font-bold text-green-500">+2,350</p>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 较上月 15%
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-green-500" />
            </div>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">本月兑换</p>
              <p className="text-3xl font-bold text-orange-500">-1,800</p>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> 128 笔
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
              <TrendingDown className="w-7 h-7 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* 购买积分 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-333">购买 WIN 积分</h3>
          {!showPurchase && (
            <Button
              onClick={() => setShowPurchase(true)}
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              购买
            </Button>
          )}
        </div>

        {showPurchase ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="flex gap-3">
              <input
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="输入购买数量"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
              />
              <Button onClick={handlePurchase} disabled={!purchaseAmount}>
                确认购买
              </Button>
              <Button variant="outlined" onClick={() => setShowPurchase(false)}>
                取消
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              购买规则：1 WIN = ¥1，每次最低购买 100 WIN
            </p>
          </motion.div>
        ) : (
          <p className="text-gray-400">点击购买按钮为您的账户充值 WIN 积分</p>
        )}
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Verify lint and commit**

```bash
pnpm run lint 2>&1 | head -20
git add components/WinPointsPanel.tsx && git commit -m "feat: add WinPointsPanel component"
```

---

## Task 4: Create BenefitsList component

**Files:**
- Create: `components/BenefitsList.tsx`

- [ ] **Step 1: Create BenefitsList component**

```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { BENEFIT_TYPES } from '@/lib/mock-data';
import Card from './Card';
import Button from './Button';
import AddBenefitModal from './AddBenefitModal';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

export default function BenefitsList() {
  const currentMerchantId = useStore(state => state.currentMerchantId);
  const merchantBenefits = useStore(state => state.merchantBenefits);
  const updateMerchantBenefit = useStore(state => state.updateMerchantBenefit);
  const deleteMerchantBenefit = useStore(state => state.deleteMerchantBenefit);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<string | null>(null);

  const merchantBenefitsList = currentMerchantId
    ? merchantBenefits.filter(b => b.merchantId === currentMerchantId)
    : [];

  const getBenefitIcon = (type: string) => {
    const benefitType = BENEFIT_TYPES.find(t => t.type === type);
    return benefitType?.icon || '📦';
  };

  const handleToggleListed = (benefitId: string, currentListed: boolean) => {
    updateMerchantBenefit(benefitId, { isListed: !currentListed });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-333">我的权益</h3>
          <p className="text-sm text-gray-500">管理您的福利商品，设置 WIN 积分兑换价格</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          新增权益
        </Button>
      </div>

      {/* Benefits Grid */}
      {merchantBenefitsList.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🎁</div>
          <p className="text-gray-500">暂无权益</p>
          <p className="text-sm text-gray-400 mt-1">点击上方按钮创建您的第一个权益</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {merchantBenefitsList.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className={`p-5 ${!benefit.isListed ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{benefit.image.startsWith('emoji:')
                      ? benefit.image.replace('emoji:', '')
                      : benefit.image}</span>
                    <div>
                      <h4 className="font-bold text-gray-333">{benefit.name}</h4>
                      <p className="text-xs text-gray-500">{getBenefitIcon(benefit.type)} {BENEFIT_TYPES.find(t => t.type === benefit.type)?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleListed(benefit.id, benefit.isListed)}
                      className={`p-2 rounded-lg transition-colors ${
                        benefit.isListed
                          ? 'text-green-500 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={benefit.isListed ? '已上架' : '已下架'}
                    >
                      {benefit.isListed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-md-primary">{benefit.winPrice}</p>
                    <p className="text-xs text-gray-400">WIN 积分</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {benefit.stock === null ? '无限库存' : `库存 ${benefit.stock}`}
                    </p>
                    <p className="text-xs text-gray-400">有效期 {benefit.validDays} 天</p>
                  </div>
                </div>

                {benefit.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{benefit.description}</p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditingBenefit(benefit.id)}
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    编辑
                  </Button>
                  <Button
                    variant="outlined"
                    size="sm"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => deleteMerchantBenefit(benefit.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddBenefitModal
        isOpen={showAddModal || !!editingBenefit}
        onClose={() => {
          setShowAddModal(false);
          setEditingBenefit(null);
        }}
        benefitId={editingBenefit || undefined}
        merchantId={currentMerchantId || 'starbucks'}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify lint and commit**

```bash
pnpm run lint 2>&1 | head -20
git add components/BenefitsList.tsx && git commit -m "feat: add BenefitsList component"
```

---

## Task 5: Create AddBenefitModal component

**Files:**
- Create: `components/AddBenefitModal.tsx`

- [ ] **Step 1: Create AddBenefitModal component**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';
import { useStore } from '@/lib/store';
import { BENEFIT_TYPES } from '@/lib/mock-data';

interface AddBenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  benefitId?: string;
  merchantId: string;
}

const EMOJI_OPTIONS = ['🅿️', '🍽️', '🎁', '☕', '📦', '🏷️', '🛡️', '✂️', '📷', '🎀', '🥮', '🏋️'];

export default function AddBenefitModal({ isOpen, onClose, benefitId, merchantId }: AddBenefitModalProps) {
  const addMerchantBenefit = useStore(state => state.addMerchantBenefit);
  const updateMerchantBenefit = useStore(state => state.updateMerchantBenefit);
  const merchantBenefits = useStore(state => state.merchantBenefits);
  const mockMerchants = useStore.getState ? (() => {
    const { mockMerchants: merchants } = require('@/lib/mock-data');
    return merchants;
  })() : [];

  const [name, setName] = useState('');
  const [type, setType] = useState<'parking' | 'dining' | 'gift' | 'beverage' | 'custom'>('custom');
  const [winPrice, setWinPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isInfiniteStock, setIsInfiniteStock] = useState(false);
  const [validDays, setValidDays] = useState('30');
  const [isListed, setIsListed] = useState(true);
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📦');

  useEffect(() => {
    if (benefitId) {
      const benefit = merchantBenefits.find(b => b.id === benefitId);
      if (benefit) {
        setName(benefit.name);
        setType(benefit.type);
        setWinPrice(String(benefit.winPrice));
        setStock(benefit.stock === null ? '' : String(benefit.stock));
        setIsInfiniteStock(benefit.stock === null);
        setValidDays(String(benefit.validDays));
        setIsListed(benefit.isListed);
        setDescription(benefit.description || '');
        setSelectedEmoji(benefit.image.startsWith('emoji:') ? benefit.image.replace('emoji:', '') : '📦');
      }
    } else {
      // Reset form
      setName('');
      setType('custom');
      setWinPrice('');
      setStock('');
      setIsInfiniteStock(false);
      setValidDays('30');
      setIsListed(true);
      setDescription('');
      setSelectedEmoji('📦');
    }
  }, [benefitId, merchantBenefits, isOpen]);

  const merchantName = mockMerchants.find((m: any) => m.id === merchantId)?.name || '商户';

  const handleSubmit = () => {
    if (!name || !winPrice) return;

    const benefitData = {
      merchantId,
      merchantName,
      name,
      type,
      winPrice: parseInt(winPrice, 10),
      stock: isInfiniteStock ? null : (stock ? parseInt(stock, 10) : 0),
      dailyLimit: null,
      validDays: parseInt(validDays, 10),
      isListed,
      description,
      image: `emoji:${selectedEmoji}`,
    };

    if (benefitId) {
      updateMerchantBenefit(benefitId, benefitData);
    } else {
      addMerchantBenefit(benefitData);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-333">
              {benefitId ? '编辑权益' : '新增权益'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">权益名称</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="如：停车2小时"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">权益类型</label>
              <div className="flex flex-wrap gap-2">
                {BENEFIT_TYPES.map(t => (
                  <button
                    key={t.type}
                    onClick={() => setType(t.type)}
                    className={`px-3 py-2 rounded-xl text-sm flex items-center gap-1 transition-all ${
                      type === t.type
                        ? 'bg-md-primary/10 text-md-primary ring-2 ring-md-primary'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">图标</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? 'bg-md-primary/10 ring-2 ring-md-primary'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* WIN Price */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">所需 WIN 积分</label>
              <input
                type="number"
                value={winPrice}
                onChange={e => setWinPrice(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">库存数量</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={stock}
                  onChange={e => setStock(e.target.value)}
                  placeholder="0"
                  disabled={isInfiniteStock}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none disabled:bg-gray-100"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInfiniteStock}
                    onChange={e => setIsInfiniteStock(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-md-primary focus:ring-md-primary"
                  />
                  <span className="text-sm text-gray-333">无限</span>
                </label>
              </div>
            </div>

            {/* Valid Days */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">有效期（天）</label>
              <input
                type="number"
                value={validDays}
                onChange={e => setValidDays(e.target.value)}
                placeholder="30"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">描述（可选）</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="使用说明..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none resize-none"
              />
            </div>

            {/* Listed Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-333">立即上架</span>
              <button
                onClick={() => setIsListed(!isListed)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isListed ? 'bg-md-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    isListed ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onClose}
              variant="outlined"
              size="lg"
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              variant="filled"
              size="lg"
              className="flex-1"
              disabled={!name || !winPrice}
            >
              {benefitId ? '保存' : '创建'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify lint and commit**

```bash
pnpm run lint 2>&1 | head -20
git add components/AddBenefitModal.tsx && git commit -m "feat: add AddBenefitModal component"
```

---

## Task 6: Create BenefitOrderRow component

**Files:**
- Create: `components/BenefitOrderRow.tsx`

- [ ] **Step 1: Create BenefitOrderRow component**

```typescript
'use client';

import { motion } from 'framer-motion';
import { MerchantBenefitOrder } from '@/lib/mock-data';
import { useStore } from '@/lib/store';
import { CheckCircle, Clock, XCircle, Copy } from 'lucide-react';
import { useState } from 'react';

interface BenefitOrderRowProps {
  order: MerchantBenefitOrder;
}

export default function BenefitOrderRow({ order }: BenefitOrderRowProps) {
  const useVoucher = useStore(state => state.useVoucher);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseVoucher = () => {
    useVoucher(order.voucherCode);
  };

  const getStatusBadge = () => {
    switch (order.status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
            <Clock className="w-3 h-3" />
            待核销
          </span>
        );
      case 'used':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            已核销
          </span>
        );
      case 'expired':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
            <XCircle className="w-3 h-3" />
            已过期
          </span>
        );
      default:
        return null;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <p className="font-medium text-gray-333">{order.benefitName}</p>
        <p className="text-xs text-gray-500">{order.merchantName}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-500">
            {order.userAddress.slice(0, 8)}...{order.userAddress.slice(-4)}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
            {order.voucherCode}
          </code>
          <button
            onClick={handleCopyCode}
            className="p-1 rounded hover:bg-gray-200 text-gray-400"
            title="复制券码"
          >
            <Copy className="w-4 h-4" />
          </button>
          {copied && <span className="text-xs text-green-500">已复制</span>}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-md-primary">{order.winPrice}</span>
          <span className="text-xs text-gray-500">WIN</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-gray-500">{formatTime(order.timestamp)}</p>
        {order.usedAt && (
          <p className="text-xs text-gray-400">核销: {formatTime(order.usedAt)}</p>
        )}
      </td>
      <td className="py-3 px-4">
        {getStatusBadge()}
      </td>
      <td className="py-3 px-4">
        {order.status === 'pending' && (
          <button
            onClick={handleUseVoucher}
            className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
          >
            核销
          </button>
        )}
      </td>
    </tr>
  );
}
```

- [ ] **Step 2: Verify lint and commit**

```bash
pnpm run lint 2>&1 | head -20
git add components/BenefitOrderRow.tsx && git commit -m "feat: add BenefitOrderRow component"
```

---

## Task 7: Update merchant manage page with new tabs

**Files:**
- Modify: `app/merchant/manage/page.tsx`

- [ ] **Step 1: Read merchant/manage/page.tsx**

- [ ] **Step 2: Update imports**

Add:
```typescript
import WinPointsPanel from '@/components/WinPointsPanel';
import BenefitsList from '@/components/BenefitsList';
import BenefitOrderRow from '@/components/BenefitOrderRow';
```

- [ ] **Step 3: Update activeTab type**

Change:
```typescript
const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
```
To:
```typescript
const [activeTab, setActiveTab] = useState<'overview' | 'win' | 'products' | 'benefits' | 'orders'>('overview');
```

- [ ] **Step 4: Update tab buttons**

Replace the existing tabs section with:

```typescript
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
            {[
              { key: 'overview', label: '数据概览' },
              { key: 'win', label: 'WIN积分' },
              { key: 'products', label: '商品管理' },
              { key: 'benefits', label: '权益管理' },
              { key: 'orders', label: '订单管理' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-3 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-md-primary border-b-2 border-md-primary'
                    : 'text-gray-500 hover:text-gray-333'
                }`}
              >
                {tab.label}
                {tab.key === 'orders' && ` (${merchantOrdersList.length})`}
              </button>
            ))}
          </div>
        </motion.div>
```

- [ ] **Step 5: Update content section to include new tabs**

Find the content section and replace the condition:

Change:
```typescript
          {activeTab === 'products' ? (
```
To:
```typescript
          {activeTab === 'overview' ? (
            // 数据概览内容 - 已有的 stats 部分
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
                  value={`¥${totalSales.toFixed(0)}`}
                  subtitle={`积分 ${totalPointsEarned}`}
                  icon="💰"
                />
                <MerchantStatsCard
                  title="WIN 余额"
                  value={merchantWinBalance[selectedMerchantId]?.toLocaleString() || 0}
                  subtitle="≈ ¥xxx"
                  icon="🪙"
                />
              </div>

              {/* 库存预警 */}
              {(lowStockProducts > 0 || outOfStockProducts > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lowStockProducts > 0 && (
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
                      <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        库存不足 ({lowStockProducts})
                      </h3>
                      <div className="space-y-2">
                        {merchantProductsList
                          .filter(p => p.stock > 0 && p.stock < 10)
                          .map(product => (
                            <div key={product.id} className="flex items-center justify-between bg-white/80 rounded-xl px-4 py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{product.image.startsWith('emoji:') ? product.image.replace('emoji:', '') : product.image}</span>
                                <span className="text-sm font-medium text-gray-700">{product.name}</span>
                              </div>
                              <span className="text-sm font-bold text-orange-500">剩余 {product.stock} 件</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {outOfStockProducts > 0 && (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-5 border border-red-200">
                      <h3 className="text-base font-bold text-red-600 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        已售罄 ({outOfStockProducts})
                      </h3>
                      <div className="space-y-2">
                        {merchantProductsList
                          .filter(p => p.stock === 0)
                          .map(product => (
                            <div key={product.id} className="flex items-center justify-between bg-white/80 rounded-xl px-4 py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{product.image.startsWith('emoji:') ? product.image.replace('emoji:', '') : product.image}</span>
                                <span className="text-sm font-medium text-gray-700">{product.name}</span>
                              </div>
                              <span className="text-sm font-bold text-red-500">售罄</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : activeTab === 'win' ? (
            <WinPointsPanel />
          ) : activeTab === 'benefits' ? (
            <BenefitsList />
          ) : activeTab === 'products' ? (
```

- [ ] **Step 6: Update orders tab to include benefit orders**

Replace the orders tab content with two sections:

```typescript
          ) : (
            <div className="space-y-6">
              {/* 商品订单 */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-333">商品订单</h3>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">商品</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">用户</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">价格</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">时间</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchantOrdersList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-500">
                          暂无商品订单
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

              {/* 权益订单 */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-333">权益订单</h3>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">权益</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">用户</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">券码</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">WIN</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">时间</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchantBenefitOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-500">
                          暂无权益订单
                        </td>
                      </tr>
                    ) : (
                      merchantBenefitOrders.map(order => (
                        <BenefitOrderRow key={order.id} order={order} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
```

- [ ] **Step 7: Verify lint and commit**

```bash
pnpm run lint 2>&1 | head -30
git add app/merchant/manage/page.tsx && git commit -m "feat: add WIN points tabs to merchant manage page"
```

---

## Final Verification Checklist

- [ ] 数据概览 tab 显示 WIN 余额
- [ ] WIN积分 tab 显示余额、购买按钮、统计数据
- [ ] 权益管理 tab 显示权益列表、新增按钮
- [ ] 权益订单 tab 显示券码、核销按钮
- [ ] 可以新增权益
- [ ] 可以编辑权益
- [ ] 可以核销券码
- [ ] build 通过

---

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
