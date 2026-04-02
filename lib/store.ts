import { create } from 'zustand';
import {
  mockUserInitial,
  mockOrdersInitial,
  mockActivitiesInitial,
  mockMerchantProducts,
  mockMerchantOrders,
  type Order,
  type Activity,
  type MerchantProduct,
  type MerchantOrder
} from './mock-data';

interface UserState {
  address: string;
  point: number;
  earnings: number;
}

interface AppState {
  user: UserState;
  orders: Order[];
  activities: Activity[];

  // 商户商品管理
  merchantProducts: MerchantProduct[];
  merchantOrders: MerchantOrder[];

  // 原有 actions
  consumeAtMerchant: (merchantId: string, merchantName: string, amount: number) => void;

  // 商户商品 actions
  updateMerchantProduct: (productId: string, updates: Partial<MerchantProduct>) => void;
  getMerchantProducts: (merchantId: string) => MerchantProduct[];

  // 商户订单 actions
  shipOrder: (orderId: string) => void;
  getMerchantOrders: (merchantId: string) => MerchantOrder[];

  // 用户兑换 actions
  redeemProduct: (
    productId: string,
    productName: string,
    merchantId: string,
    merchantName: string,
    cashPrice: number,
    pointPrice: number,
    shippingAddress: { name: string; phone: string; address: string }
  ) => boolean;
}

export const useStore = create<AppState>((set, get) => ({
  user: {
    address: mockUserInitial.address,
    point: mockUserInitial.point,
    earnings: mockUserInitial.earnings
  },
  orders: mockOrdersInitial,
  activities: mockActivitiesInitial,
  merchantProducts: mockMerchantProducts,
  merchantOrders: mockMerchantOrders,

  consumeAtMerchant: (merchantId, merchantName, amount) => {
    const pointEarned = amount / 10;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      timestamp: Date.now(),
      merchantId,
      merchantName,
      items: [{ productId: 'manual', productName: '手动输入消费', price: amount, quantity: 1 }],
      totalAmount: amount,
      pointEarned,
      status: 'completed'
    };

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      type: 'point_earned',
      amount: pointEarned,
      merchant: merchantName,
      timestamp: Date.now()
    };

    set(state => ({
      user: {
        ...state.user,
        point: state.user.point + pointEarned
      },
      orders: [newOrder, ...state.orders],
      activities: [newActivity, ...state.activities]
    }));
  },

  // 商户商品 actions
  updateMerchantProduct: (productId, updates) => {
    set(state => ({
      merchantProducts: state.merchantProducts.map(p =>
        p.id === productId ? { ...p, ...updates } : p
      )
    }));
  },

  getMerchantProducts: (merchantId) => {
    return get().merchantProducts.filter(p => p.merchantId === merchantId);
  },

  // 商户订单 actions
  shipOrder: (orderId) => {
    set(state => ({
      merchantOrders: state.merchantOrders.map(o =>
        o.id === orderId ? { ...o, status: 'shipped' } : o
      )
    }));
  },

  getMerchantOrders: (merchantId) => {
    return get().merchantOrders.filter(o => o.merchantId === merchantId);
  },

  // 用户兑换
  redeemProduct: (productId, productName, merchantId, merchantName, cashPrice, pointPrice, shippingAddress) => {
    const { user, merchantProducts } = get();

    // 检查积分余额
    if (user.point < pointPrice) {
      return false;
    }

    const product = merchantProducts.find(p => p.id === productId);
    if (!product || product.stock < 1) {
      return false;
    }

    // 扣积分
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      type: 'point_redeemed',
      amount: pointPrice,
      timestamp: Date.now(),
      rewardProductName: productName,
      pointSpent: pointPrice
    };

    // 创建订单
    const newOrder: MerchantOrder = {
      id: `mo-${Date.now()}`,
      userId: user.address,
      userAddress: user.address,
      productId,
      productName,
      merchantId,
      merchantName,
      cashPrice,
      pointPrice,
      quantity: 1,
      timestamp: Date.now(),
      status: 'pending',
      shippingAddress
    };

    set(state => ({
      user: {
        ...state.user,
        point: state.user.point - pointPrice
      },
      merchantProducts: state.merchantProducts.map(p =>
        p.id === productId ? { ...p, stock: p.stock - 1 } : p
      ),
      merchantOrders: [newOrder, ...state.merchantOrders],
      activities: [newActivity, ...state.activities]
    }));

    return true;
  }
}));
