'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';
import { useStore } from '@/lib/store';

const EMOJI_OPTIONS = ['☕', '🍔', '👟', '🎧', '⌚', '👜', '💎', '👶'];

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantId: string;
  merchantName: string;
}

export default function AddProductModal({ isOpen, onClose, merchantId, merchantName }: AddProductModalProps) {
  const addMerchantProduct = useStore(state => state.addMerchantProduct);
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('☕');
  const [cashPrice, setCashPrice] = useState('');
  const [pointPrice, setPointPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isInfinite, setIsInfinite] = useState(false);
  const [isListed, setIsListed] = useState(true);

  const handleSubmit = () => {
    if (!name || !cashPrice || !pointPrice) return;

    addMerchantProduct({
      merchantId,
      merchantName,
      name,
      image: `emoji:${selectedEmoji}`,
      cashPrice: Number(cashPrice),
      pointPrice: Number(pointPrice),
      stock: isInfinite ? 9999 : Number(stock),
      isListed,
      category: '默认'
    });

    // Reset form
    setName('');
    setSelectedEmoji('☕');
    setCashPrice('');
    setPointPrice('');
    setStock('');
    setIsInfinite(false);
    setIsListed(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-333">新增商品</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">商品名称</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="输入商品名称"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
              />
            </div>

            {/* Emoji Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">商品图标</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? 'bg-md-primary/10 ring-2 ring-md-primary'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Price */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">现金价 (¥)</label>
              <input
                type="number"
                value={cashPrice}
                onChange={e => setCashPrice(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
              />
            </div>

            {/* Point Price */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">积分价</label>
              <input
                type="number"
                value={pointPrice}
                onChange={e => setPointPrice(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">库存数量</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={stock}
                  onChange={e => setStock(e.target.value)}
                  placeholder="0"
                  disabled={isInfinite}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none disabled:bg-gray-100"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInfinite}
                    onChange={e => setIsInfinite(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-md-primary focus:ring-md-primary"
                  />
                  <span className="text-sm text-gray-333">无限</span>
                </label>
              </div>
            </div>

            {/* Listed Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-333">立即上架积分商城</span>
              <button
                onClick={() => setIsListed(!isListed)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isListed ? 'bg-md-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    isListed ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onClose}
              variant="outlined"
              size="lg"
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              variant="filled"
              size="lg"
              className="flex-1"
              disabled={!name || !cashPrice || !pointPrice}
            >
              添加商品
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
