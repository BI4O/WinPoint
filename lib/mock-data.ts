// 商品接口
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

// 购物车商品项接口
export interface CartItem {
  product: Product;
  quantity: number;
}

// 商家接口
export interface Merchant {
  id: string;  // 改为 string
  name: string;
  category: string;
  logo: string;
  description: string;
  creditRate: number;
  products: Product[];  // 新增商品列表
}

// 订单商品项接口
export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

// 订单接口
export interface Order {
  id: string;  // 改为 string
  timestamp: number;  // 改为时间戳
  merchantId: string;
  merchantName: string;
  items: OrderItem[];  // 新增订单商品明细
  totalAmount: number;  // 订单总金额
  creditEarned: number;
  status: 'completed' | 'pending';
}

// 活动记录接口
export interface Activity {
  id: string;  // 改为 string
  type: 'credit_earned' | 'credit_staked' | 'reward_received' | 'credit_redeemed';  // 新增 credit_redeemed 类型
  amount: number;
  merchant?: string;
  timestamp: number;  // 改为时间戳
  // 兑换相关字段（当 type = 'credit_redeemed' 时）
  rewardProductName?: string;
  creditSpent?: number;
}

// 兑换商品接口（需求 2）
export interface RewardProduct {
  id: string;
  productId: string;
  merchantId: string;
  merchantName: string;
  name: string;
  originalPrice: number;
  creditCost: number;
  image: string;
  category: string;
  stock: number;
  description?: string;
}

// 兑换记录接口（需求 2）
export interface RedemptionRecord {
  id: string;
  userId: string;
  rewardProductId: string;
  productName: string;
  merchantName: string;
  creditCost: number;
  timestamp: number;
  status: 'pending' | 'shipped' | 'delivered';
  trackingNumber?: string;
}

export interface MarketOrder {
  id: number;
  seller: string;
  amount: number;
  price: number;
  total: number;
}

// 星巴克咖啡商品
const starbucksProducts: Product[] = [
  { id: 'sb-1', merchantId: 'starbucks', name: '☕ 美式咖啡', price: 32, image: 'emoji:☕', stock: 999 },
  { id: 'sb-2', merchantId: 'starbucks', name: '☕ 拿铁咖啡', price: 38, image: 'emoji:☕', stock: 999 },
  { id: 'sb-3', merchantId: 'starbucks', name: '☕ 卡布奇诺', price: 38, image: 'emoji:☕', stock: 999 },
  { id: 'sb-4', merchantId: 'starbucks', name: '☕ 摩卡咖啡', price: 42, image: 'emoji:☕', stock: 999 },
  { id: 'sb-5', merchantId: 'starbucks', name: '☕ 焦糖玛奇朵', price: 45, image: 'emoji:☕', stock: 999 },
  { id: 'sb-6', merchantId: 'starbucks', name: '🍰 提拉米苏', price: 35, image: 'emoji:🍰', stock: 999 }
];

// Nike 运动商品
const nikeProducts: Product[] = [
  { id: 'nk-1', merchantId: 'nike', name: '👟 Air Max 运动鞋', price: 899, image: 'emoji:👟', stock: 999 },
  { id: 'nk-2', merchantId: 'nike', name: '👕 Dri-FIT 运动T恤', price: 299, image: 'emoji:👕', stock: 999 },
  { id: 'nk-3', merchantId: 'nike', name: '🩳 运动短裤', price: 399, image: 'emoji:🩳', stock: 999 },
  { id: 'nk-4', merchantId: 'nike', name: '🎒 运动背包', price: 499, image: 'emoji:🎒', stock: 999 },
  { id: 'nk-5', merchantId: 'nike', name: '🧦 运动袜套装', price: 129, image: 'emoji:🧦', stock: 999 },
  { id: 'nk-6', merchantId: 'nike', name: '🥤 运动水壶', price: 159, image: 'emoji:🥤', stock: 999 }
];

