'use client';

import { motion } from 'framer-motion';
import { Activity } from '@/lib/mock-data';
import Card from './Card';
import { Coins, Share2, TrendingUp, Gift } from 'lucide-react';

interface ActivityListProps {
  activities: Activity[];
}

const activityConfig = {
  credit_earned: {
    icon: Coins,
    label: '获得 Credit',
    color: 'text-md-success',
    bgColor: 'bg-md-success/10',
    borderColor: 'border-md-success/20'
  },
  credit_staked: {
    icon: Share2,
    label: '质押 Credit',
    color: 'text-md-primary',
    bgColor: 'bg-md-primary/10',
    borderColor: 'border-md-primary/20'
  },
  reward_received: {
    icon: TrendingUp,
    label: '收到收益',
    color: 'text-md-tertiary',
    bgColor: 'bg-md-tertiary/10',
    borderColor: 'border-md-tertiary/20'
  },
  credit_redeemed: {
    icon: Gift,
    label: '兑换商品',
    color: 'text-md-tertiary',
    bgColor: 'bg-md-tertiary/10',
    borderColor: 'border-md-tertiary/20'
  }
};

export default function ActivityList({ activities }: ActivityListProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-md-on-background">
          最近活动
        </h3>
        <span className="text-xs text-md-on-surface-variant">
          最新 5 条
        </span>
      </div>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm text-md-on-surface-variant">
              暂无活动记录
            </p>
          </div>
        ) : (
          activities.slice(0, 5).map((activity, index) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
                className="group"
              >
                <div className={`flex items-center justify-between p-4 rounded-2xl bg-md-surface-container-high border ${config.borderColor} transition-all duration-300 ease-md hover:shadow-md hover:scale-[1.01]`}>
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.bgColor}`}
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`h-6 w-6 ${config.color}`} />
                    </motion.div>
                    <div>
                      <p className="text-sm font-semibold text-md-on-background mb-0.5">
                        {config.label}
                      </p>
                      <p className="text-xs text-md-on-surface-variant">
                        {activity.merchant && `${activity.merchant} · `}
                        {new Date(activity.timestamp).toLocaleString('zh-CN', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    className={`text-sm font-bold ${config.color}`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.08 + 0.1, type: 'spring', stiffness: 200 }}
                  >
                    {activity.type === 'credit_redeemed' ? '-' : '+'}
                    {activity.amount.toFixed(2)}
                  </motion.div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </Card>
  );
}
