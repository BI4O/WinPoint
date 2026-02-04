# Credit & Share Consumer Demo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a hackathon demo showcasing the Credit & Share dual-asset model consumer experience with Material You design system.

**Architecture:** Next.js 14 App Router with Zustand state management, mock data, Material You (MD3) design with Tailwind CSS, Framer Motion animations, and Recharts visualization.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS v4, Framer Motion, Recharts, Zustand, Lucide React, date-fns

**Priority:** P0 pages (Home, Merchants, Dashboard, Stake) must be completed. P1 pages (Market, Orders) are optional.

---

## Phase 1: Foundation (Setup & Core Infrastructure)

### Task 1: Install Dependencies

**Step 1: Install packages**
```bash
cd /Users/bi4o/Desktop/RWA_Ltd/demo
pnpm add zustand framer-motion recharts lucide-react date-fns clsx react-countup
```

**Step 2: Commit**
```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add core dependencies"
```

---

### Task 2: Configure Material You Design System

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Step 1: Replace app/globals.css**

Complete file content:
```css
@import "tailwindcss";

@theme {
  --color-md-background: #fffbfe;
  --color-md-on-background: #1c1b1f;
  --color-md-primary: #6750a4;
  --color-md-on-primary: #ffffff;
  --color-md-secondary-container: #e8def8;
  --color-md-on-secondary-container: #1d192b;
  --color-md-tertiary: #7d5260;
  --color-md-surface-container: #f3edf7;
  --color-md-surface-container-low: #e7e0ec;
  --color-md-border: #79747e;
  --color-md-on-surface-variant: #49454f;
  --color-md-success: #10b981;
  --color-md-error: #ef4444;
}

body {
  font-family: system-ui, sans-serif;
  background-color: var(--color-md-background);
  color: var(--color-md-on-background);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
```

**Step 2: Update app/layout.tsx to add Roboto font**

Add imports at top:
```typescript
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})
```

Update html tag:
```typescript
<html lang="zh-CN" className={roboto.className}>
```

**Step 3: Test**
```bash
pnpm dev
```
Expected: Server starts, no errors

**Step 4: Commit**
```bash
git add app/globals.css app/layout.tsx
git commit -m "style: configure Material You design system"
```

---

### Task 3: Create Mock Data & Store

**Files:**
- Create: `lib/mock-data.ts`
- Create: `lib/store.ts`
- Create: `lib/utils.ts`

**Step 1: Create lib/mock-data.ts**

Complete file (see full content in appendix A)

**Step 2: Create lib/store.ts**

Complete file (see full content in appendix B)

**Step 3: Create lib/utils.ts**

```typescript
import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num)
}
```

**Step 4: Test**
```bash
pnpm build
```
Expected: Build succeeds

**Step 5: Commit**
```bash
git add lib/
git commit -m "feat: add mock data, store, and utilities"
```

---

## Phase 2: Shared Components

### Task 4: Create Header Component

**Files:**
- Create: `components/Header.tsx`

**Step 1: Create components/Header.tsx**

Complete file (see appendix C)

**Step 2: Test**
```bash
pnpm build
```

**Step 3: Commit**
```bash
git add components/Header.tsx
git commit -m "feat: add Header component"
```

---

### Task 5: Create Reusable UI Components

**Files:**
- Create: `components/AssetCard.tsx`
- Create: `components/Button.tsx`
- Create: `components/Card.tsx`

**Step 1: Create components/Button.tsx**

```typescript
'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'filled', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'rounded-full font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      filled: 'bg-md-primary text-md-on-primary hover:bg-md-primary/90 shadow-sm hover:shadow-md',
      tonal: 'bg-md-secondary-container text-md-on-secondary-container hover:bg-md-secondary-container/90',
      outlined: 'border border-md-border text-md-primary hover:bg-md-primary/5',
      text: 'text-md-primary hover:bg-md-primary/10'
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-10 px-6 text-sm',
      lg: 'h-12 px-8 text-base'
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
```

**Step 2: Create components/Card.tsx**

```typescript
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl bg-md-surface-container p-6 shadow-sm',
          hover && 'transition-all duration-300 hover:shadow-md hover:scale-[1.02]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
```

**Step 3: Create components/AssetCard.tsx**

