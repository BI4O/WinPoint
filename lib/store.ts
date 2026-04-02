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
  type MerchantOrder,
  type Product,
  type CartItem
} from './mock-data';

// 身份状态
type IdentityMode = 'user' | 'merchant';
type MerchantId = 'starbucks' | 'nike' | 'apple' | 'baby' | 'jewelry';

interface UserState {
  address: string;
  point: number;
  earnings: number;
}

interface AppState {
  user: UserState;
  orders: Order[];
  activities: Activity[];

  // 购物车相关
  cart: CartItem[];

  // 商户商品管理
  merchantProducts: MerchantProduct[];
  merchantOrders: MerchantOrder[];

  // 身份状态
  identityMode: IdentityMode;
  currentMerchantId: MerchantId | null;

  // actions
  setIdentityMode: (mode: IdentityMode, merchantId?: MerchantId) => void;
  addMerchantProduct: (product: Omit<MerchantProduct, 'id'>) => void;

  // 原有 actions
  consumeAtMerchant: (merchantId: string, merchantName: string, amount: number) => void;

  // 购物车 actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (merchantId: string, merchantName: string) => void;
  getCartTotal: () => number;
  getCartPointTotal: () => number;
  getCartItemCount: () => number;

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
  cart: [],
  merchantProducts: mockMerchantProducts,
  merchantOrders: mockMerchantOrders,

  identityMode: 'user' as IdentityMode,
  currentMerchantId: null as MerchantId | null,

  setIdentityMode: (mode, merchantId) => {
    set({
      identityMode: mode,
      currentMerchantId: mode === 'merchant' ? (merchantId || 'starbucks') : null
    });
  },

  addMerchantProduct: (product) => {
    const newProduct: MerchantProduct = {
      ...product,
      id: `mp-${Date.now()}`
    };
    set(state => ({
      merchantProducts: [...state.merchantProducts, newProduct]
    }));
  },

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
