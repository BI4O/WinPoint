# Consumer Demo V2 - 产品需求文档

## 文档信息

- **版本**: v0.2 (基于 v0.1 的改进版本)
- **目标**: 在黑客松 Demo 基础上增强用户体验和功能完整性
- **技术栈**: Next.js 16 + Tailwind CSS v4 + Zustand + Mock Data
- **开发周期**: 5-7 天

------

## 改进概述

基于 v0.1 版本的反馈，V2 版本将重点改进以下方面：

1. ✅ **商城购物体验升级** - 从简化的"输入金额"模式升级为真实的电商购物体验
2. ✅ **Credit 积分商城** - 赋予 Credit 积分兑换功能，增强资产实用性

------

## 需求 1: 商城购物体验升级

### 1.1 需求背景

**现状问题**：
- V0.1 版本中，用户点击商家后直接输入消费金额，缺少真实的购物体验
- 没有具体的商品展示，用户无法感知"消费"的实际场景
- 缺少购物车等电商基础功能，体验不够完整

**改进目标**：
> 打造真实的电商购物体验，让用户在选购商品的过程中自然地获得 Credit

### 1.2 核心改动

#### 商家配置
- **保留原有商家**: 星巴克咖啡、Nike 运动、Apple Store（共3个）
- **新增商家**: 母婴用品店、珠宝钻石店（共2个）
- **总计**: 5个商家，每个商家配置 6 个商品

#### 购物流程升级
```
V0.1 流程：
商家列表 → [点击消费] → 输入金额弹窗 → 获得 Credit

V0.2 流程：
商家列表 → [进入店铺] → 店铺商品页 → 浏览商品 → [加入购物车]
→ 购物车抽屉 → [去结算] → 确认订单 → 获得 Credit
```

### 1.3 页面结构设计

#### 1.3.1 商家列表页 (`/merchants`) - 改进

**改动点**：
- 按钮文案：`[消费]` → `[进入店铺]`
- 点击行为：弹出金额输入框 → 跳转到店铺详情页

**页面布局**：
```
┌─────────────────────────────────────┐
│  Header + User Info (Credit余额)    │
├─────────────────────────────────────┤
│                                     │
│  商家卡片网格 (2-3 列)               │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ 星巴克   │  │ Nike     │        │
│  │ Logo     │  │ Logo     │        │
│  │ 餐饮     │  │ 运动     │        │
│  │[进入店铺]│  │[进入店铺]│        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ Apple    │  │ 母婴用品  │        │
│  │ Logo     │  │ Logo     │        │
│  │ 电子产品 │  │ 母婴     │        │
│  │[进入店铺]│  │[进入店铺]│        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌──────────┐                      │
│  │ 珠宝钻石  │                      │
│  │ Logo     │                      │
│  │ 奢侈品   │                      │
│  │[进入店铺]│                      │
│  └──────────┘                      │
│                                     │
└─────────────────────────────────────┘
```

#### 1.3.2 店铺详情页 (`/merchants/[id]`) - 新增

**页面路由**：
- `/merchants/starbucks` - 星巴克咖啡
- `/merchants/nike` - Nike 运动
- `/merchants/apple` - Apple Store
- `/merchants/baby` - 母婴用品店
- `/merchants/jewelry` - 珠宝钻石店

**页面布局**：
```
┌─────────────────────────────────────┐
│  Header + 购物车图标 🛒 (3)         │
├─────────────────────────────────────┤
│  [← 返回]                           │
├─────────────────────────────────────┤
│                                     │
│  店铺头部                            │
│  ┌─────────────────────────────┐   │
│  │ 🏪 [店铺名称]               │   │
│  │ 📍 [店铺类目]               │   │
│  │ 💳 消费可获得 Credit (10:1) │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  商品网格 (3列 × 2行 = 6个商品)     │
│                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ │
│  │ 图片   │ │ 图片   │ │ 图片   │ │
│  │ 商品名 │ │ 商品名 │ │ 商品名 │ │
│  │ $89    │ │ $299   │ │ $45    │ │
│  │[加入购物车]│[加入购物车]│[加入购物车]│
│  └────────┘ └────────┘ └────────┘ │
│                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ │
│  │ 图片   │ │ 图片   │ │ 图片   │ │
│  │ 商品名 │ │ 商品名 │ │ 商品名 │ │
│  │ $68    │ │ $35    │ │ $129   │ │
│  │[加入购物车]│[加入购物车]│[加入购物车]│
│  └────────┘ └────────┘ └────────┘ │
│                                     │
└─────────────────────────────────────┘

右下角固定：
┌─────────┐
│ 🛒      │
│  (3)    │  ← 购物车浮动按钮
└─────────┘
```

#### 1.3.3 购物车抽屉 (Drawer) - 新增

**触发方式**：
- 点击右下角购物车浮动按钮
- 点击 Header 中的购物车图标