```typescript
'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Card from './Card';

interface AssetCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export default function AssetCard({ title, value, subtitle, icon: Icon, trend }: AssetCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-md-on-surface-variant mb-2">{title}</p>
          <motion.p
            className="text-3xl font-bold text-md-on-background mb-1"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-xs text-md-on-surface-variant">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.direction === 'up' ? 'text-md-success' : 'text-md-error'}`}>
              <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-md-primary/10">
          <Icon className="h-6 w-6 text-md-primary" />
        </div>
      </div>
    </Card>
  );
}
```

**Step 4: Test**
```bash
pnpm build
```

**Step 5: Commit**
```bash
git add components/
git commit -m "feat: add reusable UI components"
```

---

## Phase 3: P0 Pages Implementation

### Task 6: Implement Home Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Replace app/page.tsx**

Complete file (see appendix D)

**Step 2: Test**
```bash
pnpm dev
```
Visit http://localhost:3000

**Step 3: Commit**
```bash
git add app/page.tsx
git commit -m "feat: implement home page"
```

---

### Task 7: Implement Merchants Page

**Files:**
- Create: `app/merchants/page.tsx`
- Create: `components/MerchantCard.tsx`
- Create: `components/OrderModal.tsx`

**Step 1: Create components/MerchantCard.tsx**

Complete file (see appendix E)

**Step 2: Create components/OrderModal.tsx**

Complete file (see appendix F)

**Step 3: Create app/merchants/page.tsx**

Complete file (see appendix G)

**Step 4: Test**
```bash
pnpm dev
```
Visit http://localhost:3000/merchants

**Step 5: Commit**
```bash
git add app/merchants/ components/MerchantCard.tsx components/OrderModal.tsx
git commit -m "feat: implement merchants page"
```

---

### Task 8: Implement Dashboard Page

**Files:**
- Create: `app/dashboard/page.tsx`
- Create: `components/ActivityList.tsx`
- Create: `components/EarningsChart.tsx`

**Step 1: Create components/EarningsChart.tsx**

Complete file (see appendix H)

**Step 2: Create components/ActivityList.tsx**

Complete file (see appendix I)

**Step 3: Create app/dashboard/page.tsx**

Complete file (see appendix J)

**Step 4: Test**
```bash
pnpm dev
```
Visit http://localhost:3000/dashboard

**Step 5: Commit**
```bash
git add app/dashboard/ components/ActivityList.tsx components/EarningsChart.tsx
git commit -m "feat: implement dashboard page"
```

---

### Task 9: Implement Stake Page

**Files:**
- Create: `app/stake/page.tsx`
- Create: `components/StakeForm.tsx`

**Step 1: Create components/StakeForm.tsx**

Complete file (see appendix K)

**Step 2: Create app/stake/page.tsx**

Complete file (see appendix L)

**Step 3: Test**
```bash
pnpm dev
```
Visit http://localhost:3000/stake

**Step 4: Commit**
```bash
git add app/stake/ components/StakeForm.tsx
git commit -m "feat: implement stake page"
```

---

### Task 10: Add Header to Layout

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Import and add Header**

Add import:
```typescript
import Header from '@/components/Header'
```

Update body content:
```typescript
<body className={roboto.className}>
  <Header />
  <main className="min-h-screen">
    {children}
  </main>
</body>
```

**Step 2: Test all pages**
```bash
pnpm dev
```
Navigate through all pages

**Step 3: Commit**
```bash
git add app/layout.tsx
git commit -m "feat: add Header to layout"
```

---

## Phase 4: P1 Pages (Optional)

### Task 11: Implement Market Page

**Files:**
- Create: `app/market/page.tsx`

Complete file (see appendix M)

---

### Task 12: Implement Orders Page

**Files:**
- Create: `app/orders/page.tsx`

Complete file (see appendix N)

---

## Phase 5: Polish & Testing

### Task 13: Add Loading States & Error Handling

**Files:**
- Create: `app/loading.tsx`
- Create: `app/error.tsx`

**Step 1: Create app/loading.tsx**

```typescript
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-md-primary border-t-transparent"></div>
    </div>
  );
}
```

**Step 2: Create app/error.tsx**

```typescript
'use client';

