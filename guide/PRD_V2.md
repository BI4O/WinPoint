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
3. **RWA 交易市场升级** - 从简化的买卖列表升级为专业的交易所界面

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

## 需求 3: RWA 交易市场升级

### 3.1 需求背景

**现状问题**：
- V0.1 版本中，市场页面只有简单的买卖订单列表
- 缺少专业交易所的核心功能：订单簿、实时价格、交易深度
- 用户无法直观了解市场供需关系和价格走势
- 交易界面不够专业，缺少交易所应有的信息密度

**改进目标**：
> 将市场页面升级为专业的交易所界面，提供订单簿、实时价格、交易表单等核心功能，提升交易体验

### 3.2 核心改动

#### 交易界面升级
```
V0.1 流程：
市场页面 → 买卖订单列表 → 点击买入/卖出 → 简单表单

V0.2 流程：
市场页面 → 交易对选择 → 订单簿展示 → 价格选择 → 交易表单 → 确认交易
```

### 3.3 页面结构设计

#### 3.3.1 市场页面 (`/market`) - 重构

**页面布局**：
```
┌───────────────────────────────────────────────────────────────────────────┐
│  Header + User Info                    💰 61.5184 USDT | 2.4833 RWA      │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Trading Pairs                          Contract Information             │
│  [RWA/USDT ▼]                          0X1E2729EC754...909503D35AE13     │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  [Market Orders] [Project Introduction]    last Traded Price             │
│                                            0.1501 ↑         [Buy] [Sell] │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│                                                         │                 │
│  ┌──────────────────┬──────────────────┐              │  Price          │
│  │  Sell Orders     │  Buy Orders      │              │  ┌────────────┐ │
│  ├──────────────────┼──────────────────┤              │  │ 0.2362     │ │
│  │ Price  Qty Total │ Price  Qty Total │              │  │      USDT  │ │
│  │(USDT) (RWA)(USDT)│(USDT) (RWA)(USDT)│              │  └────────────┘ │
│  ├──────────────────┼──────────────────┤              │                 │
│  │█0.2394 102  24.6 │ 0.1501  61  9.27█│              │  Quantity       │
│  │██0.2393 50  12.0 │ 0.1500 801 120.1██│             │  ┌────────────┐ │
│  │███0.2387 68  16.3│ 0.1211 2150 260.4███│           │  │ 0.001      │ │
│  │████0.2386 117 28 │ 0.1210 2500 302.5████│          │  │       RWA  │ │
│  │██0.2385 49  11.8 │ 0.0900 2258 203.2██│            │  └────────────┘ │
│  │██0.2383 48  11.5 │ 0.0820 3199 262.3██│            │                 │
│  │███0.2381 63  15.0│ 0.0120 6720  80.6███│           │  [25%][50%]    │
│  │███0.2380 60  14.2│ 0.0110 11829 130.1███│          │  [75%][100%]   │
│  │███0.2372 67  16.1│ 0.0100 11770 117.7███│          │  ▓▓▓▓░░░░░░    │
│  │██0.2362 48  11.3 │ 0.0090 13855 124.6██│           │  40%           │
│  └──────────────────┴──────────────────┘              │                 │
│                                                         │  Available      │
│  注：█ 表示浅色背景条，显示订单深度                      │  Balance        │
│      卖单为红色系，买单为绿色系                          │  61.5184 USDT  │
│                                                         │  2.4833 RWA    │
│                                                         │                 │
│                                                         │  Total Order    │
│                                                         │  Amount         │
│                                                         │  0.0002 USDT   │
│                                                         │                 │
│                                                         │  ┌────────────┐ │
│                                                         │  │    Buy     │ │
│                                                         │  └────────────┘ │
│                                                         │                 │
└─────────────────────────────────────────────────────────┴─────────────────┘
```

**功能模块说明**：

1. **顶部信息栏**
   - 左侧：交易对选择器（RWA/USDT 下拉菜单）
   - 右侧上方：**用户余额显示**（新增）
     - 实时显示 USDT 余额
     - 实时显示 RWA 余额
     - 格式：💰 61.5184 USDT | 2.4833 RWA
   - 右侧下方：合约地址信息

2. **控制栏**
   - 左侧：标签页切换（Market Orders / Project Introduction）
   - 中间：最新成交价显示（含涨跌箭头）
   - 右侧：Buy/Sell 切换按钮

3. **主内容区域（左右分栏）**

   **左侧：订单簿 (Order Book) - 约 65% 宽度**
   - **左右并排布局**：
     - 左半部分：卖单列表（Sell Orders，红色系）
     - 右半部分：买单列表（Buy Orders，绿色系）
   - **每列显示三个字段**：
     - Price(USDT) - 价格
     - Quantity(RWA) - 数量
     - Total Amount(USDT) - 总额
   - **深度可视化**：
     - 每行背景有浅色渐变条，长度表示该价格的订单深度
     - 卖单使用红色系渐变（rgba(239, 68, 68, 0.1-0.3)）
     - 买单使用绿色系渐变（rgba(16, 185, 129, 0.1-0.3)）
   - **排序规则**：
     - 卖单：价格从高到低（最低卖价在底部）
     - 买单：价格从高到低（最高买价在顶部）
   - **交互**：点击任意价格自动填充到交易表单

   **右侧：交易表单 - 约 35% 宽度**
   - Price 输入框（USDT）
   - Quantity 输入框（RWA）
   - **百分比快捷按钮**（新增）
     - 四个快捷按钮：25%, 50%, 75%, 100%
     - 点击按钮自动计算并填充对应百分比的数量
   - **百分比进度条**（新增）
     - 可拖动的进度条，实时显示使用余额的百分比
     - 拖动进度条自动更新 Quantity 输入框
     - 显示当前百分比数值（如：40%）
   - Available Balance 显示（USDT 和 RWA 余额）
   - Total Order Amount 显示（自动计算）
   - Buy/Sell 确认按钮（大按钮）

