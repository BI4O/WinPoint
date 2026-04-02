# WinPoint 商户 WIN 积分后台设计

> **Status:** Draft - Pending Implementation

## 概述

本文档描述 WinPoint 电商平台的商户 WIN 积分管理系统。WIN 是平台通用积分，商户需向平台购买，用户可在任意商户兑换商品或商城权益。

## 核心概念

### WIN 积分体系

| 概念 | 说明 |
|------|------|
| WIN 积分 | 平台通用积分，商户向平台购买，用户跨店使用 |
| 基础配额 | 商户购买 WinPoint 套餐获赠 WIN 积分（如 1000元 = 10,000 WIN） |
| 自定兑换比例 | 商户自行设置 WIN 与本店商品的兑换比例 |
| 额外购买 | 商户可额外购买 WIN（1 WIN = 1 元） |
| 商城权益 | 商户提供的福利（停车券、餐饮券等），用 WIN 兑换 |

### WIN 积分流转

```
商户 → 购买 WIN → 平台持有
用户 → 消费得 WIN → 用户钱包
用户 → 兑换商品/权益 → 平台扣减 WIN → 商户核销
```

## 商户后台模块

### 1. 数据概览

展示商户关键数据：

| 指标 | 说明 |
|------|------|
| WIN 积分余额 | 当前持有的 WIN 积分数量 |
| 累计兑换额 | 已兑换的 WIN 积分总量 |
| 今日订单 | 今日商品/权益兑换订单数 |
| 待处理 | 待发货/待核销订单数 |
| 商品总数 | 上架商品数 |
| 低库存 | 库存不足商品数 |

### 2. WIN 积分管理

#### 2.1 积分钱包

- **余额显示**：当前 WIN 积分数量
- **购买积分**：输入购买数量，1 WIN = 1 元
- **积分记录**：收支明细

#### 2.2 默认兑换比例

- 全店统一的 WIN:现金 比例
- 示例：10 WIN = 10 元（1:1）、10 WIN = 5 元（2:1）
- 可被单个商品覆盖

### 3. 商品管理

#### 3.1 商品列表

| 字段 | 说明 |
|------|------|
| 商品名称 | 商品 display name |
| 现金价 | 人民币价格 |
| WIN 积分价 | 所需 WIN 积分数量 |
| 库存 | 剩余数量 |
| 上架状态 | 是否在积分商城展示 |
| 操作 | 编辑/删除 |

#### 3.2 新增商品

- 商品名称
- 商品图标（emoji 选择）
- 现金价
- WIN 积分价
- 库存数量（可设无限）
- 上架状态（是否立即显示）

#### 3.3 批量操作

- 批量设置 WIN 积分价（基于现金价乘以系数）
- 批量上架/下架

### 4. 权益管理

商户可创建福利，用 WIN 积分吸引顾客。

#### 4.1 权益类型预设

| 类型 | 示例 |
|------|------|
| 🅿️ 停车券 | 停车 2 小时 |
| 🍽️ 餐饮券 | 满 100 减 20 |
| 🎁 礼品券 | 指定商品 |
| ☕ 饮品券 | 指定饮品 |
| 自定义 | 商户自定义 |

#### 4.2 权益字段

| 字段 | 说明 |
|------|------|
| 权益名称 | 如"停车2小时" |
| 权益类型 | 预设类型或自定义 |
| 所需 WIN | 兑换所需积分 |
| 每日限量 | 每天兑换上限（可选） |
| 有效期 | 券码有效期 |
| 上架状态 | 是否显示 |
| 描述 | 使用说明 |

#### 4.3 权益券码

- 用户兑换后生成唯一券码
- 券码格式：8位字母数字（如 WIN-ABC12345）
- 展示给用户，供商户核销

### 5. 订单管理

#### 5.1 订单类型

| 类型 | 说明 |
|------|------|
| 商品订单 | 用户用 WIN + 现金兑换商品 |
| 权益订单 | 用户用 WIN 兑换权益 |

#### 5.2 订单字段

| 字段 | 说明 |
|------|------|
| 订单号 | 唯一标识 |
| 类型 | 商品/权益 |
| 用户 | 用户钱包地址 |
| 商品/权益 | 兑换内容 |
| 支付方式 | WIN + 现金 |
| 状态 | 待发货/已发货/已完成/已取消 |
| 时间 | 创建时间 |
| 操作 | 详情/发货/核销 |

#### 5.3 权益核销

- 商户查看待核销的权益券码
- 输入券码或扫码核销
- 核销后订单完成

