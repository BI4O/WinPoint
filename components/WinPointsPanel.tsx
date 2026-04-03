'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useStore } from '@/lib/store';

export default function WinPointsPanel() {
  const currentMerchantId = useStore(state => state.currentMerchantId);
  const merchantWinBalance = useStore(state => state.merchantWinBalance);
  const purchaseWin = useStore(state => state.purchaseWin);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [showPurchase, setShowPurchase] = useState(false);

  const balance = currentMerchantId ? merchantWinBalance[currentMerchantId] || 0 : 0;

  const handlePurchase = () => {
    if (!currentMerchantId || !purchaseAmount) return;
    const amount = parseInt(purchaseAmount, 10);
    if (amount > 0) {
      purchaseWin(currentMerchantId, amount);
      setPurchaseAmount('');
      setShowPurchase(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* WIN 余额卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover className="p-6 bg-gradient-to-br from-md-primary/10 to-md-primary/5 border border-md-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">WIN 积分余额</p>
              <p className="text-4xl font-bold text-md-primary">{balance.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-1">≈ ¥{(balance / 10).toFixed(0)}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-md-primary/20 flex items-center justify-center">
              <Coins className="w-7 h-7 text-md-primary" />
            </div>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">本月收入</p>
              <p className="text-3xl font-bold text-green-500">+2,350</p>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 较上月 15%
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-green-500" />
            </div>
          </div>
        </Card>

        <Card hover className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">本月兑换</p>
              <p className="text-3xl font-bold text-orange-500">-1,800</p>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> 128 笔
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
              <TrendingDown className="w-7 h-7 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* 购买积分 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-333">购买 WIN 积分</h3>
          {!showPurchase && (
            <Button
              onClick={() => setShowPurchase(true)}
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              购买
            </Button>
          )}
        </div>

        {showPurchase ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="flex gap-3">
              <input
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="输入购买数量"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-md-primary focus:outline-none"
              />
              <Button onClick={handlePurchase} disabled={!purchaseAmount}>
                确认购买
              </Button>
              <Button variant="outlined" onClick={() => setShowPurchase(false)}>
                取消
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              购买规则：1 WIN = ¥1，每次最低购买 100 WIN
            </p>
          </motion.div>
        ) : (
          <p className="text-gray-400">点击购买按钮为您的账户充值 WIN 积分</p>
        )}
      </Card>
    </div>
  );
}
