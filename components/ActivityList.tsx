'use client';

import { motion } from 'framer-motion';
import { Activity } from '@/lib/mock-data';
import Card from './Card';
import { Coins, Share2, TrendingUp } from 'lucide-react';

interface ActivityListProps {
  activities: Activity[];
}

const activityConfig = {
  credit_earned: {
    icon: Coins,
    label: '获得 Credit',
    color: 'text-md-success',
    bgColor: 'bg-md-success/10'
  },
  credit_staked: {
    icon: Share2,
    label: '质押 Credit',
    color: 'text-md-primary',
    bgColor: 'bg-md-primary/10'
  },
  reward_received: {
    icon: TrendingUp,
    label: '收到收益',
    color: 'text-md-tertiary',
    bgColor: 'bg-md-tertiary/10'
  }
};

export default function ActivityList({ activities }: ActivityListProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-md-on-background mb-4">
        最近活动
      </h3>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-md-on-surface-variant text-center py-8">
            暂无活动记录
          </p>
        ) : (
          activities.slice(0, 5).map((activity, index) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-md-surface-container-high hover:bg-md-surface-container-highest transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bgColor}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-md-on-background">
                      {config.label}
                    </p>
                    <p className="text-xs text-md-on-surface-variant">
                      {activity.merchant && `${activity.merchant} · `}
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${config.color}`}>
                  +{activity.amount.toFixed(2)}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </Card>
  );
}
