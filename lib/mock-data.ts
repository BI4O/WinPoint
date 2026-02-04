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