import Button from '@/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">出错了！</h2>
      <p className="mb-8 text-md-on-surface-variant">{error.message}</p>
      <Button onClick={reset}>重试</Button>
    </div>
  );
}
```

**Step 3: Commit**
```bash
git add app/loading.tsx app/error.tsx
git commit -m "feat: add loading and error states"
```

---

### Task 14: Add Toast Notifications

**Files:**
- Create: `components/Toast.tsx`
- Create: `lib/toast.ts`

**Step 1: Create components/Toast.tsx**

Complete file (see appendix O)

**Step 2: Create lib/toast.ts**

Complete file (see appendix P)

**Step 3: Add Toast to layout**

Update app/layout.tsx to include Toast component

**Step 4: Commit**
```bash
git add components/Toast.tsx lib/toast.ts app/layout.tsx
git commit -m "feat: add toast notifications"
```

---

### Task 15: Responsive Design & Mobile Optimization

**Files:**
- Modify: `components/Header.tsx` (add mobile menu)
- Review all pages for mobile responsiveness

**Step 1: Test on mobile viewport**
```bash
pnpm dev
```
Use browser DevTools to test mobile sizes

**Step 2: Fix any responsive issues**

**Step 3: Commit**
```bash
git add .
git commit -m "style: improve mobile responsiveness"
```

---

### Task 16: Final Testing & Demo Preparation

**Step 1: Test complete user journey**
1. Visit home page
2. Go to merchants, create order
3. Check dashboard for updated credit
4. Stake credit
5. Check dashboard for updated share

**Step 2: Verify animations**
- Page transitions smooth
- Number animations work
- Hover effects present

**Step 3: Check console for errors**
```bash
pnpm dev
```
Open browser console, navigate all pages

**Step 4: Build for production**
```bash
pnpm build
pnpm start
```

**Step 5: Final commit**
```bash
git add .
git commit -m "chore: final polish and testing"
```

---

## Appendices

### Appendix A: lib/mock-data.ts

```typescript
export interface Merchant {
  id: number;
  name: string;
  category: string;
  logo: string;
  description: string;
  creditRate: number;
}

export interface Order {
  id: number;
  date: string;
  merchant: string;
  merchantId: number;
  amount: number;
  creditEarned: number;
  status: 'completed' | 'pending';
}

export interface Activity {
  id: number;
  type: 'credit_earned' | 'credit_staked' | 'reward_received';
  amount: number;
  merchant?: string;
  timestamp: string;
}

export interface MarketOrder {
  id: number;
  seller: string;
  amount: number;
  price: number;
  total: number;
}

export const mockMerchants: Merchant[] = [
  {
    id: 1,
    name: "星巴克咖啡",
    category: "餐饮",
    logo: "☕",
    description: "全球知名咖啡连锁",
    creditRate: 10
  },
  {
    id: 2,
    name: "Nike 运动",
    category: "运动",
    logo: "👟",
    description: "运动装备专家",
    creditRate: 10
  },
  {
    id: 3,
    name: "Apple Store",
    category: "电子产品",
    logo: "🍎",
    description: "科技产品零售",
    creditRate: 10
  }
];

export const mockUserInitial = {
  address: "0x1234...5678",
  credit: 100,
  share: 50,
  earnings: 12.5
};

export const mockOrdersInitial: Order[] = [
  {
    id: 1,
    date: "2024-02-01 10:30",
    merchant: "星巴克咖啡",
    merchantId: 1,
    amount: 30,
    creditEarned: 3,
    status: "completed"
  }
];

export const mockActivitiesInitial: Activity[] = [
  {
    id: 1,
    type: "credit_earned",
    amount: 10,
    merchant: "星巴克咖啡",
    timestamp: "2024-02-01 10:30"
  },
  {
    id: 2,
    type: "credit_staked",
    amount: 50,
    timestamp: "2024-02-02 14:20"
  },
  {
    id: 3,
    type: "reward_received",
    amount: 5.2,
    timestamp: "2024-02-03 00:00"
  }
];

export const mockMarketData = {
  currentPrice: 2.5,
  volume24h: 1234,
  priceChange24h: 5.2,
  orders: [
    {
      id: 1,
      seller: "0x1234...5678",
      amount: 10,
      price: 2.5,
      total: 25
    }
  ] as MarketOrder[]
};

export const mockEarningsHistory = [
  { month: "2024-01", amount: 3.2 },
  { month: "2024-02", amount: 4.5 },
  { month: "2024-03", amount: 4.8 }
];