**抽屉布局**：
```
                    ┌─────────────────────┐
                    │ 购物车 (3件)    [×] │
                    ├─────────────────────┤
                    │                     │
                    │ ┌─────────────────┐ │
                    │ │ [图] 商品名称   │ │
                    │ │ $89             │ │
                    │ │ [-] 1 [+] [删除]│ │
                    │ └─────────────────┘ │
                    │                     │
                    │ ┌─────────────────┐ │
                    │ │ [图] 商品名称   │ │
                    │ │ $299            │ │
                    │ │ [-] 2 [+] [删除]│ │
                    │ └─────────────────┘ │
                    │                     │
                    │ ┌─────────────────┐ │
                    │ │ [图] 商品名称   │ │
                    │ │ $45             │ │
                    │ │ [-] 1 [+] [删除]│ │
                    │ └─────────────────┘ │
                    │                     │
                    ├─────────────────────┤
                    │ 商品总计: $433      │
                    │ 将获得: 43.3 Credit │
                    ├─────────────────────┤
                    │                     │
                    │ [清空购物车]        │
                    │ [去结算] ←主按钮    │
                    │                     │
                    └─────────────────────┘
```

**交互逻辑**：
- 点击 `[+]` / `[-]` 调整商品数量
- 点击 `[删除]` 移除单个商品
- 点击 `[清空购物车]` 清空所有商品（需二次确认）
- 点击 `[去结算]` 进入结算流程
- 实时计算总金额和将获得的 Credit

#### 1.3.4 结算确认弹窗 (Modal) - 改进

**触发方式**：
- 购物车抽屉中点击 `[去结算]`

**弹窗布局**：
```
┌─────────────────────────────────┐
│  确认订单                   [×] │
├─────────────────────────────────┤
│                                 │
│  商家: 星巴克咖啡               │
│                                 │
│  订单明细:                      │
│  - 美式咖啡 × 1    $89         │
│  - 拿铁咖啡 × 2    $598        │
│  - 提拉米苏 × 1    $45         │
│                                 │
│  ─────────────────────────      │
│  商品总计: $732                 │
│  将获得 Credit: 73.2            │
│                                 │
│  💡 提示: Credit 可用于质押获得 │
│     Share，参与收益分配         │
│                                 │
│  [取消]  [确认支付]             │
│                                 │
└─────────────────────────────────┘
```

**确认后流程**：
1. 显示支付加载动画（模拟交易）
2. 成功提示 Toast: "支付成功！获得 XX Credit"
3. 清空购物车
4. 更新用户 Credit 余额
5. 添加订单记录到订单历史
6. 添加活动记录到活动列表
7. 自动跳转到 `/dashboard` 资产页面

### 1.4 数据结构设计

#### 1.4.1 商品数据模型

```typescript
interface Product {
  id: string;              // 商品唯一标识
  merchantId: string;      // 所属商家 ID
  name: string;            // 商品名称
  price: number;           // 价格 (USDT)
  image: string;           // 商品图片 URL
  description?: string;    // 商品描述（可选）
  stock: number;           // 库存数量
  category?: string;       // 商品分类（可选）
}
```

#### 1.4.2 商家数据模型（扩展）

```typescript
interface Merchant {
  id: string;              // 商家唯一标识
  name: string;            // 商家名称
  category: string;        // 商家类目
  logo: string;            // 商家 Logo
  description: string;     // 商家简介
  creditRate: number;      // Credit 获取比例 (默认 10:1)
  products: Product[];     // 商家商品列表 (新增)
}
```

#### 1.4.3 购物车数据模型

```typescript
interface CartItem {
  product: Product;        // 商品信息
  quantity: number;        // 购买数量
}

interface Cart {
  items: CartItem[];       // 购物车商品列表
  totalAmount: number;     // 商品总金额
  totalCredit: number;     // 将获得的 Credit 总数
}
```

#### 1.4.4 订单数据模型（扩展）

```typescript
interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  merchantId: string;
  merchantName: string;
  items: OrderItem[];      // 订单商品明细 (新增)
  totalAmount: number;     // 订单总金额
  creditEarned: number;    // 获得的 Credit
  timestamp: number;
  status: 'completed' | 'pending';
}
```

### 1.5 Mock 数据设计

#### 1.5.1 商家商品配置

**1. 星巴克咖啡 (Starbucks)**
```typescript
{
  id: 'starbucks',
  name: '星巴克咖啡',
  category: '餐饮',
  products: [
    { id: 'sb-1', name: '☕ 美式咖啡', price: 32, image: 'emoji:☕' },
    { id: 'sb-2', name: '☕ 拿铁咖啡', price: 38, image: 'emoji:☕' },
    { id: 'sb-3', name: '☕ 卡布奇诺', price: 38, image: 'emoji:☕' },
    { id: 'sb-4', name: '☕ 摩卡咖啡', price: 42, image: 'emoji:☕' },
    { id: 'sb-5', name: '☕ 焦糖玛奇朵', price: 45, image: 'emoji:☕' },
    { id: 'sb-6', name: '🍰 提拉米苏', price: 35, image: 'emoji:🍰' }
  ]
}
```

**2. Nike 运动 (Nike)**
```typescript
{
  id: 'nike',
  name: 'Nike 运动',
  category: '运动',
  products: [
    { id: 'nk-1', name: '👟 Air Max 运动鞋', price: 899, image: 'emoji:👟' },
    { id: 'nk-2', name: '👕 Dri-FIT 运动T恤', price: 299, image: 'emoji:👕' },
    { id: 'nk-3', name: '🩳 运动短裤', price: 399, image: 'emoji:🩳' },
    { id: 'nk-4', name: '🎒 运动背包', price: 499, image: 'emoji:🎒' },
    { id: 'nk-5', name: '🧦 运动袜套装', price: 129, image: 'emoji:🧦' },
    { id: 'nk-6', name: '🥤 运动水壶', price: 159, image: 'emoji:🥤' }
  ]
}
```

