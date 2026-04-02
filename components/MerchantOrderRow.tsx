'use client';

import { MerchantOrder } from '@/lib/mock-data';
import { useStore } from '@/lib/store';
import { Package, Truck } from 'lucide-react';

interface MerchantOrderRowProps {
  order: MerchantOrder;
}

export default function MerchantOrderRow({ order }: MerchantOrderRowProps) {
  const shipOrder = useStore(state => state.shipOrder);

  const handleShip = () => {
    shipOrder(order.id);
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <p className="font-medium text-gray-333 text-sm">{order.id}</p>
        <p className="text-xs text-gray-500">
          {new Date(order.timestamp).toLocaleString('zh-CN')}
        </p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-gray-333">{order.productName}</p>
        <p className="text-xs text-gray-500">x{order.quantity}</p>
      </td>
      <td className="py-3 px-4">
        <p className="text-sm">
          <span className="text-gray-500 line-through">¥{order.cashPrice + order.pointPrice}</span>
        </p>
        <p className="text-sm text-gray-333">
          ¥{order.cashPrice} + {order.pointPrice}积分
        </p>
      </td>
      <td className="py-3 px-4">
        <div className="text-sm">
          <p className="text-gray-333">{order.shippingAddress.name}</p>
          <p className="text-gray-500">{order.shippingAddress.phone}</p>
          <p className="text-gray-400 text-xs">{order.shippingAddress.address}</p>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          order.status === 'shipped'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {order.status === 'shipped' ? '已发货' : '待发货'}
        </span>
      </td>
      <td className="py-3 px-4">
        {order.status === 'pending' ? (
          <button
            onClick={handleShip}
            className="flex items-center gap-1 px-3 py-1.5 bg-md-primary text-white rounded-lg hover:bg-md-primary/90 text-sm"
          >
            <Truck className="w-4 h-4" />
            发货
          </button>
        ) : (
          <span className="flex items-center gap-1 text-gray-400 text-sm">
            <Package className="w-4 h-4" />
            已处理
          </span>
        )}
      </td>
    </tr>
  );
}
