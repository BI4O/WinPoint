'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { BENEFIT_TYPES } from '@/lib/mock-data';
import Card from './Card';
import Button from './Button';
import AddBenefitModal from './AddBenefitModal';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

export default function BenefitsList() {
  const currentMerchantId = useStore(state => state.currentMerchantId);
  const merchantBenefits = useStore(state => state.merchantBenefits);
  const updateMerchantBenefit = useStore(state => state.updateMerchantBenefit);
  const deleteMerchantBenefit = useStore(state => state.deleteMerchantBenefit);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<string | null>(null);

  const merchantBenefitsList = currentMerchantId
    ? merchantBenefits.filter(b => b.merchantId === currentMerchantId)
    : [];

  const getBenefitIcon = (type: string) => {
    const benefitType = BENEFIT_TYPES.find(t => t.type === type);
    return benefitType?.icon || '📦';
  };

  const handleToggleListed = (benefitId: string, currentListed: boolean) => {
    updateMerchantBenefit(benefitId, { isListed: !currentListed });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-333">我的权益</h3>
          <p className="text-sm text-gray-500">管理您的福利商品，设置 WIN 积分兑换价格</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          新增权益
        </Button>
      </div>

      {/* Benefits Grid */}
      {merchantBenefitsList.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🎁</div>
          <p className="text-gray-500">暂无权益</p>
          <p className="text-sm text-gray-400 mt-1">点击上方按钮创建您的第一个权益</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {merchantBenefitsList.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className={`p-5 ${!benefit.isListed ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{benefit.image.startsWith('emoji:')
                      ? benefit.image.replace('emoji:', '')
                      : benefit.image}</span>
                    <div>
                      <h4 className="font-bold text-gray-333">{benefit.name}</h4>
                      <p className="text-xs text-gray-500">{getBenefitIcon(benefit.type)} {BENEFIT_TYPES.find(t => t.type === benefit.type)?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleListed(benefit.id, benefit.isListed)}
                      className={`p-2 rounded-lg transition-colors ${
                        benefit.isListed
                          ? 'text-green-500 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={benefit.isListed ? '已上架' : '已下架'}
                    >
                      {benefit.isListed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-md-primary">{benefit.winPrice}</p>
                    <p className="text-xs text-gray-400">WIN 积分</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {benefit.stock === null ? '无限库存' : `库存 ${benefit.stock}`}
                    </p>
                    <p className="text-xs text-gray-400">有效期 {benefit.validDays} 天</p>
                  </div>
                </div>

                {benefit.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{benefit.description}</p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditingBenefit(benefit.id)}
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    编辑
                  </Button>
                  <Button
                    variant="outlined"
                    size="sm"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => deleteMerchantBenefit(benefit.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddBenefitModal
        isOpen={showAddModal || !!editingBenefit}
        onClose={() => {
          setShowAddModal(false);
          setEditingBenefit(null);
        }}
        benefitId={editingBenefit || undefined}
        merchantId={currentMerchantId || 'starbucks'}
      />
    </div>
  );
}
