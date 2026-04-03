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

// 商户商品接口（含积分定价和上架状态）
export interface MerchantProduct {
  id: string;
  merchantId: string;
  merchantName: string;     // 商户名称
  name: string;
  cashPrice: number;        // 现金价格
  pointPrice: number;       // 积分价格（积分可抵扣部分）
  image: string;
  description?: string;
  stock: number;            // 库存数量
  isListed: boolean;        // 是否上架积分商城
  category?: string;
}

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
  pointRate: number;
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
  pointEarned: number;
  status: 'completed' | 'pending';
}

// 活动记录接口
export interface Activity {
  id: string;  // 改为 string
  type: 'point_earned' | 'point_staked' | 'reward_received' | 'point_redeemed';  // 新增 point_redeemed 类型
  amount: number;
  merchant?: string;
  timestamp: number;  // 改为时间戳
  // 兑换相关字段（当 type = 'point_redeemed' 时）
  rewardProductName?: string;
  pointSpent?: number;
}

// 兑换商品接口（需求 2）
export interface RewardProduct {
  id: string;
  productId: string;
  merchantId: string;
  merchantName: string;
  name: string;
  originalPrice: number;
  pointCost: number;
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
  pointCost: number;
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

// 交易订单接口（需求 3）
export interface TradeOrder {
  id: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  totalAmount: number;
  timestamp: number;
  status: 'pending' | 'partial' | 'fulfilled' | 'cancelled';
  filledQuantity?: number;
}

// 订单簿条目接口
export interface OrderBookEntry {
  price: number;
  quantity: number;
  totalAmount: number;
  depth: number;
  depthPercentage: number;
}

// 订单簿接口
export interface OrderBook {
  sellOrders: OrderBookEntry[];
  buyOrders: OrderBookEntry[];
  lastPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
}

// 统计数据点接口
export interface StatsDataPoint {
  date: string;    // '2026-03-01'
  value: number;
}

// 生成30天统计数据
const generateStatsData = (
  baseValue: number,
  volatility: number,
  trend: 'up' | 'down' | 'flat'
): StatsDataPoint[] => {
  const data: StatsDataPoint[] = [];
  const today = new Date('2026-04-03');

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const randomChange = (Math.random() - 0.5) * volatility;
    const trendFactor = trend === 'up' ? 0.02 : trend === 'down' ? -0.02 : 0;
    const trendValue = baseValue * (1 + trendFactor * (29 - i));

    const value = Math.max(0, Math.round(trendValue + randomChange));

    data.push({
      date: date.toISOString().split('T')[0],
      value
    });
  }

  return data;
};

// 30天统计数据
export const mockSalesData: StatsDataPoint[] = generateStatsData(1000, 200, 'up');
export const mockWinData: StatsDataPoint[] = generateStatsData(500, 150, 'flat');
export const mockOrdersData: StatsDataPoint[] = generateStatsData(50, 20, 'up');
export const mockStockData: StatsDataPoint[] = generateStatsData(200, 30, 'down');

// 权益类型预设
export const BENEFIT_TYPES = [
  { type: 'parking' as const, icon: '🅿️', label: '停车券' },
  { type: 'dining' as const, icon: '🍽️', label: '餐饮券' },
  { type: 'gift' as const, icon: '🎁', label: '礼品券' },
  { type: 'beverage' as const, icon: '☕', label: '饮品券' },
  { type: 'custom' as const, icon: '📦', label: '自定义' },
];

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
  { id: 'jw-1', merchantId: 'jewelry', name: '18K白金橄榄石戒指', price: 4100, image: '/products/jewelry/01-olivine-ring.png', stock: 999 },
  { id: 'jw-2', merchantId: 'jewelry', name: '18K白红金粉红宝石戒指', price: 2400, image: '/products/jewelry/02-ruby-ring.png', stock: 999 },
  { id: 'jw-3', merchantId: 'jewelry', name: '18K白金尖晶白钻胸针', price: 3800, image: '/products/jewelry/03-spinel-brooch.png', stock: 999 },
  { id: 'jw-4', merchantId: 'jewelry', name: '18K白红金粉钻戒指', price: 3750, image: '/products/jewelry/04-pink-diamond-ring.png', stock: 999 },
  { id: 'jw-5', merchantId: 'jewelry', name: '蓝宝石白钻戒指', price: 2700, image: '/products/jewelry/05-sapphire-ring.png', stock: 999 },
  { id: 'jw-6', merchantId: 'jewelry', name: '18K金祖母绿黄白钻戒指', price: 2600, image: '/products/jewelry/06-emerald-ring.png', stock: 999 }
];

