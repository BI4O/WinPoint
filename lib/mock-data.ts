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