4. **订单历史区域（页面下方）**（新增）

   **标签页切换**：
   - Current Trade（当前交易/挂单）
   - Historical Trade（历史交易）

   **表格列（两个标签页相同）**：
   - Date（日期时间，格式：YYYY-MM-DD HH:mm:ss）
   - Currency（交易对，如 RWA/USDT）
   - Type（类型：Buy/Sell）
     - Buy 显示为绿色
     - Sell 显示为红色
   - Unit Price（单价，如 0.2362 USDT）
   - Unit Quantity（数量，如 0.01 RWA）
   - Total Order Value（订单总额，如 0.0023 USDT）
   - Status（状态）
     - Current Trade：Pending（挂单中）、Partial（部分成交）
     - Historical Trade：Fulfilled（已成交，绿色）、Cancelled（已取消，红色）
   - Action（操作）
     - Current Trade：显示"取消"按钮，点击可取消挂单
     - Historical Trade：可能为空或显示其他操作

   **Current Trade 标签页**：
   - 显示用户当前未成交的挂单
   - 按时间倒序排列（最新的在最上方）
   - 空状态：显示 "No Data" 图标和文字
   - Action 列：显示"取消"按钮，点击后弹出确认对话框

   **Historical Trade 标签页**：
   - 显示用户历史订单（已成交或已取消）
   - 按时间倒序排列（最新的在最上方）
   - 支持分页或无限滚动加载
   - Action 列：通常为空，或显示"查看详情"等操作
   - Total Order Amount 显示（自动计算）
   - Buy/Sell 确认按钮（大按钮）

4. **订单簿 (Order Book)**
   - 左侧：卖单列表（红色，价格从低到高）
   - 右侧：买单列表（绿色，价格从高到低）
   - 点击价格自动填充到交易表单
   - 显示每个价格档位的数量

5. **交易表单**
   - 买入/卖出切换
   - 价格输入（支持市价/限价）
   - 数量输入
   - 显示可用余额
   - 显示订单总额
   - 确认交易按钮

### 3.4 数据结构设计

#### 3.4.1 订单簿数据模型

```typescript
interface OrderBookEntry {
  price: number;           // 价格 (USDT)
  quantity: number;        // 数量 (RWA)
  totalAmount: number;     // 总额 (USDT) = price * quantity
  depth: number;           // 累计深度（用于计算深度百分比）
  depthPercentage: number; // 深度百分比（0-100，用于背景条宽度）
}

interface OrderBook {
  sellOrders: OrderBookEntry[];  // 卖单列表（价格从高到低）
  buyOrders: OrderBookEntry[];   // 买单列表（价格从高到低）
  lastPrice: number;             // 最新成交价
  priceChange24h: number;        // 24h 价格变化
  priceChangePercent24h: number; // 24h 价格变化百分比
}
```

#### 3.4.2 交易对信息模型

```typescript
interface TradingPair {
  symbol: string;          // 交易对符号 (e.g., "RWA/USDT")
  baseAsset: string;       // 基础资产 (e.g., "RWA")
  quoteAsset: string;      // 计价资产 (e.g., "USDT")
  lastPrice: number;       // 最新成交价
  high24h: number;         // 24h 最高价
  low24h: number;          // 24h 最低价
  volume24h: number;       // 24h 成交量
  priceChange24h: number;  // 24h 价格变化
  priceChangePercent24h: number; // 24h 价格变化百分比
}
```

#### 3.4.3 合约信息模型

```typescript
interface ContractInfo {
  totalSupply: number;     // 发行总量
  circulatingSupply: number; // 流通量
  volume24h: number;       // 24h 成交量
  marketCap: number;       // 市值
  holders: number;         // 持有地址数
}
```

#### 3.4.4 交易订单模型（扩展）

```typescript
interface TradeOrder {
  id: string;
  userId: string;
  currency: string;          // 交易对 (e.g., "RWA/USDT")
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit'; // 市价单/限价单
  price: number;             // 单价
  quantity: number;          // 数量
  filled: number;            // 已成交数量
  remaining: number;         // 剩余数量
  totalValue: number;        // 订单总额
  status: 'pending' | 'partial' | 'fulfilled' | 'cancelled';
  timestamp: number;         // 创建时间
  completedAt?: number;      // 完成时间（可选）
  expiresAt?: number;        // 订单过期时间（可选）
}
```

**状态说明**：
- `pending`：挂单中（未成交）
- `partial`：部分成交
- `fulfilled`：已完全成交
- `cancelled`：已取消

### 3.5 Mock 数据设计

#### 3.5.1 交易对信息

```typescript
const mockTradingPair: TradingPair = {
  symbol: 'RWA/USDT',
  baseAsset: 'RWA',
  quoteAsset: 'USDT',
  lastPrice: 0.1501,
  high24h: 0.2500,
  low24h: 0.0090,
  volume24h: 50000,
  priceChange24h: 0.0050,
  priceChangePercent24h: 3.44
};
```

#### 3.5.2 合约信息

```typescript
const mockContractInfo: ContractInfo = {
  totalSupply: 1000000,
  circulatingSupply: 500000,
  volume24h: 50000,
  marketCap: 75050, // lastPrice * circulatingSupply
  holders: 1250,
  contractAddress: '0X1E2729EC754...909503D35AE13'
};
```

#### 3.5.3 订单簿数据