// 商家数据
export const mockMerchants: Merchant[] = [
  {
    id: 'starbucks',
    name: "星巴克咖啡",
    category: "餐饮",
    logo: "☕",
    description: "全球知名咖啡连锁",
    pointRate: 10,
    products: starbucksProducts
  },
  {
    id: 'nike',
    name: "Nike 运动",
    category: "运动",
    logo: "👟",
    description: "运动装备专家",
    pointRate: 10,
    products: nikeProducts
  },
  {
    id: 'apple',
    name: "Apple Store",
    category: "电子产品",
    logo: "🍎",
    description: "科技产品零售",
    pointRate: 10,
    products: appleProducts
  },
  {
    id: 'baby',
    name: "Ealing 母婴旗舰店",
    category: "母婴",
    logo: "👶",
    description: "优质母婴用品",
    pointRate: 10,
    products: babyProducts
  },
  {
    id: 'jewelry',
    name: "DIMD 珠宝精品",
    category: "奢侈品",
    logo: "💎",
    description: "高端珠宝定制",
    pointRate: 10,
    products: jewelryProducts
  }
];

export const mockUserInitial = {
  address: "0x1234...5678",
  point: 5000,
  rwa: 500,
  earnings: 10000
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
    pointEarned: 3.2,
    status: "completed"
  }
];

