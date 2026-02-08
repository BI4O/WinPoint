import { create } from 'zustand';
import {
  mockUserInitial,
  mockOrdersInitial,
  mockActivitiesInitial,
  type Order,
  type Activity,
  type CartItem,
  type Product,
  type RedemptionRecord
} from './mock-data';

interface UserState {
  address: string;
  point: number;
  rwa: number;
  earnings: number;
}

interface AppState {
  user: UserState;
  orders: Order[];
  activities: Activity[];

  // 购物车相关（需求 1）
  cart: CartItem[];

  // 兑换记录（需求 2）
  redemptions: RedemptionRecord[];

  // 原有 actions
  consumeAtMerchant: (merchantId: string, merchantName: string, amount: number) => void;
  stakePoint: (amount: number) => void;
  sellRwa: (amount: number, price: number) => void;
  buyRwa: (orderId: number, amount: number, price: number) => void;

  // 购物车 actions（需求 1）
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (merchantId: string, merchantName: string) => void;
  getCartTotal: () => number;
  getCartPointTotal: () => number;
  getCartItemCount: () => number;

  // 兑换 actions（需求 2）
  redeemProduct: (
    productId: string,
    productName: string,
    merchantName: string,
    pointCost: number
  ) => boolean;
  getUserRedemptions: () => RedemptionRecord[];
}

export const useStore = create<AppState>((set, get) => ({
  user: mockUserInitial,
  orders: mockOrdersInitial,
  activities: mockActivitiesInitial,
  cart: [],
  redemptions: [],

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

  stakePoint: (amount) => {
    const { user } = get();
    if (user.point < amount) return;

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      type: 'point_staked',
      amount,
      timestamp: Date.now()
    };

    set(state => ({
      user: {
        ...state.user,
        point: state.user.point - amount,
        rwa: state.user.rwa + amount
      },
      activities: [newActivity, ...state.activities]
    }));
  },

  sellRwa: (amount, price) => {
    const { user } = get();
    if (user.rwa < amount) return;

    set(state => ({
      user: {
        ...state.user,
        rwa: state.user.rwa - amount,
        earnings: state.user.earnings + (amount * price)
      }
    }));
  },

  buyRwa: (orderId, amount, price) => {
    set(state => ({
      user: {
        ...state.user,
        rwa: state.user.rwa + amount,
        earnings: state.user.earnings - (amount * price)
      }
    }));
  },

  // 购物车 actions
  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
      set({
        cart: cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({ cart: [...cart, { product, quantity: 1 }] });
    }
  },

  removeFromCart: (productId) => {
    set(state => ({
      cart: state.cart.filter(item => item.product.id !== productId)
    }));
  },

  updateCartItemQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    set(state => ({
      cart: state.cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  checkout: (merchantId, merchantName) => {
    const { cart, user } = get();
    const totalAmount = get().getCartTotal();
    const pointEarned = get().getCartPointTotal();

    // 创建订单
    const order: Order = {
      id: `order-${Date.now()}`,
      timestamp: Date.now(),
      merchantId,
      merchantName,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      totalAmount,
      pointEarned,
      status: 'completed'
    };

    // 创建活动记录
    const activity: Activity = {
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
      orders: [order, ...state.orders],
      activities: [activity, ...state.activities],
      cart: []
    }));
  },

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },

  getCartPointTotal: () => {
    return get().getCartTotal() / 10; // 10:1 比例
  },

  getCartItemCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // 兑换 actions（需求 2）
  redeemProduct: (productId, productName, merchantName, pointCost) => {
    const { user } = get();

    // 检查余额
    if (user.point < pointCost) {
      return false;
    }

    // 创建兑换记录
    const redemption: RedemptionRecord = {
      id: `redemption-${Date.now()}`,
      userId: user.address,
      rewardProductId: productId,
      productName,
      merchantName,
      pointCost,
      timestamp: Date.now(),
      status: 'pending'
    };

    // 创建活动记录
    const activity: Activity = {
      id: `activity-${Date.now()}`,
      type: 'point_redeemed',
      amount: pointCost,
      timestamp: Date.now(),
      rewardProductName: productName,
      pointSpent: pointCost
    };

    set(state => ({
      user: {
        ...state.user,
        point: state.user.point - pointCost
      },
      redemptions: [redemption, ...state.redemptions],
      activities: [activity, ...state.activities]
    }));

    return true;
  },

  getUserRedemptions: () => {
    return get().redemptions;
  }
}));