```typescript
const mockOrderBook: OrderBook = {
  sellOrders: [
    { price: 0.2394, quantity: 102.9141, totalAmount: 24.6376, depth: 102.9141, depthPercentage: 20 },
    { price: 0.2393, quantity: 50.2520, totalAmount: 12.0253, depth: 153.1661, depthPercentage: 40 },
    { price: 0.2387, quantity: 68.7001, totalAmount: 16.3987, depth: 221.8662, depthPercentage: 60 },
    { price: 0.2386, quantity: 117.3651, totalAmount: 28.0033, depth: 339.2313, depthPercentage: 80 },
    { price: 0.2385, quantity: 49.5512, totalAmount: 11.8179, depth: 388.7825, depthPercentage: 50 },
    { price: 0.2383, quantity: 48.4477, totalAmount: 11.5450, depth: 437.2302, depthPercentage: 45 },
    { price: 0.2381, quantity: 63.0381, totalAmount: 15.0093, depth: 500.2683, depthPercentage: 65 },
    { price: 0.2380, quantity: 60.0674, totalAmount: 14.2960, depth: 560.3357, depthPercentage: 60 },
    { price: 0.2372, quantity: 67.9913, totalAmount: 16.1275, depth: 628.3270, depthPercentage: 70 },
    { price: 0.2362, quantity: 48.0127, totalAmount: 11.3405, depth: 676.3397, depthPercentage: 50 }
  ],
  buyOrders: [
    { price: 0.1501, quantity: 61.7674, totalAmount: 9.2712, depth: 61.7674, depthPercentage: 15 },
    { price: 0.1500, quantity: 801.1733, totalAmount: 120.1759, depth: 862.9407, depthPercentage: 85 },
    { price: 0.1211, quantity: 2150.9884, totalAmount: 260.4846, depth: 3013.9291, depthPercentage: 100 },
    { price: 0.1210, quantity: 2500.0000, totalAmount: 302.5000, depth: 5513.9291, depthPercentage: 100 },
    { price: 0.0900, quantity: 2258.1122, totalAmount: 203.2300, depth: 7772.0413, depthPercentage: 90 },
    { price: 0.0820, quantity: 3199.8109, totalAmount: 262.3844, depth: 10971.8522, depthPercentage: 95 },
    { price: 0.0120, quantity: 6720.8166, totalAmount: 80.6497, depth: 17692.6688, depthPercentage: 70 },
    { price: 0.0110, quantity: 11829.4454, totalAmount: 130.1238, depth: 29522.1142, depthPercentage: 80 },
    { price: 0.0100, quantity: 11770.1800, totalAmount: 117.7018, depth: 41292.2942, depthPercentage: 75 },
    { price: 0.0090, quantity: 13855.5555, totalAmount: 124.6999, depth: 55147.8497, depthPercentage: 85 }
  ],
  lastPrice: 0.1501,
  priceChange24h: 0.0050,
  priceChangePercent24h: 3.44
};
```

**注意事项**：
- 卖单价格从高到低排列（最高卖价在顶部，最低卖价在底部）
- 买单价格从高到低排列（最高买价在顶部，最低买价在底部）
- `totalAmount` = `price` × `quantity`，表示该档位的总金额
- `depth` 为累计数量，用于计算市场深度
- `depthPercentage` 用于订单簿深度可视化（背景色渐变条的宽度百分比）
- 卖单使用红色系背景，买单使用绿色系背景

#### 3.5.4 用户订单历史数据（新增）

```typescript
const mockUserOrders: TradeOrder[] = [
  {
    id: 'order-001',
    userId: 'user-123',
    currency: 'RWA/USDT',
    type: 'buy',
    orderType: 'limit',
    price: 0.2362,
    quantity: 0.01,
    filled: 0.01,
    remaining: 0,
    totalValue: 0.0023,
    status: 'fulfilled',
    timestamp: new Date('2026-02-06 16:12:38').getTime(),
    completedAt: new Date('2026-02-06 16:12:40').getTime()
  },
  {
    id: 'order-002',
    userId: 'user-123',
    currency: 'RWA/USDT',
    type: 'buy',
    orderType: 'limit',
    price: 0.2,
    quantity: 10,
    filled: 0,
    remaining: 10,
    totalValue: 2,
    status: 'cancelled',
    timestamp: new Date('2026-01-28 17:18:13').getTime(),
    completedAt: new Date('2026-01-28 17:20:00').getTime()
  },
  {
    id: 'order-003',
    userId: 'user-123',
    currency: 'RWA/USDT',
    type: 'sell',
    orderType: 'limit',
    price: 0.2315,
    quantity: 0.0099,
    filled: 0,
    remaining: 0.0099,
    totalValue: 0.0022,
    status: 'cancelled',
    timestamp: new Date('2026-02-05 15:49:56').getTime(),
    completedAt: new Date('2026-02-05 15:50:10').getTime()
  },
  {
    id: 'order-004',
    userId: 'user-123',
    currency: 'RWA/USDT',
    type: 'buy',
    orderType: 'limit',
    price: 0.2197,
    quantity: 0.0106,
    filled: 0,
    remaining: 0.0106,
    totalValue: 0.0023,
    status: 'cancelled',
    timestamp: new Date('2026-02-05 15:49:56').getTime(),
    completedAt: new Date('2026-02-05 15:50:05').getTime()
  },
  {
    id: 'order-005',
    userId: 'user-123',
    currency: 'RWA/USDT',
    type: 'buy',
    orderType: 'limit',
    price: 0.2245,
    quantity: 0.0103,
    filled: 0,
    remaining: 0.0103,
    totalValue: 0.0023,
    status: 'cancelled',
    timestamp: new Date('2026-02-05 15:49:48').getTime(),
    completedAt: new Date('2026-02-05 15:50:00').getTime()
  }
];

// 当前挂单（从 mockUserOrders 中筛选 status 为 pending 或 partial 的订单）
const mockCurrentOrders = mockUserOrders.filter(
  order => order.status === 'pending' || order.status === 'partial'
);

// 历史订单（从 mockUserOrders 中筛选 status 为 fulfilled 或 cancelled 的订单）
const mockHistoricalOrders = mockUserOrders.filter(
  order => order.status === 'fulfilled' || order.status === 'cancelled'
);
```