export const mockMetrics = {
  totalUsers: 1234,
  totalCredit: 45678,
  totalRewards: 12345.67,
  totalShares: 23456
};
```

### Appendix B: lib/store.ts

```typescript
import { create } from 'zustand';
import {
  mockUserInitial,
  mockOrdersInitial,
  mockActivitiesInitial,
  type Order,
  type Activity
} from './mock-data';

interface UserState {
  address: string;
  credit: number;
  share: number;
  earnings: number;
}

interface AppState {
  user: UserState;
  orders: Order[];
  activities: Activity[];
  consumeAtMerchant: (merchantId: number, merchantName: string, amount: number) => void;
  stakeCredit: (amount: number) => void;
  sellShare: (amount: number, price: number) => void;
  buyShare: (orderId: number, amount: number, price: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: mockUserInitial,
  orders: mockOrdersInitial,
  activities: mockActivitiesInitial,

  consumeAtMerchant: (merchantId, merchantName, amount) => {
    const creditEarned = amount / 10;
    const newOrder: Order = {
      id: Date.now(),
      date: new Date().toLocaleString('zh-CN'),
      merchant: merchantName,
      merchantId,
      amount,
      creditEarned,
      status: 'completed'
    };

    const newActivity: Activity = {
      id: Date.now(),
      type: 'credit_earned',
      amount: creditEarned,
      merchant: merchantName,
      timestamp: new Date().toLocaleString('zh-CN')
    };

    set(state => ({
      user: {
        ...state.user,
        credit: state.user.credit + creditEarned
      },
      orders: [newOrder, ...state.orders],
      activities: [newActivity, ...state.activities]
    }));
  },

  stakeCredit: (amount) => {
    const { user } = get();
    if (user.credit < amount) return;

    const newActivity: Activity = {
      id: Date.now(),
      type: 'credit_staked',
      amount,
      timestamp: new Date().toLocaleString('zh-CN')
    };

    set(state => ({
      user: {
        ...state.user,
        credit: state.user.credit - amount,
        share: state.user.share + amount
      },
      activities: [newActivity, ...state.activities]
    }));
  },

  sellShare: (amount, price) => {
    const { user } = get();
    if (user.share < amount) return;

    set(state => ({
      user: {
        ...state.user,
        share: state.user.share - amount,
        earnings: state.user.earnings + (amount * price)
      }
    }));
  },

  buyShare: (orderId, amount, price) => {
    set(state => ({
      user: {
        ...state.user,
        share: state.user.share + amount,
        earnings: state.user.earnings - (amount * price)
      }
    }));
  }
}));
```

### Appendix C: components/Header.tsx

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Wallet, Home, Store, LayoutDashboard, TrendingUp } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { user } = useStore();

  const navItems = [
    { href: '/', label: '首页', icon: Home },
    { href: '/merchants', label: '商家', icon: Store },
    { href: '/dashboard', label: '资产', icon: LayoutDashboard },
    { href: '/market', label: '市场', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-md-border/20 bg-md-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-md-primary text-md-on-primary font-bold text-lg">
            C&S
          </div>
          <span className="font-bold text-lg">Credit & Share</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full
                  transition-all duration-300
                  ${isActive
                    ? 'bg-md-secondary-container text-md-on-secondary-container'
                    : 'text-md-on-surface-variant hover:bg-md-primary/10'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full bg-md-surface-container">
            <span className="text-sm font-medium">Credit:</span>
            <span className="text-sm font-bold text-md-primary">{user.credit.toFixed(1)}</span>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary/90 transition-all duration-300 active:scale-95">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">{user.address}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
```

---

**Note:** Due to length constraints, appendices D-P contain placeholder references. When executing this plan, the implementing agent should refer to the PRD document (guide/PRD.md) and UI reference (guide/UI_reference.md) for complete component implementations following Material You design principles.

**Key Implementation Guidelines:**
1. All buttons must be `rounded-full` (pill-shaped)
2. Use Material You color tokens from globals.css
3. Add smooth transitions (300ms duration)
4. Include `active:scale-95` on all clickable elements
5. Use Framer Motion for page transitions and animations
6. Follow the mock data structures defined in lib/mock-data.ts
7. Test each page after implementation
8. Commit frequently with descriptive messages

---

## Execution Options

**Plan complete and saved to `docs/plans/2026-02-04-credit-share-consumer-demo.md`.**

**Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
