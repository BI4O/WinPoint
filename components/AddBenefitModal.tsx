'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';
import { useStore } from '@/lib/store';
import { BENEFIT_TYPES, mockMerchants } from '@/lib/mock-data';

interface AddBenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  benefitId?: string;
  merchantId: string;
}

const EMOJI_OPTIONS = ['🅿️', '🍽️', '🎁', '☕', '📦', '🏷️', '🛡️', '✂️', '📷', '🎀', '🥮', '🏋️'];

export default function AddBenefitModal({ isOpen, onClose, benefitId, merchantId }: AddBenefitModalProps) {
  const addMerchantBenefit = useStore(state => state.addMerchantBenefit);
  const updateMerchantBenefit = useStore(state => state.updateMerchantBenefit);
  const merchantBenefits = useStore(state => state.merchantBenefits);

  const [formData, setFormData] = useState({
    name: '',
    type: 'custom' as 'parking' | 'dining' | 'gift' | 'beverage' | 'custom',
    winPrice: '',
    stock: '',
    isInfiniteStock: false,
    validDays: '30',
    isListed: true,
    description: '',
    selectedEmoji: '📦',
  });

  useEffect(() => {
    if (benefitId) {
      const benefit = merchantBenefits.find(b => b.id === benefitId);
      if (benefit) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          name: benefit.name,
          type: benefit.type,
          winPrice: String(benefit.winPrice),
          stock: benefit.stock === null ? '' : String(benefit.stock),
          isInfiniteStock: benefit.stock === null,
          validDays: String(benefit.validDays),
          isListed: benefit.isListed,
          description: benefit.description || '',
          selectedEmoji: benefit.image.startsWith('emoji:') ? benefit.image.replace('emoji:', '') : '📦',
        });
      }
    } else {
      // Reset form
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: '',
        type: 'custom',
        winPrice: '',
        stock: '',
        isInfiniteStock: false,
        validDays: '30',
        isListed: true,
        description: '',
        selectedEmoji: '📦',
      });
    }
  }, [benefitId, merchantBenefits, isOpen]);

  const merchantName = mockMerchants.find(m => m.id === merchantId)?.name || '商户';

  const handleSubmit = () => {
    if (!formData.name || !formData.winPrice) return;

    const benefitData = {
      merchantId,
      merchantName,
      name: formData.name,
      type: formData.type,
      winPrice: parseInt(formData.winPrice, 10),
      stock: formData.isInfiniteStock ? null : (formData.stock ? parseInt(formData.stock, 10) : 0),
      dailyLimit: null,
      validDays: parseInt(formData.validDays, 10),
      isListed: formData.isListed,
      description: formData.description,
      image: `emoji:${formData.selectedEmoji}`,
    };

    if (benefitId) {
      updateMerchantBenefit(benefitId, benefitData);
    } else {
      addMerchantBenefit(benefitData);
    }

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
          className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-333">
              {benefitId ? '编辑权益' : '新增权益'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">权益名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="如：停车2小时"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">权益类型</label>
              <div className="flex flex-wrap gap-2">
                {BENEFIT_TYPES.map(t => (
                  <button
                    key={t.type}
                    onClick={() => setFormData(prev => ({ ...prev, type: t.type }))}
                    className={`px-3 py-2 rounded-xl text-sm flex items-center gap-1 transition-all ${
                      formData.type === t.type
                        ? 'bg-md-primary/10 text-md-primary ring-2 ring-md-primary'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">图标</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setFormData(prev => ({ ...prev, selectedEmoji: emoji }))}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      formData.selectedEmoji === emoji
                        ? 'bg-md-primary/10 ring-2 ring-md-primary'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* WIN Price */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">所需 WIN 积分</label>
              <input
                type="number"
                value={formData.winPrice}
                onChange={e => setFormData(prev => ({ ...prev, winPrice: e.target.value }))}
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
                  value={formData.stock}
                  onChange={e => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  placeholder="0"
                  disabled={formData.isInfiniteStock}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none disabled:bg-gray-100"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isInfiniteStock}
                    onChange={e => setFormData(prev => ({ ...prev, isInfiniteStock: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-md-primary focus:ring-md-primary"
                  />
                  <span className="text-sm text-gray-333">无限</span>
                </label>
              </div>
            </div>

            {/* Valid Days */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">有效期（天）</label>
              <input
                type="number"
                value={formData.validDays}
                onChange={e => setFormData(prev => ({ ...prev, validDays: e.target.value }))}
                placeholder="30"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-333 mb-1.5">描述（可选）</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="使用说明..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none resize-none"
              />
            </div>

            {/* Listed Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-333">立即上架</span>
              <button
                onClick={() => setFormData(prev => ({ ...prev, isListed: !prev.isListed }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  formData.isListed ? 'bg-md-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    formData.isListed ? 'translate-x-7' : 'translate-x-1'
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
              disabled={!formData.name || !formData.winPrice}
            >
              {benefitId ? '保存' : '创建'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}