// Apple Store 商品
const appleProducts: Product[] = [
  { id: 'ap-1', merchantId: 'apple', name: '🎧 AirPods Pro', price: 1999, image: 'emoji:🎧', stock: 999 },
  { id: 'ap-2', merchantId: 'apple', name: '⌚ Apple Watch SE', price: 2199, image: 'emoji:⌚', stock: 999 },
  { id: 'ap-3', merchantId: 'apple', name: '📱 iPhone 保护壳', price: 399, image: 'emoji:📱', stock: 999 },
  { id: 'ap-4', merchantId: 'apple', name: '🔌 MagSafe 充电器', price: 329, image: 'emoji:🔌', stock: 999 },
  { id: 'ap-5', merchantId: 'apple', name: '🔌 Lightning 数据线', price: 149, image: 'emoji:🔌', stock: 999 },
  { id: 'ap-6', merchantId: 'apple', name: '🏷️ AirTag 4件装', price: 799, image: 'emoji:🏷️', stock: 999 }
];

// 母婴用品店商品
const babyProducts: Product[] = [
  { id: 'bb-1', merchantId: 'baby', name: 'Ealing 4合1滑梯秋千套装', price: 869, image: '/products/baby/bb-1.jpeg', stock: 999 },
  { id: 'bb-2', merchantId: 'baby', name: 'Ealing 儿童沙发滑梯', price: 629, image: '/products/baby/bb-2.jpeg', stock: 999 },
  { id: 'bb-3', merchantId: 'baby', name: 'Ealing 3合1婴儿学步车', price: 579, image: '/products/baby/bb-3.jpeg', stock: 999 },
  { id: 'bb-4', merchantId: 'baby', name: 'Ealing 野餐篮套装', price: 516, image: '/products/baby/bb-4.jpeg', stock: 999 },
  { id: 'bb-5', merchantId: 'baby', name: 'Ealing 室内幼儿滑梯', price: 459, image: '/products/baby/bb-5.jpeg', stock: 999 },
  { id: 'bb-6', merchantId: 'baby', name: 'Ealing 可折叠婴儿学步车', price: 619, image: '/products/baby/bb-6.jpeg', stock: 999 }
];

// 珠宝钻石店商品
const jewelryProducts: Product[] = [
  { id: 'jw-1', merchantId: 'jewelry', name: '18K白金橄榄石戒指', price: 4100, image: 'emoji:💍', stock: 999 },
  { id: 'jw-2', merchantId: 'jewelry', name: '18K白红金粉红宝石戒指', price: 2400, image: 'emoji:💍', stock: 999 },
  { id: 'jw-3', merchantId: 'jewelry', name: '18K白金尖晶白钻胸针', price: 3800, image: 'emoji:💎', stock: 999 },
  { id: 'jw-4', merchantId: 'jewelry', name: '18K白红金粉钻戒指', price: 3750, image: 'emoji:💍', stock: 999 },
  { id: 'jw-5', merchantId: 'jewelry', name: '蓝宝石白钻戒指', price: 2700, image: 'emoji:💍', stock: 999 },
  { id: 'jw-6', merchantId: 'jewelry', name: '18K金祖母绿黄白钻戒指', price: 2600, image: 'emoji:💍', stock: 999 }
];

// 商家数据
export const mockMerchants: Merchant[] = [
  {
    id: 'starbucks',
    name: "星巴克咖啡",
    category: "餐饮",
    logo: "☕",
    description: "全球知名咖啡连锁",
    creditRate: 10,
    products: starbucksProducts
  },
  {
    id: 'nike',
    name: "Nike 运动",
    category: "运动",
    logo: "👟",
    description: "运动装备专家",
    creditRate: 10,
    products: nikeProducts
  },
  {
    id: 'apple',
    name: "Apple Store",
    category: "电子产品",
    logo: "🍎",
    description: "科技产品零售",
    creditRate: 10,
    products: appleProducts
  },
  {
    id: 'baby',
    name: "Ealing 母婴旗舰店",
    category: "母婴",
    logo: "👶",
    description: "优质母婴用品",
    creditRate: 10,
    products: babyProducts
  },
  {
    id: 'jewelry',
    name: "DIMD 珠宝精品",
    category: "奢侈品",
    logo: "💎",
    description: "高端珠宝定制",
    creditRate: 10,
    products: jewelryProducts
  }
];