### 3.6 组件设计

#### 3.6.1 新增/重构组件列表

| 组件名 | 文件路径 | 用途 | 复用性 |
|--------|----------|------|--------|
| `BalanceDisplay` | `components/BalanceDisplay.tsx` | 余额显示（右上角） | 市场页面 |
| `TradingPairSelector` | `components/TradingPairSelector.tsx` | 交易对选择器 | 市场页面 |
| `ContractInfoPanel` | `components/ContractInfoPanel.tsx` | 合约信息面板 | 市场页面 |
| `OrderBook` | `components/OrderBook.tsx` | 订单簿展示 | 市场页面 |
| `OrderBookEntry` | `components/OrderBookEntry.tsx` | 订单簿单行 | 订单簿组件 |
| `TradingForm` | `components/TradingForm.tsx` | 交易表单 | 市场页面 |
| `PercentageSlider` | `components/PercentageSlider.tsx` | 百分比进度条 | 交易表单 |
| `OrderHistoryTabs` | `components/OrderHistoryTabs.tsx` | 订单历史标签页 | 市场页面 |
| `OrderHistoryTable` | `components/OrderHistoryTable.tsx` | 订单历史表格 | 订单历史标签页 |
| `MarketTabs` | `components/MarketTabs.tsx` | 市场标签页 | 市场页面 |
| `ProjectIntro` | `components/ProjectIntro.tsx` | 项目介绍 | 市场页面 |

#### 3.6.2 BalanceDisplay 组件（新增）

```typescript
interface BalanceDisplayProps {
  usdtBalance: number;
  rwaBalance: number;
}

// 组件结构
<div className="balance-display">
  <Wallet size={16} className="icon" />
  <span className="balance-item">
    {usdtBalance.toFixed(4)} USDT
  </span>
  <span className="separator">|</span>
  <span className="balance-item">
    {rwaBalance.toFixed(4)} RWA
  </span>
</div>
```

**样式说明**：
- 固定在页面右上角
- 使用半透明背景，确保可读性
- 余额数字使用等宽字体
- 实时更新，交易后立即刷新

#### 3.6.3 TradingPairSelector 组件

```typescript
interface TradingPairSelectorProps {
  tradingPair: TradingPair;
  onPairChange?: (pair: string) => void;
}

// 组件结构
<div className="trading-pair-selector">
  <div className="pair-dropdown">
    <span className="symbol">{tradingPair.symbol}</span>
    <ChevronDown size={16} />
  </div>
  <div className="price-info">
    <span className="last-price">${tradingPair.lastPrice}</span>
    <span className={`price-change ${tradingPair.priceChange24h >= 0 ? 'positive' : 'negative'}`}>
      {tradingPair.priceChange24h >= 0 ? '+' : ''}
      {tradingPair.priceChangePercent24h.toFixed(2)}%
    </span>
  </div>
</div>
```

#### 3.6.3 OrderBook 组件

```typescript
interface OrderBookProps {
  orderBook: OrderBook;
  onPriceClick: (price: number) => void;
}

// 组件结构 - 左右并排布局
<div className="order-book">
  <div className="order-book-container">
    {/* 左侧：卖单 */}
    <div className="sell-orders-column">
      <div className="column-header">
        <span>Sell Orders</span>
      </div>
      <div className="column-labels">
        <span>Price(USDT)</span>
        <span>Quantity(RWA)</span>
        <span>Total Amount(USDT)</span>
      </div>
      <div className="orders-list">
        {orderBook.sellOrders.map(order => (
          <OrderBookEntry
            key={order.price}
            order={order}
            type="sell"
            onClick={() => onPriceClick(order.price)}
          />
        ))}
      </div>
    </div>

    {/* 右侧：买单 */}
    <div className="buy-orders-column">
      <div className="column-header">
        <span>Buy Orders</span>
      </div>
      <div className="column-labels">
        <span>Price(USDT)</span>
        <span>Quantity(RWA)</span>
        <span>Total Amount(USDT)</span>
      </div>
      <div className="orders-list">
        {orderBook.buyOrders.map(order => (
          <OrderBookEntry
            key={order.price}
            order={order}
            type="buy"
            onClick={() => onPriceClick(order.price)}
          />
        ))}
      </div>
    </div>
  </div>
</div>
```

**OrderBookEntry 组件**：

```typescript
interface OrderBookEntryProps {
  order: OrderBookEntry;
  type: 'buy' | 'sell';
  onClick: () => void;
}

// 组件结构 - 带深度可视化背景
<div
  className={`order-book-entry ${type}`}
  onClick={onClick}
  style={{
    background: `linear-gradient(to left,
      ${type === 'sell'
        ? `rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.15) ${order.depthPercentage}%, transparent ${order.depthPercentage}%`
        : `rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.15) ${order.depthPercentage}%, transparent ${order.depthPercentage}%`
      }
    )`
  }}
>
  <span className="price">{order.price.toFixed(4)}</span>
  <span className="quantity">{order.quantity.toFixed(4)}</span>
  <span className="total">{order.totalAmount.toFixed(4)}</span>
</div>
```

