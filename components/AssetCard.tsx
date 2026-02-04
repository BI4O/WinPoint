'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Card from './Card';

interface AssetCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export default function AssetCard({ title, value, subtitle, icon: Icon, trend }: AssetCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-md-on-surface-variant mb-2">{title}</p>
          <motion.p
            className="text-3xl font-bold text-md-on-background mb-1"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-xs text-md-on-surface-variant">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.direction === 'up' ? 'text-md-success' : 'text-md-error'}`}>
              <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-md-primary/10">
          <Icon className="h-6 w-6 text-md-primary" />
        </div>
      </div>
    </Card>
  );
}