**3. Apple Store**
```typescript
{
  id: 'apple',
  name: 'Apple Store',
  category: '电子产品',
  products: [
    { id: 'ap-1', name: '🎧 AirPods Pro', price: 1999, image: 'emoji:🎧' },
    { id: 'ap-2', name: '⌚ Apple Watch SE', price: 2199, image: 'emoji:⌚' },
    { id: 'ap-3', name: '📱 iPhone 保护壳', price: 399, image: 'emoji:📱' },
    { id: 'ap-4', name: '🔌 MagSafe 充电器', price: 329, image: 'emoji:🔌' },
    { id: 'ap-5', name: '🔌 Lightning 数据线', price: 149, image: 'emoji:🔌' },
    { id: 'ap-6', name: '🏷️ AirTag 4件装', price: 799, image: 'emoji:🏷️' }
  ]
}
```

**4. 母婴用品店 (Baby Store)** - 新增
```typescript
{
  id: 'baby',
  name: 'Ealing 母婴旗舰店',
  category: '母婴',
  products: [
    { id: 'bb-1', name: 'Ealing 4合1滑梯秋千套装', price: 869, image: '/products/baby/bb-1.jpeg' },
    { id: 'bb-2', name: 'Ealing 儿童沙发滑梯', price: 629, image: '/products/baby/bb-2.jpeg' },
    { id: 'bb-3', name: 'Ealing 3合1婴儿学步车', price: 579, image: '/products/baby/bb-3.jpeg' },
    { id: 'bb-4', name: 'Ealing 野餐篮套装', price: 516, image: '/products/baby/bb-4.jpeg' },
    { id: 'bb-5', name: 'Ealing 室内幼儿滑梯', price: 459, image: '/products/baby/bb-5.jpeg' },
    { id: 'bb-6', name: 'Ealing 可折叠婴儿学步车', price: 619, image: '/products/baby/bb-6.jpeg' }
  ]
}
```

**5. 珠宝钻石店 (Jewelry Store)** - 新增
```typescript
{
  id: 'jewelry',
  name: 'DIMD 珠宝精品',
  category: '奢侈品',
  products: [
    { id: 'jw-1', name: '18K白金橄榄石戒指', price: 4100, image: '待提供' },
    { id: 'jw-2', name: '18K白红金粉红宝石戒指', price: 2400, image: '待提供' },
    { id: 'jw-3', name: '18K白金尖晶白钻胸针', price: 3800, image: '待提供' },
    { id: 'jw-4', name: '18K白红金粉钻戒指', price: 3750, image: '待提供' },
    { id: 'jw-5', name: '蓝宝石白钻戒指', price: 2700, image: '待提供' },
    { id: 'jw-6', name: '18K金祖母绿黄白钻戒指', price: 2600, image: '待提供' }
  ]
}
```

**注意事项**：
- 商品图片 URL 待用户提供后更新
- 价格单位为 USDT
- 所有商家的 Credit 获取比例统一为 10:1（消费 $10 = 1 Credit）
- 库存数量默认设置为 999（Mock 数据无需真实库存管理）

### 1.6 组件设计

#### 1.6.1 新增组件列表

| 组件名 | 文件路径 | 用途 | 复用性 |
|--------|----------|------|--------|
| `ProductCard` | `components/ProductCard.tsx` | 商品卡片展示 | 店铺详情页 |
| `ShoppingCartDrawer` | `components/ShoppingCartDrawer.tsx` | 购物车侧边抽屉 | 全局 |
| `CartItem` | `components/CartItem.tsx` | 购物车商品项 | 购物车抽屉 |
| `MerchantHeader` | `components/MerchantHeader.tsx` | 店铺头部信息 | 店铺详情页 |
| `CheckoutModal` | `components/CheckoutModal.tsx` | 结算确认弹窗 | 购物车抽屉 |
| `CartFloatingButton` | `components/CartFloatingButton.tsx` | 购物车浮动按钮 | 店铺详情页 |

#### 1.6.2 ProductCard 组件

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

// 组件结构
<div className="product-card">
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
  <p className="price">${product.price}</p>
  <button onClick={() => onAddToCart(product)}>
    加入购物车
  </button>
</div>
```

**交互效果**：
- Hover 时卡片轻微上浮 + 阴影加深
- 点击"加入购物车"后显示成功动画（✓ 图标飞入购物车）
- 购物车数量徽章 +1 动画

#### 1.6.3 ShoppingCartDrawer 组件

```typescript
interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}
```

**动画效果**：
- 从右侧滑入/滑出（Framer Motion）
- 背景遮罩淡入淡出
- 商品数量变化时的数字动画

#### 1.6.4 CartFloatingButton 组件

```typescript
interface CartFloatingButtonProps {
  itemCount: number;
  onClick: () => void;
}

// 固定在右下角
position: fixed;
bottom: 24px;
right: 24px;
```

**交互效果**：
- 数量徽章显示购物车商品总数
- 有商品时徽章跳动动画
- 点击打开购物车抽屉

### 1.7 状态管理扩展

#### 1.7.1 Zustand Store 新增字段

```typescript
// lib/store.ts
interface AppState {
  // ... 原有字段 ...

  // 新增：购物车相关
  cart: CartItem[];