**样式说明**：
- 卖单和买单左右并排，各占 50% 宽度
- 每行显示三列：Price, Quantity, Total Amount
- 背景渐变条从右向左，长度由 `depthPercentage` 控制
- 卖单使用红色系 `rgba(239, 68, 68, 0.15)`
- 买单使用绿色系 `rgba(16, 185, 129, 0.15)`
- Hover 时整行高亮，光标变为 pointer

#### 3.6.5 TradingForm 组件（更新）

```typescript
interface TradingFormProps {
  tradingPair: TradingPair;
  userBalance: {
    base: number;  // RWA 余额
    quote: number; // USDT 余额
  };
  onTrade: (order: TradeOrder) => void;
}

// 组件结构
<div className="trading-form">
  <div className="trade-type-tabs">
    <button className={`tab ${tradeType === 'buy' ? 'active' : ''}`}>
      买入 Buy
    </button>
    <button className={`tab ${tradeType === 'sell' ? 'active' : ''}`}>
      卖出 Sell
    </button>
  </div>

  <div className="form-content">
    <div className="form-field">
      <label>价格 (USDT)</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="输入价格"
      />
    </div>

    <div className="form-field">
      <label>数量 (RWA)</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="输入数量"
      />
    </div>

    {/* 新增：百分比进度条组件 */}
    <PercentageSlider
      percentage={percentage}
      onPercentageChange={handlePercentageChange}
      tradeType={tradeType}
    />

    <div className="balance-info">
      <span>可用余额:</span>
      <span>{tradeType === 'buy' ? userBalance.quote : userBalance.base} {tradeType === 'buy' ? 'USDT' : 'RWA'}</span>
    </div>

    <div className="total-info">
      <span>订单总额:</span>
      <span>{(price * quantity).toFixed(2)} USDT</span>
    </div>

    <button
      className={`trade-button ${tradeType}`}
      onClick={handleTrade}
      disabled={!isValid}
    >
      确认{tradeType === 'buy' ? '买入' : '卖出'}
    </button>
  </div>
</div>
```

#### 3.6.6 PercentageSlider 组件（新增）

```typescript
interface PercentageSliderProps {
  percentage: number;           // 当前百分比 (0-100)
  onPercentageChange: (percentage: number) => void;
  tradeType: 'buy' | 'sell';
}

// 组件结构
<div className="percentage-slider">
  {/* 快捷按钮 */}
  <div className="quick-buttons">
    <button
      className={`quick-btn ${percentage === 25 ? 'active' : ''}`}
      onClick={() => onPercentageChange(25)}
    >
      25%
    </button>
    <button
      className={`quick-btn ${percentage === 50 ? 'active' : ''}`}
      onClick={() => onPercentageChange(50)}
    >
      50%
    </button>
    <button
      className={`quick-btn ${percentage === 75 ? 'active' : ''}`}
      onClick={() => onPercentageChange(75)}
    >
      75%
    </button>
    <button
      className={`quick-btn ${percentage === 100 ? 'active' : ''}`}
      onClick={() => onPercentageChange(100)}
    >
      100%
    </button>
  </div>

  {/* 进度条 */}
  <div className="slider-container">
    <input
      type="range"
      min="0"
      max="100"
      step="1"
      value={percentage}
      onChange={(e) => onPercentageChange(Number(e.target.value))}
      className="slider"
    />
    <div className="slider-track">
      <div
        className={`slider-fill ${tradeType}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
    <span className="percentage-label">{percentage}%</span>
  </div>
</div>
```

**功能说明**：
- **快捷按钮**：点击 25%/50%/75%/100% 快速设置百分比
- **进度条**：可拖动的滑块，实时调整百分比
- **百分比显示**：实时显示当前选择的百分比
- **自动计算**：根据百分比自动计算并更新 Quantity 输入框
  - 买入时：`quantity = (balance * percentage / 100) / price`
  - 卖出时：`quantity = balance * percentage / 100`

**样式说明**：
- 快捷按钮采用网格布局（2×2）
- 选中的按钮高亮显示
- 进度条填充颜色根据交易类型变化：
  - 买入：绿色 `rgb(16, 185, 129)`
  - 卖出：红色 `rgb(239, 68, 68)`
- 滑块拖动时有平滑过渡效果

#### 3.6.7 OrderHistoryTabs 组件（新增）

```typescript
interface OrderHistoryTabsProps {
  currentOrders: TradeOrder[];
  historicalOrders: TradeOrder[];
  onCancelOrder: (orderId: string) => void;
}

// 组件结构
<div className="order-history-tabs">
  <div className="tabs-header">
    <button
      className={`tab ${activeTab === 'current' ? 'active' : ''}`}
      onClick={() => setActiveTab('current')}
    >
      Current Trade
    </button>
    <button
      className={`tab ${activeTab === 'historical' ? 'active' : ''}`}
      onClick={() => setActiveTab('historical')}
    >
      Historical Trade
    </button>
  </div>

  <div className="tabs-content">
    {activeTab === 'current' && (
      <OrderHistoryTable
        orders={currentOrders}
        type="current"
        onCancelOrder={onCancelOrder}
      />
    )}
    {activeTab === 'historical' && (
      <OrderHistoryTable
        orders={historicalOrders}
        type="historical"
        onCancelOrder={onCancelOrder}
      />
    )}
  </div>
</div>
```

#### 3.6.8 OrderHistoryTable 组件（新增）

```typescript
interface OrderHistoryTableProps {
  orders: TradeOrder[];
  type: 'current' | 'historical';
  onCancelOrder: (orderId: string) => void;
}