export const mockUserInitial = {
  address: "0x1234...5678",
  credit: 5000,
  share: 50,
  earnings: 12.5
};

// 使用固定的基准时间戳 (2024-02-01) 避免 SSR hydration 问题
const BASE_TIMESTAMP = 1706745600000;

export const mockOrdersInitial: Order[] = [
  {
    id: 'order-1',
    timestamp: BASE_TIMESTAMP - 86400000, // 1天前
    merchantId: 'starbucks',
    merchantName: "星巴克咖啡",
    items: [
      { productId: 'sb-1', productName: '☕ 美式咖啡', price: 32, quantity: 1 }
    ],
    totalAmount: 32,
    creditEarned: 3.2,
    status: "completed"
  }
];

export const mockActivitiesInitial: Activity[] = [
  {
    id: 'activity-1',
    type: "credit_earned",
    amount: 10,
    merchant: "星巴克咖啡",
    timestamp: BASE_TIMESTAMP - 86400000 // 1天前
  },
  {
    id: 'activity-2',
    type: "credit_staked",
    amount: 50,
    timestamp: BASE_TIMESTAMP - 172800000 // 2天前
  },
  {
    id: 'activity-3',
    type: "reward_received",
    amount: 5.2,
    timestamp: BASE_TIMESTAMP - 259200000 // 3天前
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

// K线数据接口
export interface KLineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Share K线历史数据（最近30天）- 模拟真实市场波动
export const mockKLineData: KLineData[] = [
  // 第一周：震荡上涨
  { time: "2024-01-01", open: 2.10, high: 2.18, low: 2.08, close: 2.15, volume: 450 },
  { time: "2024-01-02", open: 2.15, high: 2.22, low: 2.12, close: 2.18, volume: 520 },
  { time: "2024-01-03", open: 2.18, high: 2.25, low: 2.15, close: 2.20, volume: 680 },
  { time: "2024-01-04", open: 2.20, high: 2.28, low: 2.18, close: 2.16, volume: 590 }, // 回调
  { time: "2024-01-05", open: 2.16, high: 2.20, low: 2.12, close: 2.14, volume: 720 }, // 继续回调

  // 第二周：横盘整理
  { time: "2024-01-08", open: 2.14, high: 2.18, low: 2.10, close: 2.15, volume: 480 },
  { time: "2024-01-09", open: 2.15, high: 2.19, low: 2.12, close: 2.13, volume: 420 },
  { time: "2024-01-10", open: 2.13, high: 2.17, low: 2.11, close: 2.16, volume: 510 },
  { time: "2024-01-11", open: 2.16, high: 2.20, low: 2.14, close: 2.18, volume: 550 },
  { time: "2024-01-12", open: 2.18, high: 2.22, low: 2.15, close: 2.17, volume: 490 },

  // 第三周：突破上涨
  { time: "2024-01-15", open: 2.17, high: 2.32, low: 2.16, close: 2.30, volume: 890 }, // 放量突破
  { time: "2024-01-16", open: 2.30, high: 2.38, low: 2.28, close: 2.35, volume: 1120 },
  { time: "2024-01-17", open: 2.35, high: 2.42, low: 2.32, close: 2.40, volume: 980 },
  { time: "2024-01-18", open: 2.40, high: 2.48, low: 2.38, close: 2.45, volume: 1050 },
  { time: "2024-01-19", open: 2.45, high: 2.52, low: 2.42, close: 2.48, volume: 920 },

  // 第四周：高位震荡回调
  { time: "2024-01-22", open: 2.48, high: 2.50, low: 2.38, close: 2.40, volume: 1180 }, // 高位回落
  { time: "2024-01-23", open: 2.40, high: 2.45, low: 2.35, close: 2.38, volume: 950 },
  { time: "2024-01-24", open: 2.38, high: 2.42, low: 2.32, close: 2.35, volume: 870 },
  { time: "2024-01-25", open: 2.35, high: 2.40, low: 2.30, close: 2.33, volume: 780 },
  { time: "2024-01-26", open: 2.33, high: 2.38, low: 2.28, close: 2.32, volume: 690 },

  // 第五周：底部企稳
  { time: "2024-01-29", open: 2.32, high: 2.36, low: 2.28, close: 2.34, volume: 620 },
  { time: "2024-01-30", open: 2.34, high: 2.38, low: 2.30, close: 2.36, volume: 710 },
  { time: "2024-01-31", open: 2.36, high: 2.42, low: 2.34, close: 2.40, volume: 850 },
  { time: "2024-02-01", open: 2.40, high: 2.46, low: 2.38, close: 2.44, volume: 920 },
  { time: "2024-02-02", open: 2.44, high: 2.50, low: 2.42, close: 2.48, volume: 1050 },

  // 最近几天：再次上涨
  { time: "2024-02-05", open: 2.48, high: 2.55, low: 2.46, close: 2.52, volume: 1180 },
  { time: "2024-02-06", open: 2.52, high: 2.58, low: 2.50, close: 2.55, volume: 1240 },
  { time: "2024-02-07", open: 2.55, high: 2.60, low: 2.52, close: 2.48, volume: 1090 }, // 冲高回落
  { time: "2024-02-08", open: 2.48, high: 2.52, low: 2.45, close: 2.49, volume: 980 },
  { time: "2024-02-09", open: 2.49, high: 2.53, low: 2.47, close: 2.50, volume: 890 }, // 当前价格
];

// 收益历史数据接口
export interface EarningsData {
  date: string;
  amount: number;
  accumulated?: number; // 累计收益
  isPaid?: boolean; // 是否已发放
}

// 按日收益数据 - 显示本月待发放累积收益（月底发放后下月归零）
export const mockEarningsDaily: EarningsData[] = [
  // 2024年1月 - 本月累积
  { date: "2024-01-01", amount: 0.15, isPaid: false },
  { date: "2024-01-05", amount: 0.50, isPaid: false },
  { date: "2024-01-10", amount: 0.92, isPaid: false },
  { date: "2024-01-15", amount: 1.50, isPaid: false },
  { date: "2024-01-20", amount: 2.13, isPaid: false },
  { date: "2024-01-25", amount: 2.68, isPaid: false },
  { date: "2024-01-31", amount: 3.20, isPaid: true }, // 月底发放
  // 2024年2月 - 新周期，从零开始累积
  { date: "2024-02-05", amount: 0.48, isPaid: false },
  { date: "2024-02-10", amount: 1.10, isPaid: false },
  { date: "2024-02-15", amount: 1.81, isPaid: false },
  { date: "2024-02-20", amount: 2.66, isPaid: false },
  { date: "2024-02-25", amount: 3.59, isPaid: false },
  { date: "2024-02-29", amount: 4.50, isPaid: true }, // 月底发放
  // 2024年3月 - 新周期
  { date: "2024-03-05", amount: 0.52, isPaid: false },
  { date: "2024-03-10", amount: 1.20, isPaid: false },
  { date: "2024-03-15", amount: 1.95, isPaid: false },
  { date: "2024-03-20", amount: 2.77, isPaid: false },
  { date: "2024-03-25", amount: 3.65, isPaid: false },
  { date: "2024-03-31", amount: 4.80, isPaid: true }, // 月底发放
  // 2024年4月 - 新周期
  { date: "2024-04-05", amount: 0.55, isPaid: false },
  { date: "2024-04-10", amount: 1.27, isPaid: false },
  { date: "2024-04-15", amount: 2.05, isPaid: false },
  { date: "2024-04-20", amount: 2.90, isPaid: false },
  { date: "2024-04-25", amount: 3.82, isPaid: false },
  { date: "2024-04-30", amount: 4.80, isPaid: true }, // 月底发放
  // 2024年5月 - 新周期
  { date: "2024-05-05", amount: 0.58, isPaid: false },
  { date: "2024-05-10", amount: 1.33, isPaid: false },
  { date: "2024-05-15", amount: 2.15, isPaid: false },
  { date: "2024-05-20", amount: 3.05, isPaid: false },
  { date: "2024-05-25", amount: 4.00, isPaid: false },
  { date: "2024-05-31", amount: 5.05, isPaid: true }, // 月底发放
];

// 按周收益数据 - 显示本月待发放累积收益（月底发放后下月归零）
export const mockEarningsWeekly: EarningsData[] = [
  // 2024年1月
  { date: "2024-W01", amount: 0.50, isPaid: false },
  { date: "2024-W02", amount: 1.15, isPaid: false },
  { date: "2024-W03", amount: 1.87, isPaid: false },
  { date: "2024-W04", amount: 3.20, isPaid: true }, // 1月发放
  // 2024年2月 - 新周期
  { date: "2024-W05", amount: 0.48, isPaid: false },
  { date: "2024-W06", amount: 1.10, isPaid: false },
  { date: "2024-W07", amount: 1.81, isPaid: false },
  { date: "2024-W08", amount: 2.66, isPaid: false },
  { date: "2024-W09", amount: 4.50, isPaid: true }, // 2月发放
  // 2024年3月 - 新周期
  { date: "2024-W10", amount: 0.52, isPaid: false },
  { date: "2024-W11", amount: 1.20, isPaid: false },
  { date: "2024-W12", amount: 1.95, isPaid: false },
  { date: "2024-W13", amount: 2.77, isPaid: false },
  { date: "2024-W14", amount: 4.80, isPaid: true }, // 3月发放
  // 2024年4月 - 新周期
  { date: "2024-W15", amount: 0.55, isPaid: false },
  { date: "2024-W16", amount: 1.27, isPaid: false },
  { date: "2024-W17", amount: 2.05, isPaid: false },
  { date: "2024-W18", amount: 2.90, isPaid: false },
  { date: "2024-W18", amount: 4.80, isPaid: true }, // 4月发放
  // 2024年5月 - 新周期
  { date: "2024-W19", amount: 0.58, isPaid: false },
  { date: "2024-W20", amount: 1.33, isPaid: false },
  { date: "2024-W21", amount: 2.15, isPaid: false },
  { date: "2024-W22", amount: 5.05, isPaid: true }, // 5月发放
];

// 按月收益数据 - 累积增长（不归零）
export const mockEarningsMonthly: EarningsData[] = [
  { date: "2024-01", amount: 3.20, isPaid: true },
  { date: "2024-02", amount: 7.70, isPaid: true },
  { date: "2024-03", amount: 12.50, isPaid: true },
  { date: "2024-04", amount: 17.30, isPaid: true },
  { date: "2024-05", amount: 22.35, isPaid: true },
  { date: "2024-06", amount: 27.55, isPaid: true },
  { date: "2024-07", amount: 32.90, isPaid: true },
  { date: "2024-08", amount: 38.40, isPaid: true },
  { date: "2024-09", amount: 44.05, isPaid: true },
  { date: "2024-10", amount: 49.85, isPaid: true },
  { date: "2024-11", amount: 55.80, isPaid: true },
  { date: "2024-12", amount: 61.90, isPaid: true },
];

// 按年收益数据 - 累积增长（不归零）
export const mockEarningsYearly: EarningsData[] = [
  { date: "2023", amount: 28.50, isPaid: true },
  { date: "2024", amount: 90.40, isPaid: true },
];

// 兼容原有接口
export const mockEarningsHistory = mockEarningsMonthly;

export const mockMetrics = {
  totalUsers: 1234,
  totalCredit: 45678,
  totalRewards: 12345.67,
  totalShares: 23456
};

// 兑换商品数据（需求 2）
export const mockRewardProducts: RewardProduct[] = [
  // 母婴商品（重点展示）
  {
    id: 'reward-baby-1',
    productId: 'bb-1',
    merchantId: 'baby',
    merchantName: 'Ealing 母婴旗舰店',
    name: 'Ealing 4合1滑梯秋千套装',
    originalPrice: 869,
    creditCost: 869,
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
  },
  // 珠宝商品（重点展示）
  {
    id: 'reward-jewelry-1',
    productId: 'jw-1',
    merchantId: 'jewelry',
    merchantName: 'DIMD 珠宝精品',
    name: '18K白金橄榄石戒指',
    originalPrice: 4100,
    creditCost: 4100,
    image: 'emoji:💍',
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
    image: 'emoji:💍',
    category: '奢侈品',
    stock: 10
  },
  // 其他商品
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
  },
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
  },
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
];
