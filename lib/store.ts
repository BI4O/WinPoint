import { create } from 'zustand';
import {
  mockUserInitial,
  mockOrdersInitial,
  mockActivitiesInitial,
  type Order,
  type Activity
} from './mock-data';

interface UserState {
  address: string;
  credit: number;
  share: number;
  earnings: number;
}

interface AppState {
  user: UserState;
  orders: Order[];
  activities: Activity[];
  consumeAtMerchant: (merchantId: number, merchantName: string, amount: number) => void;
  stakeCredit: (amount: number) => void;
  sellShare: (amount: number, price: number) => void;
  buyShare: (orderId: number, amount: number, price: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: mockUserInitial,
  orders: mockOrdersInitial,
  activities: mockActivitiesInitial,

  consumeAtMerchant: (merchantId, merchantName, amount) => {
    const creditEarned = amount / 10;
    const newOrder: Order = {
      id: Date.now(),
      date: new Date().toLocaleString('zh-CN'),
      merchant: merchantName,
      merchantId,
      amount,
      creditEarned,
      status: 'completed'
    };

    const newActivity: Activity = {
      id: Date.now(),
      type: 'credit_earned',
      amount: creditEarned,
      merchant: merchantName,
      timestamp: new Date().toLocaleString('zh-CN')
    };

    set(state => ({
      user: {
        ...state.user,
        credit: state.user.credit + creditEarned
      },
      orders: [newOrder, ...state.orders],
      activities: [newActivity, ...state.activities]
    }));
  },

  stakeCredit: (amount) => {
    const { user } = get();
    if (user.credit < amount) return;

    const newActivity: Activity = {
      id: Date.now(),
      type: 'credit_staked',
      amount,
      timestamp: new Date().toLocaleString('zh-CN')
    };

    set(state => ({
      user: {
        ...state.user,
        credit: state.user.credit - amount,
        share: state.user.share + amount
      },
      activities: [newActivity, ...state.activities]
    }));
  },

  sellShare: (amount, price) => {
    const { user } = get();
    if (user.share < amount) return;

    set(state => ({
      user: {
        ...state.user,
        share: state.user.share - amount,
        earnings: state.user.earnings + (amount * price)
      }
    }));
  },

  buyShare: (orderId, amount, price) => {
    set(state => ({
      user: {
        ...state.user,
        share: state.user.share + amount,
        earnings: state.user.earnings - (amount * price)
      }
    }));
  }
}));