  // 新增：购物车操作
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (merchantId: string, merchantName: string) => void;

  // 新增：购物车计算属性
  getCartTotal: () => number;
  getCartCreditTotal: () => number;
  getCartItemCount: () => number;
}
```

#### 1.7.2 购物车操作逻辑

```typescript
// 加入购物车
addToCart: (product) => {
  const existingItem = cart.find(item => item.product.id === product.id);

  if (existingItem) {
    // 商品已存在，数量 +1
    updateCartItemQuantity(product.id, existingItem.quantity + 1);
  } else {
    // 新商品，添加到购物车
    cart.push({ product, quantity: 1 });
  }

  // 显示成功提示
  showToast('已加入购物车');
},

// 更新商品数量
updateCartItemQuantity: (productId, quantity) => {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const item = cart.find(item => item.product.id === productId);
  if (item) {
    item.quantity = quantity;
  }
},

// 结算
checkout: (merchantId, merchantName) => {
  const totalAmount = getCartTotal();
  const creditEarned = getCartCreditTotal();

  // 创建订单
  const order = {
    id: generateOrderId(),
    merchantId,
    merchantName,
    items: cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    })),
    totalAmount,
    creditEarned,
    timestamp: Date.now(),
    status: 'completed'
  };

  // 更新用户 Credit
  user.credit += creditEarned;

  // 添加订单记录
  orders.push(order);

  // 添加活动记录
  activities.push({
    type: 'credit_earned',
    amount: creditEarned,
    merchant: merchantName,
    timestamp: Date.now()
  });

  // 清空购物车
  clearCart();

  // 显示成功提示
  showToast(`支付成功！获得 ${creditEarned} Credit`);

  // 跳转到资产页面
  router.push('/dashboard');
}
```

### 1.8 交互细节与动画

#### 1.8.1 关键动画效果

| 场景 | 动画效果 | 实现方案 |
|------|----------|----------|
| 加入购物车 | ✓ 图标飞入购物车 | Framer Motion |
| 购物车徽章 | 数字跳动 + 放大 | CSS Animation |
| 抽屉打开/关闭 | 从右侧滑入/滑出 | Framer Motion |
| 商品数量变化 | 数字滚动动画 | react-countup |
| 结算成功 | Credit 增加动画 | Framer Motion |
| 商品卡片 Hover | 上浮 + 阴影 | CSS Transform |

#### 1.8.2 用户反馈

**Toast 提示**：
- 加入购物车成功
- 移除商品
- 清空购物车
- 支付成功

**加载状态**：
- 结算时显示加载动画（模拟支付过程 1-2秒）

**空状态**：
- 购物车为空时显示空状态插图 + 提示文案

### 1.9 响应式设计

#### 桌面端 (≥768px)
- 商品网格：3列布局
- 购物车抽屉：宽度 400px
- 商品卡片：正常尺寸

#### 移动端 (<768px)
- 商品网格：2列布局
- 购物车抽屉：全屏宽度
- 商品卡片：紧凑尺寸
- 浮动按钮：位置调整避免遮挡内容

### 1.10 开发任务拆解

#### Phase 1: 数据层 (1天)
- [ ] 扩展 Merchant 数据模型，添加 products 字段
- [ ] 创建 5 个商家的 Mock 商品数据（每个 6 个商品）
- [ ] 扩展 Zustand Store，添加购物车状态和操作
- [ ] 实现购物车逻辑（增删改查、结算）

#### Phase 2: 店铺详情页 (1.5天)
- [ ] 创建 `/merchants/[id]` 动态路由
- [ ] 实现 MerchantHeader 组件
- [ ] 实现 ProductCard 组件
- [ ] 实现商品网格布局（3列2行）
- [ ] 实现 CartFloatingButton 组件
- [ ] 添加"加入购物车"交互和动画

#### Phase 3: 购物车功能 (1.5天)
- [ ] 实现 ShoppingCartDrawer 组件
- [ ] 实现 CartItem 组件
- [ ] 实现购物车抽屉打开/关闭动画
- [ ] 实现商品数量调整功能
- [ ] 实现移除商品功能
- [ ] 实现清空购物车功能
- [ ] 实现购物车徽章数量显示

#### Phase 4: 结算流程 (1天)
- [ ] 实现 CheckoutModal 组件
- [ ] 实现订单明细展示
- [ ] 实现结算逻辑（创建订单、更新 Credit）
- [ ] 实现支付成功动画和提示
- [ ] 实现自动跳转到资产页面

#### Phase 5: 优化与测试 (1天)
- [ ] 添加所有动画效果
- [ ] 响应式适配（移动端）
- [ ] 空状态处理
- [ ] 错误处理
- [ ] 完整流程测试
- [ ] 性能优化

**预计总工时**: 5-6 天

### 1.11 验收标准

#### 功能验收
- [ ] 5 个商家均可进入店铺详情页
- [ ] 每个店铺展示 6 个商品（3列2行）
- [ ] 可以正常加入购物车
- [ ] 购物车数量徽章正确显示
- [ ] 可以调整商品数量、移除商品、清空购物车
- [ ] 结算流程完整，正确获得 Credit
- [ ] 订单记录和活动记录正确生成

#### 体验验收
- [ ] 所有动画流畅自然
- [ ] 交互反馈及时（Toast、加载状态）
- [ ] 移动端适配良好
- [ ] 无明显 Bug 和卡顿

#### 数据验收
- [ ] 购物车状态正确持久化（页面刷新不丢失）
- [ ] Credit 计算准确（10:1 比例）
- [ ] 订单明细完整记录所有商品信息

------

## 需求 2: Credit 积分商城

### 2.1 需求背景

**现状问题**：
- V0.1 版本中，Credit 只能通过质押转换为 Share，功能单一
- 用户获得的 Credit 缺少即时消费场景，资产流动性不足
- 无法体现 Credit 作为平台通用积分的价值

**改进目标**：
> 赋予 Credit 积分兑换功能，让用户可以用 Credit 兑换心仪的商品，增强资产实用性和用户粘性

### 2.2 核心概念

#### Credit 的双重属性
1. **投资属性**: Credit → Stake → Share → 收益分配
2. **消费属性**: Credit → 积分兑换 → 获得商品（新增）

#### 与购物商城的区别
| 维度 | 购物商城 (`/merchants`) | 积分商城 (`/rewards`) |
|------|------------------------|----------------------|
| 支付方式 | USDT（法币） | Credit（积分） |
| 用户目的 | 消费获得 Credit | 消耗 Credit 获得商品 |
| Credit 流向 | 平台 → 用户 | 用户 → 平台 |
| 商品来源 | 各商家店铺 | 平台精选兑换品 |
| 商品数量 | 每店铺 6 个 | 全平台精选 8-10 个 |

### 2.3 页面结构设计

#### 2.3.1 导航更新

**当前导航**：
```
首页 | 商家 | 资产 | 市场
```

**更新后导航**：
```
首页 | 商家 | 积分商城 | 资产 | 市场
```

**路由映射**：
- 首页: `/`
- 商家: `/merchants`
- 积分商城: `/rewards` (新增)
- 资产: `/dashboard`
- 市场: `/market`

#### 2.3.2 积分商城页面 (`/rewards`) - 新增

**页面布局**：
```
┌─────────────────────────────────────┐
│  Header + User Info (Credit余额)    │
├─────────────────────────────────────┤
│                                     │
│  页面标题                            │
│  ┌─────────────────────────────┐   │
│  │ 🎁 积分商城                 │   │
│  │ 用 Credit 兑换心仪好物       │   │
│  │                             │   │
│  │ 当前积分: 1,234.5 Credit    │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  商家筛选 (可选)                     │
│  [全部] [母婴] [珠宝] [餐饮] ...    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  兑换商品网格 (3-4列)                │
│                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ │
│  │ 图片   │ │ 图片   │ │ 图片   │ │
│  │ 商品名 │ │ 商品名 │ │ 商品名 │ │
│  │ 86 C   │ │ 240 C  │ │ 410 C  │ │
│  │[立即兑换]│[立即兑换]│[立即兑换]│ │
│  └────────┘ └────────┘ └────────┘ │
│                                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ │
│  │ 图片   │ │ 图片   │ │ 图片   │ │
│  │ 商品名 │ │ 商品名 │ │ 商品名 │ │
│  │ 57 C   │ │ 62 C   │ │ 270 C  │ │
│  │[立即兑换]│[立即兑换]│[立即兑换]│ │
│  └────────┘ └────────┘ └────────┘ │
│                                     │
└─────────────────────────────────────┘

