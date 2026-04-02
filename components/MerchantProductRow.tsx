'use client';

import { useState } from 'react';
import { MerchantProduct } from '@/lib/mock-data';
import { useStore } from '@/lib/store';
import { Switch } from '@mui/material';
import { Edit2, Save, X } from 'lucide-react';

interface MerchantProductRowProps {
  product: MerchantProduct;
}

export default function MerchantProductRow({ product }: MerchantProductRowProps) {
  const updateMerchantProduct = useStore(state => state.updateMerchantProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    pointPrice: product.pointPrice,
    stock: product.stock,
    isListed: product.isListed
  });

  const handleSave = () => {
    updateMerchantProduct(product.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      pointPrice: product.pointPrice,
      stock: product.stock,
      isListed: product.isListed
    });
    setIsEditing(false);
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{product.image}</span>
          <div>
            <p className="font-medium text-gray-333">{product.name}</p>
            <p className="text-xs text-gray-500">{product.category}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        ¥{product.cashPrice}
      </td>
      <td className="py-3 px-4">
        {isEditing ? (
          <input
            type="number"
            value={editData.pointPrice}
            onChange={(e) => setEditData(prev => ({ ...prev, pointPrice: Number(e.target.value) }))}
            className="w-24 px-2 py-1 border border-gray-200 rounded-lg text-center"
          />
        ) : (
          <span className="text-md-primary font-medium">{product.pointPrice}</span>
        )}
      </td>
      <td className="py-3 px-4">
        {isEditing ? (
          <input
            type="number"
            value={editData.stock}
            onChange={(e) => setEditData(prev => ({ ...prev, stock: Number(e.target.value) }))}
            className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-center"
          />
        ) : (
          <span className={product.stock < 10 ? 'text-red-500' : 'text-gray-333'}>
            {product.stock}
          </span>
        )}
      </td>
      <td className="py-3 px-4">
        <Switch
          checked={editData.isListed}
          onChange={(e) => setEditData(prev => ({ ...prev, isListed: e.target.checked }))}
          disabled={!isEditing}
          size="small"
        />
      </td>
      <td className="py-3 px-4">
        {isEditing ? (
          <div className="flex items-center gap-2 justify-center">
            <button
              onClick={handleSave}
              className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
}
