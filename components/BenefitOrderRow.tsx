'use client';

import { motion } from 'framer-motion';
import { MerchantBenefitOrder } from '@/lib/mock-data';
import { useStore } from '@/lib/store';
import { CheckCircle, Clock, XCircle, Copy } from 'lucide-react';
import { useState } from 'react';

interface BenefitOrderRowProps {
  order: MerchantBenefitOrder;
}

export default function BenefitOrderRow({ order }: BenefitOrderRowProps) {
  const redeemVoucher = useStore(state => state.useVoucher);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseVoucher = () => {
    redeemVoucher(order.voucherCode);
  };

  const getStatusBadge = () => {
    switch (order.status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
            <Clock className="w-3 h-3" />
            待核销
          </span>
        );
      case 'used':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            已核销
          </span>
        );
      case 'expired':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
            <XCircle className="w-3 h-3" />
            已过期
          </span>
        );
      default:
        return null;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <p className="font-medium text-gray-333">{order.benefitName}</p>
        <p className="text-xs text-gray-500">{order.merchantName}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-500">
            {order.userAddress.slice(0, 8)}...{order.userAddress.slice(-4)}
          </span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
            {order.voucherCode}
          </code>
          <button
            onClick={handleCopyCode}
            className="p-1 rounded hover:bg-gray-200 text-gray-400"
            title="复制券码"
          >
            <Copy className="w-4 h-4" />
          </button>
          {copied && <span className="text-xs text-green-500">已复制</span>}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-md-primary">{order.winPrice}</span>
          <span className="text-xs text-gray-500">WIN</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-gray-500">{formatTime(order.timestamp)}</p>
        {order.usedAt && (
          <p className="text-xs text-gray-400">核销: {formatTime(order.usedAt)}</p>
        )}
      </td>
      <td className="py-3 px-4">
        {getStatusBadge()}
      </td>
      <td className="py-3 px-4">
        {order.status === 'pending' && (
          <button
            onClick={handleUseVoucher}
            className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
          >
            核销
          </button>
        )}
      </td>
    </tr>
  );
}