export const mockActivitiesInitial: Activity[] = [
  {
    id: 'activity-1',
    type: "point_earned",
    amount: 10,
    merchant: "星巴克咖啡",
    timestamp: BASE_TIMESTAMP - 86400000 // 1天前
  },
  {
    id: 'activity-2',
    type: "point_staked",
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
  totalPoint: 45678,
  totalRewards: 12345.67,
  totalRwa: 23456
};

// 兑换商品数据（需求 2）
// 订单簿数据（需求 3）
export const mockOrderBook: OrderBook = {
  // 卖单：从高到低排列，深度从大到小（上面长下面短），带明显波动
  sellOrders: [
    { price: 0.1565, quantity: 142.45, totalAmount: 22.30, depth: 142.45, depthPercentage: 100 },
    { price: 0.1560, quantity: 68.32, totalAmount: 10.66, depth: 210.77, depthPercentage: 78 },
    { price: 0.1555, quantity: 155.67, totalAmount: 24.21, depth: 366.44, depthPercentage: 65 },
    { price: 0.1550, quantity: 45.18, totalAmount: 7.00, depth: 411.62, depthPercentage: 52 },
    { price: 0.1545, quantity: 138.89, totalAmount: 21.46, depth: 550.51, depthPercentage: 41 },
    { price: 0.1540, quantity: 72.45, totalAmount: 11.16, depth: 622.96, depthPercentage: 33 },
    { price: 0.1535, quantity: 95.76, totalAmount: 14.70, depth: 718.72, depthPercentage: 24 },
    { price: 0.1530, quantity: 58.92, totalAmount: 9.01, depth: 777.64, depthPercentage: 18 },
    { price: 0.1525, quantity: 125.34, totalAmount: 19.11, depth: 902.98, depthPercentage: 11 },
    { price: 0.1520, quantity: 42.58, totalAmount: 6.47, depth: 945.56, depthPercentage: 5 }
  ],
  // 买单：从高到低排列，深度从小到大（上面短下面长），带明显波动
  buyOrders: [
    { price: 0.1510, quantity: 38.23, totalAmount: 5.77, depth: 38.23, depthPercentage: 4 },
    { price: 0.1505, quantity: 95.48, totalAmount: 14.37, depth: 133.71, depthPercentage: 12 },
    { price: 0.1500, quantity: 52.91, totalAmount: 7.94, depth: 186.62, depthPercentage: 22 },
    { price: 0.1495, quantity: 118.76, totalAmount: 17.76, depth: 305.38, depthPercentage: 35 },
    { price: 0.1490, quantity: 45.34, totalAmount: 6.76, depth: 350.72, depthPercentage: 48 },
    { price: 0.1485, quantity: 132.12, totalAmount: 19.62, depth: 482.84, depthPercentage: 61 },
    { price: 0.1480, quantity: 68.67, totalAmount: 10.16, depth: 551.51, depthPercentage: 72 },
    { price: 0.1475, quantity: 105.89, totalAmount: 15.62, depth: 657.40, depthPercentage: 84 },
    { price: 0.1470, quantity: 55.23, totalAmount: 8.12, depth: 712.63, depthPercentage: 92 },
    { price: 0.1465, quantity: 88.67, totalAmount: 12.99, depth: 801.30, depthPercentage: 100 }
  ],
  lastPrice: 0.1515,
  priceChange24h: 0.0050,
  priceChangePercent24h: 3.41
};

// 用户交易订单历史（需求 3）- 2025年12月数据
// 2025年12月时间戳参考：
// 2025-12-01 = 1764547200000, 2025-12-20 = 1766188800000
export const mockUserOrders: TradeOrder[] = [
  {
    id: 'trade-1',
    type: 'buy',
    price: 0.1510,
    quantity: 10.5,
    totalAmount: 1.5855,
    timestamp: 1766188800000, // 2025-12-20 00:00:00
    status: 'fulfilled',
    filledQuantity: 10.5
  },
  {
    id: 'trade-2',
    type: 'sell',
    price: 0.1520,
    quantity: 5.2,
    totalAmount: 0.7904,
    timestamp: 1766016000000, // 2025-12-18 00:00:00
    status: 'fulfilled',
    filledQuantity: 5.2
  },
  {
    id: 'trade-3',
    type: 'buy',
    price: 0.1505,
    quantity: 8.0,
    totalAmount: 1.2040,
    timestamp: 1765763200000, // 2025-12-15 00:00:00
    status: 'cancelled'
  },
  {
    id: 'trade-4',
    type: 'sell',
    price: 0.1535,
    quantity: 12.3,
    totalAmount: 1.8881,
    timestamp: 1765564800000, // 2025-12-13 00:00:00
    status: 'fulfilled',
    filledQuantity: 12.3
  },
  {
    id: 'trade-5',
    type: 'buy',
    price: 0.1490,
    quantity: 15.0,
    totalAmount: 2.2350,
    timestamp: 1765305600000, // 2025-12-10 00:00:00
    status: 'partial',
    filledQuantity: 7.5
  }
];

// 商户商品数据（积分商城用）
export const mockMerchantProducts: MerchantProduct[] = [
  // 星巴克
  { id: 'mp-sb-1', merchantId: 'starbucks', merchantName: '星巴克咖啡', name: '美式咖啡', cashPrice: 22, pointPrice: 100, image: 'emoji:☕', stock: 100, isListed: true, category: '餐饮' },
  { id: 'mp-sb-2', merchantId: 'starbucks', merchantName: '星巴克咖啡', name: '拿铁咖啡', cashPrice: 28, pointPrice: 120, image: 'emoji:☕', stock: 85, isListed: true, category: '餐饮' },
  { id: 'mp-sb-3', merchantId: 'starbucks', merchantName: '星巴克咖啡', name: '卡布奇诺', cashPrice: 28, pointPrice: 120, image: 'emoji:☕', stock: 0, isListed: false, category: '餐饮' },
  { id: 'mp-sb-4', merchantId: 'starbucks', merchantName: '星巴克咖啡', name: '焦糖玛奇朵', cashPrice: 32, pointPrice: 150, image: 'emoji:☕', stock: 70, isListed: true, category: '餐饮' },
  { id: 'mp-sb-5', merchantId: 'starbucks', merchantName: '星巴克咖啡', name: '摩卡', cashPrice: 30, pointPrice: 130, image: 'emoji:☕', stock: 5, isListed: true, category: '餐饮' },
  // Nike
  { id: 'mp-nk-1', merchantId: 'nike', merchantName: 'Nike 运动', name: 'Air Max 运动鞋', cashPrice: 799, pointPrice: 1000, image: 'emoji:👟', stock: 50, isListed: true, category: '运动' },
  { id: 'mp-nk-2', merchantId: 'nike', merchantName: 'Nike 运动', name: 'Dri-FIT 运动T恤', cashPrice: 199, pointPrice: 300, image: 'emoji:👕', stock: 80, isListed: true, category: '运动' },
  { id: 'mp-nk-3', merchantId: 'nike', merchantName: 'Nike 运动', name: '运动短裤', cashPrice: 299, pointPrice: 400, image: 'emoji:🩳', stock: 60, isListed: false, category: '运动' },
  { id: 'mp-nk-4', merchantId: 'nike', merchantName: 'Nike 运动', name: 'Air Force 1 板鞋', cashPrice: 699, pointPrice: 800, image: 'emoji:👟', stock: 3, isListed: true, category: '运动' },
  { id: 'mp-nk-5', merchantId: 'nike', merchantName: 'Nike 运动', name: '运动护腕', cashPrice: 89, pointPrice: 100, image: 'emoji:🎧', stock: 120, isListed: true, category: '运动' },
  // Apple
  { id: 'mp-ap-1', merchantId: 'apple', merchantName: 'Apple Store', name: 'AirPods Pro', cashPrice: 1499, pointPrice: 2000, image: 'emoji:🎧', stock: 30, isListed: true, category: '电子产品' },
  { id: 'mp-ap-2', merchantId: 'apple', merchantName: 'Apple Store', name: 'Apple Watch SE', cashPrice: 1699, pointPrice: 2000, image: 'emoji:⌚', stock: 20, isListed: true, category: '电子产品' },
  { id: 'mp-ap-3', merchantId: 'apple', merchantName: 'Apple Store', name: 'iPad Air', cashPrice: 3499, pointPrice: 4000, image: 'emoji:⌚', stock: 0, isListed: false, category: '电子产品' },
  { id: 'mp-ap-4', merchantId: 'apple', merchantName: 'Apple Store', name: 'MagSafe 充电器', cashPrice: 229, pointPrice: 300, image: 'emoji:🎧', stock: 45, isListed: true, category: '电子产品' },
  // 母婴
  { id: 'mp-bb-1', merchantId: 'baby', merchantName: 'Ealing 母婴旗舰店', name: '4合1滑梯秋千套装', cashPrice: 669, pointPrice: 800, image: 'emoji:👶', stock: 10, isListed: true, category: '母婴' },
  { id: 'mp-bb-2', merchantId: 'baby', merchantName: 'Ealing 母婴旗舰店', name: '儿童沙发滑梯', cashPrice: 429, pointPrice: 500, image: 'emoji:🛝', stock: 15, isListed: true, category: '母婴' },
  { id: 'mp-bb-3', merchantId: 'baby', merchantName: 'Ealing 母婴旗舰店', name: '婴儿健身架', cashPrice: 299, pointPrice: 350, image: 'emoji:👶', stock: 25, isListed: true, category: '母婴' },
  { id: 'mp-bb-4', merchantId: 'baby', merchantName: 'Ealing 母婴旗舰店', name: '儿童背包水枪', cashPrice: 89, pointPrice: 100, image: 'emoji:🎒', stock: 0, isListed: true, category: '母婴' },
  // 珠宝
  { id: 'mp-jw-1', merchantId: 'jewelry', merchantName: 'DIMD 珠宝精品', name: '18K白金橄榄石戒指', cashPrice: 3100, pointPrice: 5000, image: 'emoji:💎', stock: 5, isListed: true, category: '奢侈品' },
  { id: 'mp-jw-2', merchantId: 'jewelry', merchantName: 'DIMD 珠宝精品', name: '18K白红金粉红宝石戒指', cashPrice: 1400, pointPrice: 3000, image: 'emoji:💍', stock: 3, isListed: false, category: '奢侈品' },
  { id: 'mp-jw-3', merchantId: 'jewelry', merchantName: 'DIMD 珠宝精品', name: '925纯银项链', cashPrice: 680, pointPrice: 1000, image: 'emoji:📿', stock: 12, isListed: true, category: '奢侈品' },
];

// 商户订单数据
export const mockMerchantOrders: MerchantOrder[] = [
  // 星巴克订单
  {
    id: 'mo-sb-1',
    userId: '0x1234...5678',
    userAddress: '0x1234...5678',
    productId: 'mp-sb-1',
    productName: '美式咖啡',
    merchantId: 'starbucks',
    merchantName: '星巴克咖啡',
    cashPrice: 22,
    pointPrice: 100,
    quantity: 2,
    timestamp: Date.now() - 3600000,
    status: 'pending',
    shippingAddress: { name: '张三', phone: '13800138000', address: '北京市朝阳区某某路123号' }
  },
  {
    id: 'mo-sb-2',
    userId: '0x2345...6789',
    userAddress: '0x2345...6789',
    productId: 'mp-sb-2',
    productName: '拿铁咖啡',
    merchantId: 'starbucks',
    merchantName: '星巴克咖啡',
    cashPrice: 28,
    pointPrice: 120,
    quantity: 1,
    timestamp: Date.now() - 86400000,
    status: 'shipped',
    shippingAddress: { name: '李四', phone: '13900139000', address: '上海市浦东新区某某大道456号' }
  },
  {
    id: 'mo-sb-3',
    userId: '0x3456...7890',
    userAddress: '0x3456...7890',
    productId: 'mp-sb-4',
    productName: '焦糖玛奇朵',
    merchantId: 'starbucks',
    merchantName: '星巴克咖啡',
    cashPrice: 32,
    pointPrice: 150,
    quantity: 1,
    timestamp: Date.now() - 172800000,
    status: 'shipped',
    shippingAddress: { name: '王五', phone: '13700137000', address: '广州市天河区某某街789号' }
  },
  // Nike 订单
  {
    id: 'mo-nk-1',
    userId: '0x4567...8901',
    userAddress: '0x4567...8901',
    productId: 'mp-nk-1',
    productName: 'Air Max 运动鞋',
    merchantId: 'nike',
    merchantName: 'Nike 运动',
    cashPrice: 799,
    pointPrice: 1000,
    quantity: 1,
    timestamp: Date.now() - 7200000,
    status: 'pending',
    shippingAddress: { name: '赵六', phone: '13600136000', address: '深圳市南山区某某巷321号' }
  },
  {
    id: 'mo-nk-2',
    userId: '0x5678...9012',
    userAddress: '0x5678...9012',
    productId: 'mp-nk-2',
    productName: 'Dri-FIT 运动T恤',
    merchantId: 'nike',
    merchantName: 'Nike 运动',
    cashPrice: 199,
    pointPrice: 300,
    quantity: 3,
    timestamp: Date.now() - 259200000,
    status: 'shipped',
    shippingAddress: { name: '孙七', phone: '13500135000', address: '杭州市西湖区某某路654号' }
  },
  {
    id: 'mo-nk-3',
    userId: '0x6789...0123',
    userAddress: '0x6789...0123',
    productId: 'mp-nk-4',
    productName: 'Air Force 1 板鞋',
    merchantId: 'nike',
    merchantName: 'Nike 运动',
    cashPrice: 699,
    pointPrice: 800,
    quantity: 1,
    timestamp: Date.now() - 432000000,
    status: 'shipped',
    shippingAddress: { name: '周八', phone: '13400134000', address: '成都市武侯区某某大道147号' }
  },
  // Apple 订单
  {
    id: 'mo-ap-1',
    userId: '0x7890...1234',
    userAddress: '0x7890...1234',
    productId: 'mp-ap-1',
    productName: 'AirPods Pro',
    merchantId: 'apple',
    merchantName: 'Apple Store',
    cashPrice: 1499,
    pointPrice: 2000,
    quantity: 1,
    timestamp: Date.now() - 14400000,
    status: 'pending',
    shippingAddress: { name: '吴九', phone: '13300133000', address: '武汉市江汉区某某街258号' }
  },
  {
    id: 'mo-ap-2',
    userId: '0x8901...2345',
    userAddress: '0x8901...2345',
    productId: 'mp-ap-2',
    productName: 'Apple Watch SE',
    merchantId: 'apple',
    merchantName: 'Apple Store',
    cashPrice: 1699,
    pointPrice: 2000,
    quantity: 1,
    timestamp: Date.now() - 345600000,
    status: 'shipped',
    shippingAddress: { name: '郑十', phone: '13200132000', address: '南京市鼓楼区某某路369号' }
  },
  // 母婴订单
  {
    id: 'mo-bb-1',
    userId: '0x9012...3456',
    userAddress: '0x9012...3456',
    productId: 'mp-bb-1',
    productName: '4合1滑梯秋千套装',
    merchantId: 'baby',
    merchantName: 'Ealing 母婴旗舰店',
    cashPrice: 669,
    pointPrice: 800,
    quantity: 1,
    timestamp: Date.now() - 21600000,
    status: 'pending',
    shippingAddress: { name: '钱一', phone: '13100131000', address: '重庆市渝北区某某街道741号' }
  },
  {
    id: 'mo-bb-2',
    userId: '0x0123...4567',
    userAddress: '0x0123...4567',
    productId: 'mp-bb-3',
    productName: '婴儿健身架',
    merchantId: 'baby',
    merchantName: 'Ealing 母婴旗舰店',
    cashPrice: 299,
    pointPrice: 350,
    quantity: 2,
    timestamp: Date.now() - 518400000,
    status: 'shipped',
    shippingAddress: { name: '周二', phone: '13000130000', address: '天津市和平区某某巷852号' }
  },
  // 珠宝订单
  {
    id: 'mo-jw-1',
    userId: '0xabcd...ef01',
    userAddress: '0xabcd...ef01',
    productId: 'mp-jw-1',
    productName: '18K白金橄榄石戒指',
    merchantId: 'jewelry',
    merchantName: 'DIMD 珠宝精品',
    cashPrice: 3100,
    pointPrice: 5000,
    quantity: 1,
    timestamp: Date.now() - 10800000,
    status: 'pending',
    shippingAddress: { name: '陈三', phone: '15600156000', address: '苏州市姑苏区某某路963号' }
  },
  {
    id: 'mo-jw-2',
    userId: '0xbcde...f012',
    userAddress: '0xbcde...f012',
    productId: 'mp-jw-3',
    productName: '925纯银项链',
    merchantId: 'jewelry',
    merchantName: 'DIMD 珠宝精品',
    cashPrice: 680,
    pointPrice: 1000,
    quantity: 1,
    timestamp: Date.now() - 604800000,
    status: 'shipped',
    shippingAddress: { name: '林五', phone: '15500155000', address: '厦门市思明区某某街741号' }
  },
];

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

export const mockRewardProducts: RewardProduct[] = [
  // 母婴商品（重点展示）
  {
    id: 'reward-baby-1',
    productId: 'bb-1',
    merchantId: 'baby',
    merchantName: 'Ealing 母婴旗舰店',
    name: 'Ealing 4合1滑梯秋千套装',
    originalPrice: 869,
    pointCost: 869,
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
    pointCost: 579,
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
    pointCost: 4100,
    image: '/products/jewelry/01-olivine-ring.png',
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
    pointCost: 2400,
    image: '/products/jewelry/02-ruby-ring.png',
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
    pointCost: 1999,
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
    pointCost: 899,
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
    pointCost: 32,
    image: 'emoji:☕',
    category: '餐饮',
    stock: 999
  }
];