注: C = Credit
```

**交互逻辑**：
- 点击商家筛选标签，筛选对应商家的兑换商品
- 点击 `[立即兑换]` 按钮，弹出兑换确认弹窗
- 积分不足时，按钮显示为禁用状态，提示"积分不足"

#### 2.3.3 兑换确认弹窗 (Modal) - 新增

**触发方式**：
- 积分商城页面点击 `[立即兑换]`

**弹窗布局**：
```
┌─────────────────────────────────┐
│  确认兑换                   [×] │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │ [商品图片]              │   │
│  └─────────────────────────┘   │
│                                 │
│  商品名称: Ealing 4合1滑梯秋千  │
│  所需积分: 86.9 Credit          │
│  来源商家: Ealing 母婴旗舰店    │
│                                 │
│  ─────────────────────────      │
│  当前积分: 1,234.5 Credit       │
│  兑换后剩余: 1,147.6 Credit     │
│                                 │
│  💡 提示: 兑换后商品将发送到您的 │
│     注册地址，请确保地址正确     │
│                                 │
│  [取消]  [确认兑换]             │
│                                 │
└─────────────────────────────────┘
```

**确认后流程**：
1. 显示兑换加载动画（模拟处理）
2. 成功提示 Toast: "兑换成功！商品将在 3-5 个工作日内发货"
3. 扣除用户 Credit 余额
4. 添加兑换记录到订单历史
5. 添加活动记录到活动列表
6. 自动跳转到 `/dashboard` 资产页面

### 2.4 兑换经济模型

#### Credit 获取与兑换比例

**获取 Credit**（购物商城）：
```
消费 $100 USDT → 获得 10 Credit
比例: 10:1
```

**兑换商品**（积分商城）：
```
10 Credit → 兑换价值 $10 的商品
比例: 1:1
```

**完整闭环**：
```
消费 $100 → 获得 10 Credit → 兑换价值 $10 的商品
相当于: 10% 返现
```

**示例**：
- 用户在星巴克消费 $320 → 获得 32 Credit
- 用户用 32 Credit → 兑换美式咖啡（价值 $32）
- 用户在母婴店消费 $8690 → 获得 869 Credit
- 用户用 869 Credit → 兑换 Ealing 4合1滑梯秋千（价值 $869）

### 2.5 Mock 数据设计

#### 2.5.1 兑换商品配置

从 5 个商家中精选 7 个兑换商品，重点展示母婴和珠宝两个新商户：

**1. 母婴用品店（重点展示）- 2 个商品**
```typescript
{
  id: 'reward-baby-1',
  productId: 'bb-1',
  merchantId: 'baby',
  merchantName: 'Ealing 母婴旗舰店',
  name: 'Ealing 4合1滑梯秋千套装',
  originalPrice: 869,      // 商品原价 (USDT)
  creditCost: 869,         // 兑换所需 Credit (1:1)
  image: '/products/baby/bb-1.jpeg',
  category: '母婴',
  stock: 50
},
{
  id: 'reward-baby-2',
  productId: 'bb-3',
  merchantId: 'baby',
  merchantName: 'Ealing 母婴旗舰店',
  name: 'Ealing 3合1婴儿学步车',
  originalPrice: 579,
  creditCost: 579,
  image: '/products/baby/bb-3.jpeg',
  category: '母婴',
  stock: 50
}
```

**2. 珠宝钻石店（重点展示）- 2 个商品**
```typescript
{
  id: 'reward-jewelry-1',
  productId: 'jw-1',
  merchantId: 'jewelry',
  merchantName: 'DIMD 珠宝精品',
  name: '18K白金橄榄石戒指',
  originalPrice: 4100,
  creditCost: 4100,
  image: '待提供',
  category: '奢侈品',
  stock: 10
},
{
  id: 'reward-jewelry-2',
  productId: 'jw-2',
  merchantId: 'jewelry',
  merchantName: 'DIMD 珠宝精品',
  name: '18K白红金粉红宝石戒指',
  originalPrice: 2400,
  creditCost: 2400,
  image: '待提供',
  category: '奢侈品',
  stock: 10
}
```

**3. 星巴克咖啡 - 1 个商品**
```typescript
{
  id: 'reward-starbucks-1',
  productId: 'sb-1',
  merchantId: 'starbucks',
  merchantName: '星巴克咖啡',
  name: '☕ 美式咖啡',
  originalPrice: 32,
  creditCost: 32,
  image: 'emoji:☕',
  category: '餐饮',
  stock: 999
}
```

**4. Nike 运动 - 1 个商品**
```typescript
{
  id: 'reward-nike-1',
  productId: 'nk-1',
  merchantId: 'nike',
  merchantName: 'Nike 运动',
  name: '👟 Air Max 运动鞋',
  originalPrice: 899,
  creditCost: 899,
  image: 'emoji:👟',
  category: '运动',
  stock: 100
}
```

**5. Apple Store - 1 个商品**
```typescript
{
  id: 'reward-apple-1',
  productId: 'ap-1',
  merchantId: 'apple',
  merchantName: 'Apple Store',
  name: '🎧 AirPods Pro',
  originalPrice: 1999,
  creditCost: 1999,
  image: 'emoji:🎧',
  category: '电子产品',
  stock: 50
}
```

**总计**: 7 个兑换商品，Credit 成本范围：32 - 4100

#### 2.5.2 商品展示优先级

**页面展示顺序**（从左到右，从上到下）：
1. Ealing 4合1滑梯秋千套装（869 Credit）- 母婴 ⭐
2. 18K白金橄榄石戒指（4100 Credit）- 珠宝 ⭐
3. 18K白红金粉红宝石戒指（2400 Credit）- 珠宝 ⭐
4. 🎧 AirPods Pro（1999 Credit）- 电子产品
5. 👟 Air Max 运动鞋（899 Credit）- 运动
6. Ealing 3合1婴儿学步车（579 Credit）- 母婴 ⭐
7. ☕ 美式咖啡（32 Credit）- 餐饮

**注**: ⭐ 标记为重点展示商品（母婴和珠宝）

### 2.6 数据结构设计

#### 2.6.1 兑换商品数据模型

```typescript
interface RewardProduct {
  id: string;              // 兑换商品唯一标识
  productId: string;       // 关联的原商品 ID
  merchantId: string;      // 所属商家 ID
  merchantName: string;    // 商家名称
  name: string;            // 商品名称
  originalPrice: number;   // 商品原价 (USDT)
  creditCost: number;      // 兑换所需 Credit
  image: string;           // 商品图片 URL
  category: string;        // 商品分类
  stock: number;           // 兑换库存
  description?: string;    // 商品描述（可选）
}
```

#### 2.6.2 兑换记录数据模型

```typescript
interface RedemptionRecord {
  id: string;              // 兑换记录 ID
  userId: string;          // 用户 ID
  rewardProductId: string; // 兑换商品 ID
  productName: string;     // 商品名称
  merchantName: string;    // 商家名称
  creditCost: number;      // 消耗的 Credit
  timestamp: number;       // 兑换时间戳
  status: 'pending' | 'shipped' | 'delivered'; // 兑换状态
  trackingNumber?: string; // 物流单号（可选）
}
```

#### 2.6.3 活动记录扩展

```typescript
interface Activity {
  // ... 原有字段 ...

