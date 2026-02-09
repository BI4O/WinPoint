import { create } from 'zustand';
import {
  mockUserInitial,
  mockOrdersInitial,
  mockActivitiesInitial,
  mockOrderBook,
  mockUserOrders,
  type Order,
  type Activity,
  type CartItem,
  type Product,
  type RedemptionRecord,
  type OrderBook,
  type TradeOrder
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

  // 交易市场相关（需求 3）
  orderBook: OrderBook;
  currentOrders: TradeOrder[];
  historicalOrders: TradeOrder[];

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

  // 交易市场 actions（需求 3）
  placeBuyOrder: (price: number, quantity: number) => boolean;
  placeSellOrder: (price: number, quantity: number) => boolean;
  cancelOrder: (orderId: string) => boolean;
  refreshOrders: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: mockUserInitial,
  orders: mockOrdersInitial,
  activities: mockActivitiesInitial,
  cart: [],
  redemptions: [],
  orderBook: mockOrderBook,
  currentOrders: mockUserOrders.filter(o => o.status === 'pending' || o.status === 'partial'),
  historicalOrders: mockUserOrders.filter(o => o.status === 'fulfilled' || o.status === 'cancelled'),

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
  },

  // 交易市场 actions（需求 3）
  placeBuyOrder: (price, quantity) => {
    const { user, orderBook } = get();
    const totalAmount = price * quantity;

    // 检查 USDT 余额
    if (user.earnings < totalAmount) {
      return false;
    }

    // 创建买单
    const newOrder: TradeOrder = {
      id: `trade-${Date.now()}`,
      type: 'buy',
      price,
      quantity,
      totalAmount,
      timestamp: Date.now(),
      status: 'pending',
      filledQuantity: 0
    };

    // 判断是否为市价订单（使用最新成交价）
    const marketPrice = orderBook.lastPrice || 0;
    const isMarketOrder = Math.abs(price - marketPrice) < 0.0001;

    if (isMarketOrder) {
      // 市价订单：直接完全成交
      newOrder.status = 'fulfilled';
      newOrder.filledQuantity = quantity;

      set(state => ({
        user: {
          ...state.user,
          earnings: state.user.earnings - totalAmount,
          rwa: state.user.rwa + quantity
        },
        historicalOrders: [newOrder, ...state.historicalOrders]
      }));
    } else {
      // 非市价订单：挂单待成交
      set(state => ({
        user: {
          ...state.user,
          earnings: state.user.earnings - totalAmount
        },
        currentOrders: [newOrder, ...state.currentOrders]
      }));
    }

    return true;
  },

  placeSellOrder: (price, quantity) => {
    const { user, orderBook } = get();
    const totalAmount = price * quantity;

    // 检查 RWA 余额
    if (user.rwa < quantity) {
      return false;
    }

    // 创建卖单
    const newOrder: TradeOrder = {
      id: `trade-${Date.now()}`,
      type: 'sell',
      price,
      quantity,
      totalAmount,
      timestamp: Date.now(),
      status: 'pending',
      filledQuantity: 0
    };

    // 判断是否为市价订单（使用最新成交价）
    const marketPrice = orderBook.lastPrice || 0;
    const isMarketOrder = Math.abs(price - marketPrice) < 0.0001;

    if (isMarketOrder) {
      // 市价订单：直接完全成交
      newOrder.status = 'fulfilled';
      newOrder.filledQuantity = quantity;

      set(state => ({
        user: {
          ...state.user,
          rwa: state.user.rwa - quantity,
          earnings: state.user.earnings + totalAmount
        },
        historicalOrders: [newOrder, ...state.historicalOrders]
      }));
    } else {
      // 非市价订单：挂单待成交
      set(state => ({
        user: {
          ...state.user,
          rwa: state.user.rwa - quantity
        },
        currentOrders: [newOrder, ...state.currentOrders]
      }));
    }

    return true;
  },

  cancelOrder: (orderId) => {
    const { currentOrders } = get();
    const order = currentOrders.find(o => o.id === orderId);

    if (!order) {
      return false;
    }

    // 退还未成交的资金
    const unfilledQuantity = order.quantity - (order.filledQuantity || 0);
    const refundAmount = order.price * unfilledQuantity;

    // 更新订单状态
    const cancelledOrder: TradeOrder = {
      ...order,
      status: 'cancelled'
    };

    set(state => ({
      user: {
        ...state.user,
        // 买单退还 USDT，卖单退还 RWA
        earnings: order.type === 'buy'
          ? state.user.earnings + refundAmount
          : state.user.earnings,
        rwa: order.type === 'sell'
          ? state.user.rwa + unfilledQuantity
          : state.user.rwa
      },
      currentOrders: state.currentOrders.filter(o => o.id !== orderId),
      historicalOrders: [cancelledOrder, ...state.historicalOrders]
    }));

    return true;
  },

  refreshOrders: () => {
    // 这个方法用于刷新订单状态，当前是简化实现
    // 在真实场景中，这里会从后端重新获取订单数据
    const allOrders = [...get().currentOrders, ...get().historicalOrders];

    set({
      currentOrders: allOrders.filter(o => o.status === 'pending' || o.status === 'partial'),
      historicalOrders: allOrders.filter(o => o.status === 'fulfilled' || o.status === 'cancelled')
    });
  }
}));