// 组件结构
<div className="order-history-table">
  {orders.length === 0 ? (
    // 空状态
    <div className="empty-state">
      <FileSearch size={48} className="empty-icon" />
      <p>No Data</p>
    </div>
  ) : (
    // 表格
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Currency</th>
          <th>Type</th>
          <th>Unit Price</th>
          <th>Unit Quantity</th>
          <th>Total Order Value</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{formatDate(order.timestamp)}</td>
            <td>{order.currency}</td>
            <td className={`type ${order.type}`}>
              {order.type === 'buy' ? 'Buy' : 'Sell'}
            </td>
            <td>{order.price.toFixed(4)} USDT</td>
            <td>{order.quantity.toFixed(4)} RWA</td>
            <td>{order.totalValue.toFixed(4)} USDT</td>
            <td className={`status ${order.status}`}>
              {formatStatus(order.status)}
            </td>
            <td>
              {type === 'current' && (
                <button
                  className="cancel-btn"
                  onClick={() => onCancelOrder(order.id)}
                >
                  取消
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
```

**样式说明**：
- Type 列：Buy 为绿色，Sell 为红色
- Status 列：
  - Fulfilled 为绿色
  - Cancelled 为红色
  - Pending/Partial 为黄色
- 表格采用斑马纹样式，提高可读性
- 空状态居中显示，带图标和文字
- Action 列的取消按钮为红色，Hover 时加深
      <span>可用余额:</span>
      <span>{tradeType === 'buy' ? userBalance.quote : userBalance.base} {tradeType === 'buy' ? 'USDT' : 'RWA'}</span>
    </div>

    <div className="total-info">
      <span>订单总额:</span>
      <span>{(price * quantity).toFixed(2)} USDT</span>
    </div>

    <button
      className={`trade-button ${tradeType}`}
      onClick={handleTrade}
      disabled={!isValid}
    >
      确认{tradeType === 'buy' ? '买入' : '卖出'}
    </button>
  </div>
</div>
```

### 3.7 状态管理扩展

#### 3.7.1 Zustand Store 新增字段

```typescript
// lib/store.ts
interface AppState {
  // ... 原有字段 ...

  // 新增：交易市场相关
  tradingPair: TradingPair;
  orderBook: OrderBook;
  contractInfo: ContractInfo;
  userOrders: TradeOrder[];        // 所有订单
  currentOrders: TradeOrder[];     // 当前挂单
  historicalOrders: TradeOrder[];  // 历史订单

  // 新增：交易操作
  placeBuyOrder: (price: number, quantity: number) => void;
  placeSellOrder: (price: number, quantity: number) => void;
  cancelOrder: (orderId: string) => void;

  // 新增：订单簿更新（模拟实时更新）
  updateOrderBook: () => void;

  // 新增：订单列表更新
  refreshOrders: () => void;
}
```

#### 3.7.2 交易操作逻辑

```typescript
// 买入 RWA
placeBuyOrder: (price, quantity) => {
  const total = price * quantity;

  // 检查 USDT 余额
  if (user.earnings < total) {
    showToast('USDT 余额不足');
    return;
  }

  // 创建买单
  const order: TradeOrder = {
    id: generateOrderId(),
    userId: user.address,
    type: 'buy',
    orderType: 'limit',
    price,
    quantity,
    filled: 0,
    remaining: quantity,
    total,
    status: 'pending',
    timestamp: Date.now()
  };

  // 模拟订单匹配（简化版）
  const matchedQuantity = Math.min(quantity, getAvailableSellQuantity(price));

  if (matchedQuantity > 0) {
    // 部分或全部成交
    order.filled = matchedQuantity;
    order.remaining = quantity - matchedQuantity;
    order.status = matchedQuantity === quantity ? 'filled' : 'partial';

    // 更新用户资产
    user.earnings -= matchedQuantity * price;
    user.share += matchedQuantity;

    // 添加活动记录
    activities.push({
      type: 'share_bought',
      amount: matchedQuantity,
      price,
      timestamp: Date.now()
    });

    showToast(`买入成功！获得 ${matchedQuantity} RWA`);
  }

  // 添加订单记录
  userOrders.push(order);

  // 更新订单簿
  updateOrderBook();
},

// 卖出 RWA
placeSellOrder: (price, quantity) => {
  // 检查 RWA 余额
  if (user.share < quantity) {
    showToast('RWA 余额不足');
    return;
  }

  // 创建卖单
  const order: TradeOrder = {
    id: generateOrderId(),
    userId: user.address,
    type: 'sell',
    orderType: 'limit',
    price,
    quantity,
    filled: 0,
    remaining: quantity,
    total: price * quantity,
    status: 'pending',
    timestamp: Date.now()
  };

  // 模拟订单匹配
  const matchedQuantity = Math.min(quantity, getAvailableBuyQuantity(price));

  if (matchedQuantity > 0) {
    order.filled = matchedQuantity;
    order.remaining = quantity - matchedQuantity;
    order.status = matchedQuantity === quantity ? 'filled' : 'partial';

    // 更新用户资产
    user.share -= matchedQuantity;
    user.earnings += matchedQuantity * price;

    activities.push({
      type: 'share_sold',
      amount: matchedQuantity,
      price,
      timestamp: Date.now()
    });

    showToast(`卖出成功！获得 ${(matchedQuantity * price).toFixed(2)} USDT`);
  }

  userOrders.push(order);
  updateOrderBook();
  refreshOrders();
},

// 取消订单
cancelOrder: (orderId) => {
  const order = userOrders.find(o => o.id === orderId);

  if (!order) {
    showToast('订单不存在');
    return;
  }

  if (order.status !== 'pending' && order.status !== 'partial') {
    showToast('该订单无法取消');
    return;
  }

  // 更新订单状态
  order.status = 'cancelled';
  order.completedAt = Date.now();

  // 如果是部分成交的订单，退还未成交部分的资金
  if (order.type === 'buy' && order.remaining > 0) {
    user.earnings += order.remaining * order.price;
  } else if (order.type === 'sell' && order.remaining > 0) {
    user.share += order.remaining;
  }

  // 添加活动记录
  activities.push({
    type: 'order_cancelled',
    orderId: order.id,
    timestamp: Date.now()
  });

  showToast('订单已取消');
  refreshOrders();
  updateOrderBook();
},

// 刷新订单列表
refreshOrders: () => {
  currentOrders = userOrders.filter(
    order => order.status === 'pending' || order.status === 'partial'
  );
  historicalOrders = userOrders.filter(
    order => order.status === 'fulfilled' || order.status === 'cancelled'
  ).sort((a, b) => b.timestamp - a.timestamp); // 按时间倒序
}
```

### 3.8 交互细节与动画

#### 3.8.1 关键动画效果

| 场景 | 动画效果 | 实现方案 |
|------|----------|----------|
| 订单簿更新 | 价格闪烁（绿涨红跌） | CSS Animation |
| 价格变化 | 数字滚动动画 | react-countup |
| 订单提交 | 加载动画 + 成功提示 | Framer Motion |
| 订单取消 | 确认对话框 + 成功提示 | Framer Motion |
| 订单簿行 Hover | 背景高亮 | CSS Transition |
| 深度可视化 | 背景渐变条 | CSS Linear Gradient |
| 标签页切换 | 内容淡入淡出 | Framer Motion |
| 表格行 Hover | 背景高亮 | CSS Transition |

#### 3.8.2 订单簿深度可视化

**实现方式**：使用 CSS `linear-gradient` 创建从右向左的渐变背景条

```css
/* 订单簿行基础样式 */
.order-book-entry {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 4px 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

/* Hover 效果 */
.order-book-entry:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 卖单深度背景（红色渐变，从右向左） */
.order-book-entry.sell {
  background: linear-gradient(
    to left,
    rgba(239, 68, 68, 0.15) 0%,
    rgba(239, 68, 68, 0.15) var(--depth-percentage),
    transparent var(--depth-percentage)
  );
}

/* 买单深度背景（绿色渐变，从右向左） */
.order-book-entry.buy {
  background: linear-gradient(
    to left,
    rgba(16, 185, 129, 0.15) 0%,
    rgba(16, 185, 129, 0.15) var(--depth-percentage),
    transparent var(--depth-percentage)
  );
}

/* 价格列样式 */
.order-book-entry .price {
  color: inherit;
  font-weight: 500;
}

.order-book-entry.sell .price {
  color: rgb(239, 68, 68); /* 红色 */
}

.order-book-entry.buy .price {
  color: rgb(16, 185, 129); /* 绿色 */
}
```

**使用方式**：

```typescript
// 在组件中设置 CSS 变量
<div
  className={`order-book-entry ${type}`}
  style={{
    '--depth-percentage': `${order.depthPercentage}%`
  } as React.CSSProperties}
  onClick={onClick}
>
  <span className="price">{order.price.toFixed(4)}</span>
  <span className="quantity">{order.quantity.toFixed(4)}</span>
  <span className="total">{order.totalAmount.toFixed(4)}</span>
</div>
```

**视觉效果**：
- 深度条从右侧开始，向左延伸
- 深度越大，背景条越长
- 卖单使用浅红色 `rgba(239, 68, 68, 0.15)`
- 买单使用浅绿色 `rgba(16, 185, 129, 0.15)`
- Hover 时整行高亮，便于用户点击

#### 3.8.3 价格闪烁效果

```typescript
// 价格上涨时闪烁绿色
const priceFlashUp = keyframes`
  0% { background-color: rgba(16, 185, 129, 0.3); }
  100% { background-color: transparent; }
`;

// 价格下跌时闪烁红色
const priceFlashDown = keyframes`
  0% { background-color: rgba(239, 68, 68, 0.3); }
  100% { background-color: transparent; }
`;
```

### 3.9 响应式设计

#### 桌面端 (≥1024px)
- 订单簿：双列布局（卖单 | 买单）
- 交易表单：固定在右侧
- 合约信息：横向排列

#### 平板端 (768px - 1023px)
- 订单簿：双列布局（紧凑）
- 交易表单：底部固定
- 合约信息：2行2列

#### 移动端 (<768px)
- 订单簿：单列布局，可切换卖单/买单
- 交易表单：全屏抽屉
- 合约信息：纵向堆叠

### 3.10 开发任务拆解

#### Phase 1: 数据层 (1天)
- [ ] 创建交易市场相关数据模型
- [ ] 创建 Mock 订单簿数据
- [ ] 创建 Mock 交易对信息
- [ ] 创建 Mock 合约信息
- [ ] 扩展 Zustand Store，添加交易市场状态

#### Phase 2: 核心组件 (2天)
- [ ] 实现 BalanceDisplay 组件（右上角余额显示）
- [ ] 实现 TradingPairSelector 组件
- [ ] 实现 ContractInfoPanel 组件
- [ ] 实现 OrderBook 组件
- [ ] 实现 OrderBookEntry 组件
- [ ] 实现订单簿深度可视化
- [ ] 实现价格点击填充功能

#### Phase 3: 交易表单 (2天)
- [ ] 实现 TradingForm 组件
- [ ] 实现买入/卖出切换
- [ ] 实现价格和数量输入
- [ ] 实现 PercentageSlider 组件（百分比进度条）
- [ ] 实现快捷百分比按钮（25%/50%/75%/100%）
- [ ] 实现进度条拖动功能
- [ ] 实现百分比自动计算数量逻辑
- [ ] 实现余额检查
- [ ] 实现订单总额计算
- [ ] 实现交易确认逻辑

#### Phase 4: 订单历史功能 (1天)
- [ ] 实现 OrderHistoryTabs 组件
- [ ] 实现 OrderHistoryTable 组件
- [ ] 实现 Current Trade 标签页
- [ ] 实现 Historical Trade 标签页
- [ ] 实现订单列表展示（表格）
- [ ] 实现空状态显示
- [ ] 实现取消订单功能
- [ ] 实现取消确认对话框
- [ ] 实现订单状态颜色显示

#### Phase 5: 标签页功能 (0.5天)
- [ ] 实现 MarketTabs 组件
- [ ] 实现市场订单标签页
- [ ] 实现项目介绍标签页
- [ ] 实现标签页切换动画

#### Phase 6: 交易逻辑 (1天)
- [ ] 实现买入订单逻辑
- [ ] 实现卖出订单逻辑
- [ ] 实现订单匹配逻辑（简化版）
- [ ] 实现订单簿更新逻辑
- [ ] 实现用户订单历史
- [ ] 实现余额实时更新
- [ ] 实现取消订单逻辑
- [ ] 实现订单列表刷新

#### Phase 7: 优化与测试 (1天)
- [ ] 添加所有动画效果
- [ ] 实现价格闪烁效果
- [ ] 实现进度条平滑过渡动画
- [ ] 实现订单取消确认动画
- [ ] 响应式适配（移动端）
- [ ] 错误处理
- [ ] 完整流程测试
- [ ] 性能优化

**预计总工时**: 8.5 天

### 3.11 验收标准

#### 功能验收
- [ ] 右上角余额显示正确（USDT 和 RWA）
- [ ] 余额实时更新（交易后立即刷新）
- [ ] 交易对选择器正确显示价格和涨跌幅
- [ ] 合约信息面板正确显示所有数据
- [ ] 订单簿正确显示卖单和买单（左右并排）
- [ ] 订单簿深度可视化正常工作（浅色背景条）
- [ ] 点击订单簿价格自动填充到交易表单
- [ ] 交易表单买入/卖出切换正常
- [ ] 百分比快捷按钮（25%/50%/75%/100%）正常工作
- [ ] 百分比进度条可拖动，实时更新数量
- [ ] 百分比自动计算数量准确
- [ ] 余额检查正常工作
- [ ] 订单总额计算准确
- [ ] 买入订单正常执行
- [ ] 卖出订单正常执行
- [ ] Current Trade 标签页正确显示当前挂单
- [ ] Historical Trade 标签页正确显示历史订单
- [ ] 订单表格所有列正确显示
- [ ] 订单状态颜色正确（Buy绿色，Sell红色，Fulfilled绿色，Cancelled红色）
- [ ] 取消订单功能正常工作
- [ ] 取消订单后余额正确退还
- [ ] 空状态正确显示（No Data）
- [ ] 订单历史正确记录

#### 体验验收
- [ ] 所有动画流畅自然
- [ ] 价格闪烁效果正常
- [ ] 订单簿更新实时响应
- [ ] 进度条拖动平滑流畅
- [ ] 百分比按钮点击反馈及时
- [ ] 标签页切换动画流畅
- [ ] 取消订单确认对话框体验良好
- [ ] 交互反馈及时（Toast、加载状态）
- [ ] 移动端适配良好
- [ ] 无明显 Bug 和卡顿

#### 数据验收
- [ ] 订单簿数据格式正确
- [ ] 交易计算准确
- [ ] 用户资产更新正确
- [ ] 订单状态流转正确
- [ ] 百分比计算准确（买入和卖出逻辑不同）
- [ ] 订单列表按时间倒序排列
- [ ] 取消订单后数据状态正确

#### 专业性验收
- [ ] 界面符合专业交易所标准
- [ ] 信息密度合理
- [ ] 订单簿展示清晰（左右并排，深度可视化）
- [ ] 交易流程顺畅
- [ ] 百分比功能提升交易效率
- [ ] 订单历史功能完整，便于用户追踪
- [ ] 买入订单正常执行
- [ ] 卖出订单正常执行
- [ ] 订单历史正确记录

#### 体验验收
- [ ] 所有动画流畅自然
- [ ] 价格闪烁效果正常
- [ ] 订单簿更新实时响应
- [ ] 进度条拖动平滑流畅
- [ ] 百分比按钮点击反馈及时
- [ ] 交互反馈及时（Toast、加载状态）
- [ ] 移动端适配良好
- [ ] 无明显 Bug 和卡顿

#### 数据验收
- [ ] 订单簿数据格式正确
- [ ] 交易计算准确
- [ ] 用户资产更新正确
- [ ] 订单状态流转正确
- [ ] 百分比计算准确（买入和卖出逻辑不同）

#### 专业性验收
- [ ] 界面符合专业交易所标准
- [ ] 信息密度合理
- [ ] 订单簿展示清晰（左右并排，深度可视化）
- [ ] 交易流程顺畅
- [ ] 百分比功能提升交易效率
- [ ] 交易计算准确
- [ ] 用户资产更新正确
- [ ] 订单状态流转正确

#### 专业性验收
- [ ] 界面符合专业交易所标准
- [ ] 信息密度合理
- [ ] 订单簿展示清晰
- [ ] 交易流程顺畅

------

## 版本历史

- **v0.2** (2026-02-06): 添加需求 1、需求 2 和需求 3
- **v0.1** (2025-XX-XX): 初始版本（黑客松 Demo）