  type: 'credit_earned' | 'credit_staked' | 'share_bought' | 'credit_redeemed'; // 新增类型

  // 兑换相关字段（当 type = 'credit_redeemed' 时）
  rewardProductName?: string;  // 兑换的商品名称
  creditSpent?: number;        // 消耗的 Credit
}
```

### 2.7 组件设计

#### 2.7.1 新增组件列表

| 组件名 | 文件路径 | 用途 | 复用性 |
|--------|----------|------|--------|
| `RewardProductCard` | `components/RewardProductCard.tsx` | 兑换商品卡片 | 积分商城页 |
| `RedemptionModal` | `components/RedemptionModal.tsx` | 兑换确认弹窗 | 积分商城页 |
| `CategoryFilter` | `components/CategoryFilter.tsx` | 商家分类筛选 | 积分商城页 |
| `CreditBalance` | `components/CreditBalance.tsx` | Credit 余额展示 | 多页面复用 |

#### 2.7.2 RewardProductCard 组件

```typescript
interface RewardProductCardProps {
  product: RewardProduct;
  userCredit: number;
  onRedeem: (product: RewardProduct) => void;
}

// 组件结构
<div className="reward-product-card">
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
  <p className="merchant">{product.merchantName}</p>
  <div className="price-info">
    <span className="credit-cost">{product.creditCost} Credit</span>
    <span className="original-price">价值 ${product.originalPrice}</span>
  </div>
  <button
    onClick={() => onRedeem(product)}
    disabled={userCredit < product.creditCost}
  >
    {userCredit < product.creditCost ? '积分不足' : '立即兑换'}
  </button>
