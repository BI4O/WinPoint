'use client';

import { FileSearch } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';
import { type TradeOrder } from '@/lib/mock-data';

interface OrderHistoryTableProps {
  orders: TradeOrder[];
  showActions?: boolean;
  onCancelOrder?: (orderId: string) => void;
}

export default function OrderHistoryTable({
  orders,
  showActions = false,
  onCancelOrder
}: OrderHistoryTableProps) {
  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-md-on-surface-variant"
      >
        <FileSearch className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg">暂无数据</p>
      </motion.div>
    );
  }

  const getStatusColor = (status: TradeOrder['status']) => {
    switch (status) {
      case 'fulfilled':
        return 'text-success';
      case 'cancelled':
        return 'text-error';
      case 'pending':
      case 'partial':
        return 'text-yellow-500';
      default:
        return 'text-md-on-surface-variant';
    }
  };

  const getStatusText = (status: TradeOrder['status']) => {
    switch (status) {
      case 'fulfilled':
        return '已完成';
      case 'cancelled':
        return '已取消';
      case 'pending':
        return '待成交';
      case 'partial':
        return '部分成交';
      default:
        return status;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-md-outline-variant/20">
            <th className="px-4 py-3 text-left text-sm font-medium text-md-on-surface-variant">
              日期
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-md-on-surface-variant">
              交易对
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-md-on-surface-variant">
              类型
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-md-on-surface-variant">
              单价
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-md-on-surface-variant">
              数量
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-md-on-surface-variant">
              订单总额
            </th>
            <th className="px-4 py-3 text-center text-sm font-medium text-md-on-surface-variant">
              状态
            </th>
            {showActions && (
              <th className="px-4 py-3 text-center text-sm font-medium text-md-on-surface-variant">
                操作
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b border-md-outline-variant/10 even:bg-md-surface-container-low/50 hover:bg-md-surface-container-low transition-colors"
            >
              <td className="px-4 py-4 text-sm text-md-on-surface">
                {new Date(order.timestamp).toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td className="px-4 py-4 text-sm text-md-on-surface font-mono">
                RWA/USDT
              </td>
              <td className="px-4 py-4 text-sm">
                <span
                  className={`font-semibold ${
                    order.type === 'buy' ? 'text-success' : 'text-error'
                  }`}
                >
                  {order.type === 'buy' ? '买入' : '卖出'}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-md-on-surface text-right font-mono">
                {order.price.toFixed(4)}
              </td>
              <td className="px-4 py-4 text-sm text-md-on-surface text-right font-mono">
                {order.quantity.toFixed(4)}
              </td>
              <td className="px-4 py-4 text-sm text-md-on-surface text-right font-mono">
                {order.totalAmount.toFixed(4)}
              </td>
              <td className="px-4 py-4 text-sm text-center">
                <span className={`font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </td>
              {showActions && (
                <td className="px-4 py-4 text-center">
                  {(order.status === 'pending' || order.status === 'partial') && (
                    <Button
                      variant="text"
                      size="sm"
                      onClick={() => onCancelOrder?.(order.id)}
                      className="text-error hover:bg-error/10"
                    >
                      取消
                    </Button>
                  )}
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
