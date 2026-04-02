# WinPoint 身份切换与商户管理优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现Header身份切换（用户/商户模式）、商户管理界面增加商品新增功能、修复图片显示bug

**Architecture:**
- Header右侧改为身份选择器（emoji+角色名），下拉切换用户/商户身份
- 用户模式：首页、商家、积分商城、资产
- 商户模式：仅商户管理
- 商户管理增加「新增商品」功能

**Tech Stack:** Next.js 16, Zustand, Tailwind CSS v4, Framer Motion, Lucide React

---

## File Structure

```
components/
├── Header.tsx              [MODIFY - 改为身份选择器]
├── IdentitySwitcher.tsx    [CREATE - 身份切换下拉组件]
├── MerchantProductRow.tsx   [MODIFY - 修复emoji显示]
├── AddProductModal.tsx     [CREATE - 新增商品弹窗]

lib/
├── store.ts                [MODIFY - 添加商户身份状态、新增商品action]
├── mock-data.ts            [MODIFY - 修复emoji图片格式]

app/
├── merchant/manage/page.tsx [MODIFY - 添加新增商品按钮和弹窗]
```

---

## Task 1: Add identity state to store

**Files:**
- Modify: `lib/store.ts`

- [ ] **Step 1: Read current store.ts to understand structure**

- [ ] **Step 2: Add identity state interface**

Add to store:
```typescript
// 身份状态
type IdentityMode = 'user' | 'merchant';
type MerchantId = 'starbucks' | 'nike' | 'apple' | 'baby' | 'jewelry';

interface AppState {
  // ... existing state ...

  // 身份状态
  identityMode: IdentityMode;
  currentMerchantId: MerchantId | null;

  // actions
  setIdentityMode: (mode: IdentityMode, merchantId?: MerchantId) => void;
}
```

- [ ] **Step 3: Add identity state and action to store implementation**

```typescript
identityMode: 'user',
currentMerchantId: null,

setIdentityMode: (mode, merchantId) => {
  set({
    identityMode: mode,
    currentMerchantId: mode === 'merchant' ? (merchantId || 'starbucks') : null
  });
},
```

- [ ] **Step 4: Add addMerchantProduct action**

```typescript
addMerchantProduct: (product: Omit<MerchantProduct, 'id'>) => {
  const newProduct: MerchantProduct = {
    ...product,
    id: `mp-${Date.now()}`
  };
  set(state => ({
    merchantProducts: [...state.merchantProducts, newProduct]
  }));
},
```

- [ ] **Step 5: Commit**

```bash
git add lib/store.ts
git commit -m "feat: add identity state and addMerchantProduct action"
```

---

## Task 2: Create IdentitySwitcher component

**Files:**
- Create: `components/IdentitySwitcher.tsx`

- [ ] **Step 1: Create IdentitySwitcher component**

```typescript
'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { mockMerchants } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Store } from 'lucide-react';

export default function IdentitySwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { identityMode, currentMerchantId, setIdentityMode } = useStore();

  const currentMerchant = currentMerchantId
    ? mockMerchants.find(m => m.id === currentMerchantId)
    : null;

  const displayEmoji = currentMerchant?.logo || '👤';
  const displayLabel = currentMerchant?.name || '用户';

  const handleSelect = (mode: 'user' | 'merchant', merchantId?: string) => {
    setIdentityMode(mode, merchantId as any);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-lg">{displayEmoji}</span>
        <span className="text-sm font-medium text-white hidden sm:inline">{displayLabel}</span>
        <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">用户模式</p>
                <button
                  onClick={() => handleSelect('user')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    identityMode === 'user'
                      ? 'bg-md-primary/10 text-md-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-medium">用户</span>
                </button>
              </div>

              <div className="border-t border-gray-100 p-2">
                <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">商户模式</p>
                {mockMerchants.map(merchant => (
                  <button
                    key={merchant.id}
                    onClick={() => handleSelect('merchant', merchant.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      identityMode === 'merchant' && currentMerchantId === merchant.id
                        ? 'bg-md-primary/10 text-md-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{merchant.logo}</span>
                    <span className="text-sm font-medium">{merchant.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/IdentitySwitcher.tsx
git commit -m "feat: add IdentitySwitcher component"
```

---

## Task 3: Update Header.tsx - Replace wallet with IdentitySwitcher

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: Read current Header.tsx

- [ ] **Step 2: Update imports**

Replace Wallet import with IdentitySwitcher:
```typescript
import IdentitySwitcher from './IdentitySwitcher';
import { Home, Store, Gift, LayoutDashboard } from 'lucide-react';
```

Remove Wallet import.

- [ ] **Step 3: Update navItems based on identity mode**

Add inside Header component:
```typescript
const identityMode = useStore(state => state.identityMode);

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

- [ ] **Step 4: Replace wallet button with IdentitySwitcher**

Replace the wallet button (around line 100-108) with:
```typescript
<IdentitySwitcher />
```

- [ ] **Step 5: Remove unused state and imports**

Remove `useState` if not needed, and clean up unused imports.

- [ ] **Step 6: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: replace wallet with identity switcher in header"
```

---

## Task 4: Fix MerchantProductRow emoji display

**Files:**
- Modify: `components/MerchantProductRow.tsx`

- [ ] **Step 1: Fix emoji display logic**

Current issue: `product.image` is stored as `emoji:☕` but needs to be rendered as just the emoji.