</div>
```

**交互效果**：
- Hover 时卡片轻微上浮 + 阴影加深
- 积分不足时按钮禁用，显示灰色
- 点击"立即兑换"后弹出确认弹窗

#### 2.7.3 RedemptionModal 组件

```typescript
interface RedemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: RewardProduct;
  userCredit: number;
  onConfirm: (productId: string) => void;
}
```

**动画效果**：
- 弹窗淡入淡出（Framer Motion）
- 背景遮罩淡入淡出
- 确认后显示成功动画

#### 2.7.4 CategoryFilter 组件

```typescript
interface CategoryFilterProps {
  categories: string[];      // 分类列表
  activeCategory: string;    // 当前选中分类
  onCategoryChange: (category: string) => void;
}

// 分类列表
const categories = ['全部', '母婴', '珠宝', '餐饮', '运动', '电子产品'];
```

**交互效果**：
- 选中分类高亮显示
- 点击分类筛选对应商品
- 平滑的切换动画

### 2.8 状态管理扩展

#### 2.8.1 Zustand Store 新增字段

```typescript
// lib/store.ts
interface AppState {
  // ... 原有字段 ...

  // 新增：兑换记录
  redemptions: RedemptionRecord[];

  // 新增：兑换操作
  redeemProduct: (productId: string, productName: string, merchantName: string, creditCost: number) => void;