## 数据模型

### MerchantBenefit（商户权益）

```typescript
interface MerchantBenefit {
  id: string;
  merchantId: string;
  merchantName: string;
  name: string;
  type: 'parking' | 'dining' | 'gift' | 'beverage' | 'custom';
  winPrice: number;
  dailyLimit: number | null;  // null = 无限
  stock: number | null;       // null = 无限
  validDays: number;          // 券码有效期（天）
  isListed: boolean;
  description?: string;
  image: string;             // emoji:☕ 格式
}
```

### MerchantBenefitOrder（权益订单）

```typescript
interface MerchantBenefitOrder {
  id: string;
  benefitId: string;
  benefitName: string;
  merchantId: string;
  merchantName: string;
  userId: string;
  userAddress: string;
  winPrice: number;
  cashPrice: number;
  voucherCode: string;        // WIN-ABC12345
  status: 'pending' | 'used' | 'expired' | 'cancelled';
  timestamp: number;
  usedAt?: number;           // 核销时间
}
```

### Store 扩展字段

```typescript
// lib/store.ts 新增
interface AppState {
  // ... existing

  // WIN 积分
  merchantWinBalance: Record<string, number>;  // 商户WIN余额 merchantId -> balance
  merchantBenefits: MerchantBenefit[];         // 商户权益列表
  merchantBenefitOrders: MerchantBenefitOrder[]; // 权益订单

  // actions
  purchaseWin: (merchantId: string, amount: number) => void;
  addMerchantBenefit: (benefit: Omit<MerchantBenefit, 'id'>) => void;
  updateMerchantBenefit: (benefitId: string, updates: Partial<MerchantBenefit>) => void;
  redeemBenefit: (benefitId: string, userId: string) => boolean;
  useVoucher: (voucherCode: string) => boolean;
}
```

## 页面结构

```
app/merchant/manage/page.tsx
├── 数据概览 (默认显示)
│   ├── 统计卡片
│   └── 库存预警
├── WIN积分
│   ├── 余额 + 购买
│   ├── 积分记录
│   └── 默认兑换比例
├── 商品管理
│   ├── 商品列表
│   └── 新增商品
├── 权益管理
│   ├── 权益列表
│   └── 新增权益
└── 订单管理
    ├── 商品订单
    └── 权益订单
```

## Mock 数据

### 预设权益类型

```typescript
const BENEFIT_TYPES = [
  { type: 'parking', icon: '🅿️', label: '停车券' },
  { type: 'dining', icon: '🍽️', label: '餐饮券' },
  { type: 'gift', icon: '🎁', label: '礼品券' },
  { type: 'beverage', icon: '☕', label: '饮品券' },
  { type: 'custom', icon: '📦', label: '自定义' },
];
```

### Mock 权益数据

```typescript
const mockMerchantBenefits: MerchantBenefit[] = [
  // 星巴克
  { id: 'mb-sb-1', merchantId: 'starbucks', name: '停车2小时', type: 'parking', winPrice: 100, stock: 50, validDays: 30, isListed: true, image: 'emoji:🅿️' },
  { id: 'mb-sb-2', merchantId: 'starbucks', name: '免费升杯', type: 'beverage', winPrice: 50, stock: null, validDays: 7, isListed: true, image: 'emoji:☕' },
  // Nike
  { id: 'mb-nk-1', merchantId: 'nike', name: '运动毛巾', type: 'gift', winPrice: 200, stock: 30, validDays: 30, isListed: true, image: 'emoji:🎁' },
  // Apple
  { id: 'mb-ap-1', merchantId: 'apple', name: '免费贴膜', type: 'custom', winPrice: 150, stock: 20, validDays: 14, isListed: true, image: 'emoji:⌚' },
];
```

### Mock 权益订单

```typescript
const mockBenefitOrders: MerchantBenefitOrder[] = [
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
    voucherCode: 'WIN-ABC12345',
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
    voucherCode: 'WIN-DEF67890',
    status: 'used',
    timestamp: Date.now() - 86400000,
    usedAt: Date.now() - 43200000,
  },
];
```

## 实现优先级

### Phase 1 - MVP（核心）
1. WIN 积分余额 + 购买
2. 商品 WIN 积分价设置
3. 权益管理（创建、列表）
4. 权益订单 + 券码生成
5. 券码核销

### Phase 2 - 增强
1. 积分记录明细
2. 批量操作
3. 统计增强

---

**Author:** Claude
**Created:** 2026-04-02
**Status:** Draft for Implementation