Replace line 39:
```typescript
// Before:
<span className="text-2xl">{product.image}</span>

// After:
<span className="text-2xl">{product.image.startsWith('emoji:') ? product.image.replace('emoji:', '') : product.image}</span>
```

- [ ] **Step 2: Commit**

```bash
git add components/MerchantProductRow.tsx
git commit -m "fix: merchant product row emoji display"
```

---

## Task 5: Create AddProductModal component

**Files:**
- Create: `components/AddProductModal.tsx`

- [ ] **Step 1: Create AddProductModal component**

```typescript
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';
import { useStore } from '@/lib/store';

const EMOJI_OPTIONS = ['☕', '🍔', '👟', '🎧', '⌚', '👜', '💎', '👶'];

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantId: string;
  merchantName: string;
}

export default function AddProductModal({ isOpen, onClose, merchantId, merchantName }: AddProductModalProps) {
  const addMerchantProduct = useStore(state => state.addMerchantProduct);
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('☕');
  const [cashPrice, setCashPrice] = useState('');
  const [pointPrice, setPointPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isInfinite, setIsInfinite] = useState(false);
  const [isListed, setIsListed] = useState(true);

  const handleSubmit = () => {
    if (!name || !cashPrice || !pointPrice) return;

    addMerchantProduct({
      merchantId,
      merchantName,
      name,
      image: `emoji:${selectedEmoji}`,
      cashPrice: Number(cashPrice),
      pointPrice: Number(pointPrice),
      stock: isInfinite ? 9999 : Number(stock),
      isListed,
      category: '默认'
    });

    // Reset form
    setName('');
    setSelectedEmoji('☕');
    setCashPrice('');
    setPointPrice('');
    setStock('');
    setIsInfinite(false);
    setIsListed(true);
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
          className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-333">新增商品</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">商品名称</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="输入商品名称"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
              />
            </div>

            {/* Emoji Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">商品图标</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
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

            {/* Cash Price */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">现金价 (¥)</label>
              <input
                type="number"
                value={cashPrice}
                onChange={e => setCashPrice(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
              />
            </div>

            {/* Point Price */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">积分价</label>
              <input
                type="number"
                value={pointPrice}
                onChange={e => setPointPrice(e.target.value)}
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
                  disabled={isInfinite}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none disabled:bg-gray-100"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInfinite}
                    onChange={e => setIsInfinite(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-md-primary focus:ring-md-primary"
                  />
                  <span className="text-sm text-gray-333">无限</span>
                </label>
              </div>
            </div>

            {/* Listed Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-333">立即上架积分商城</span>
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
              disabled={!name || !cashPrice || !pointPrice}
            >
              添加商品
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/AddProductModal.tsx
git commit -m "feat: add AddProductModal component"
```

---

## Task 6: Update merchant manage page with Add Product button

**Files:**
- Modify: `app/merchant/manage/page.tsx`

- [ ] **Step 1: Read current page

- [ ] **Step 2: Add imports and state**

```typescript
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { mockMerchants } from '@/lib/mock-data';
import MerchantProductRow from '@/components/MerchantProductRow';
import MerchantOrderRow from '@/components/MerchantOrderRow';
import AddProductModal from '@/components/AddProductModal';
import AtmosphericBackground from '@/components/AtmosphericBackground';
import { Plus } from 'lucide-react';
import Button from '@/components/Button';
```

Add state:
```typescript
const [showAddModal, setShowAddModal] = useState(false);
```

- [ ] **Step 3: Add "Add Product" button above the table**

In the products tab, above the table, add:
```typescript
<div className="flex justify-between items-center mb-4">
  <h3 className="text-lg font-bold text-gray-333">商品列表</h3>
  <Button
    onClick={() => setShowAddModal(true)}
    size="sm"
    className="flex items-center gap-1"
  >
    <Plus className="w-4 h-4" />
    新增商品
  </Button>
</div>
```

- [ ] **Step 4: Add AddProductModal at bottom of return**

Before the closing `</AtmosphericBackground>`, add:
```typescript
<AddProductModal
  isOpen={showAddModal}
  onClose={() => setShowAddModal(false)}
  merchantId={selectedMerchantId}
  merchantName={currentMerchant?.name || ''}
/>
```

- [ ] **Step 5: Commit**

```bash
git add app/merchant/manage/page.tsx
git commit -m "feat: add product management buttons to merchant manage page"
```

---

## Task 7: Verify and fix remaining issues

- [ ] **Step 1: Run lint check**

```bash
pnpm run lint
```

- [ ] **Step 2: Run build check**

```bash
pnpm run build
```

- [ ] **Step 3: Fix any remaining issues found**

- [ ] **Step 4: Commit any fixes**

---

## Final Verification Checklist

- [ ] Header右侧显示身份emoji+名称
- [ ] 点击下拉可切换用户/商户身份
- [ ] 用户模式下显示：首页、商家、积分商城、资产
- [ ] 商户模式下只显示：商户管理
- [ ] 商户管理页有「新增商品」按钮
- [ ] 点击新增商品弹出表单
- [ ] 表单可选emoji、图片名、现金价、积分价、库存/无限、上架开关
- [ ] 提交后商品出现在列表
- [ ] 商品图片emoji正确显示
- [ ] /stake 和 /market 返回404
- [ ] build通过

---

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