  // 新增：获取用户兑换历史
  getUserRedemptions: () => RedemptionRecord[];
}
```

#### 2.8.2 兑换操作逻辑

```typescript
// 兑换商品
redeemProduct: (productId, productName, merchantName, creditCost) => {
  // 检查 Credit 余额
  if (user.credit < creditCost) {
    showToast('Credit 余额不足');
    return;
  }

  // 扣除 Credit
  user.credit -= creditCost;

  // 创建兑换记录
  const redemption = {
    id: generateRedemptionId(),
    userId: user.address,
    rewardProductId: productId,
    productName,
    merchantName,
    creditCost,
    timestamp: Date.now(),
    status: 'pending'
  };

  // 添加兑换记录
  redemptions.push(redemption);

  // 添加活动记录
  activities.push({
    type: 'credit_redeemed',
    rewardProductName: productName,
    creditSpent: creditCost,
    timestamp: Date.now()
  });

  // 显示成功提示
  showToast('兑换成功！商品将在 3-5 个工作日内发货');

  // 跳转到资产页面
  router.push('/dashboard');
}
```

### 2.9 交互细节与动画

#### 2.9.1 关键动画效果

| 场景 | 动画效果 | 实现方案 |
|------|----------|----------|
| 页面进入 | 商品卡片依次淡入 | Framer Motion stagger |
| 商品卡片 Hover | 上浮 + 阴影 | CSS Transform |
| 分类切换 | 商品网格淡出淡入 | Framer Motion |
| 兑换确认 | 弹窗缩放淡入 | Framer Motion |
| 兑换成功 | Credit 减少动画 | react-countup |
| 积分不足 | 按钮抖动提示 | CSS Animation |

#### 2.9.2 用户反馈

**Toast 提示**：
- 兑换成功
- 积分不足
- 兑换失败（网络错误等）

**加载状态**：
- 兑换时显示加载动画（模拟处理 1-2秒）

**空状态**：
- 筛选后无商品时显示空状态插图 + 提示文案

### 2.10 响应式设计

#### 桌面端 (≥768px)
- 商品网格：3-4列布局
- 商品卡片：正常尺寸
- 分类筛选：横向排列

#### 移动端 (<768px)
- 商品网格：2列布局
- 商品卡片：紧凑尺寸
- 分类筛选：横向滚动

### 2.11 开发任务拆解

#### Phase 1: 数据层 (0.5天)
- [ ] 创建 RewardProduct 数据模型
- [ ] 创建 7 个兑换商品的 Mock 数据
- [ ] 扩展 Zustand Store，添加兑换状态和操作
- [ ] 实现兑换逻辑（检查余额、扣除 Credit、创建记录）

#### Phase 2: 积分商城页面 (1天)
- [ ] 创建 `/rewards` 路由页面
- [ ] 实现页面头部（标题 + Credit 余额展示）
- [ ] 实现 CategoryFilter 组件
- [ ] 实现 RewardProductCard 组件
- [ ] 实现商品网格布局（3-4列）
- [ ] 实现分类筛选功能

#### Phase 3: 兑换功能 (1天)
- [ ] 实现 RedemptionModal 组件
- [ ] 实现兑换确认弹窗
- [ ] 实现兑换逻辑（扣除 Credit、创建记录）
- [ ] 实现兑换成功动画和提示
- [ ] 实现积分不足状态处理
- [ ] 实现自动跳转到资产页面

#### Phase 4: 导航更新 (0.5天)
- [ ] 更新 Header 组件，添加"积分商城"导航项
- [ ] 实现导航高亮状态
- [ ] 测试导航跳转

#### Phase 5: 优化与测试 (1天)
- [ ] 添加所有动画效果
- [ ] 响应式适配（移动端）
- [ ] 空状态处理
- [ ] 错误处理
- [ ] 完整流程测试
- [ ] 性能优化

**预计总工时**: 4 天

### 2.12 验收标准

#### 功能验收
- [ ] 导航栏正确显示"积分商城"入口
- [ ] 积分商城页面展示 7 个兑换商品
- [ ] 商品卡片正确显示商品信息和所需 Credit
- [ ] 分类筛选功能正常工作
- [ ] Credit 余额正确显示
- [ ] 积分不足时按钮禁用，提示"积分不足"
- [ ] 积分充足时可以正常兑换
- [ ] 兑换后 Credit 正确扣除
- [ ] 兑换记录和活动记录正确生成

#### 体验验收
- [ ] 所有动画流畅自然
- [ ] 交互反馈及时（Toast、加载状态）
- [ ] 移动端适配良好
- [ ] 无明显 Bug 和卡顿

#### 数据验收
- [ ] Credit 扣除计算准确（1:1 比例）
- [ ] 兑换记录完整记录所有信息
- [ ] 活动列表正确显示兑换活动

#### 业务验收
- [ ] 母婴和珠宝商品在页面中突出展示
- [ ] 兑换经济模型符合预期（10% 返现）
- [ ] 用户可以理解 Credit 的双重属性（投资 + 消费）

------

## 开发优先级

### 第一阶段：核心功能（5-6天）
1. **需求 1: 商城购物体验升级**（5-6天）
   - 优先级：⭐⭐⭐⭐⭐
   - 理由：这是用户获得 Credit 的核心入口，必须优先完成

### 第二阶段：增值功能（4天）
2. **需求 2: Credit 积分商城**（4天）
   - 优先级：⭐⭐⭐⭐
   - 理由：赋予 Credit 消费属性，增强用户粘性
   - 依赖：需求 1 完成后，用户才能获得足够的 Credit 进行兑换

### 总计开发时间：9-10 天

------

## 附录

### A. 文件结构变更

```
app/
├── rewards/
│   └── page.tsx          # 积分商城页面（新增）
├── merchants/
│   └── [id]/
│       └── page.tsx      # 店铺详情页（新增）

components/
├── ProductCard.tsx       # 商品卡片（新增）
├── ShoppingCartDrawer.tsx # 购物车抽屉（新增）
├── CartItem.tsx          # 购物车商品项（新增）
├── CartFloatingButton.tsx # 购物车浮动按钮（新增）
├── CheckoutModal.tsx     # 结算确认弹窗（新增）
├── RewardProductCard.tsx # 兑换商品卡片（新增）
├── RedemptionModal.tsx   # 兑换确认弹窗（新增）
├── CategoryFilter.tsx    # 分类筛选（新增）
└── CreditBalance.tsx     # Credit 余额展示（新增）

lib/
├── mock-data.ts          # Mock 数据（扩展）
└── store.ts              # Zustand Store（扩展）

public/
└── products/
    ├── baby/             # 母婴商品图片（新增）
    └── jewelry/          # 珠宝商品图片（新增）
```

### B. 技术栈确认

- **框架**: Next.js 16 (App Router)
- **状态管理**: Zustand
- **样式**: Tailwind CSS v4 + Material Design 3
- **动画**: Framer Motion
- **图表**: Recharts
- **图标**: Lucide React
- **数字动画**: react-countup
- **TypeScript**: 严格模式

### C. 关键技术决策

1. **购物车实现方式**: 侧边抽屉（Drawer）而非独立页面
   - 理由：更符合现代电商体验，减少页面跳转

2. **商品详情页**: 不实现独立的商品详情页
   - 理由：Demo 场景下，商品信息在卡片中已足够展示

3. **积分商城位置**: 独立页面 `/rewards`
   - 理由：与购物商城区分开，避免用户混淆

4. **兑换比例**: 1 Credit = $1 商品价值
   - 理由：简单直观，相当于 10% 返现

5. **Mock 数据**: 所有数据均为 Mock，不涉及真实后端
   - 理由：Demo 演示目的，快速开发

------

## 版本历史

- **v0.2** (2026-02-06): 添加需求 1 和需求 2
- **v0.1** (2025-XX-XX): 初始版本（黑客松 Demo）

