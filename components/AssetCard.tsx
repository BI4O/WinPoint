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
  glow?: 'primary' | 'tertiary' | 'success' | 'none';
}

const glowColors = {
  primary: 'bg-md-primary',
  tertiary: 'bg-md-tertiary',
  success: 'bg-md-success',
  none: 'bg-gray-500'
};

export default function AssetCard({ title, value, subtitle, icon: Icon, trend, glow = 'none' }: AssetCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-md-on-surface-variant mb-3 font-medium">{title}</p>
          <motion.p
            className="text-3xl font-bold text-md-on-background mb-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.5, ease: [0.2, 0, 0, 1] }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-xs text-md-on-surface-variant">{subtitle}</p>
          )}
          {trend && (
            <motion.div
              className={`flex items-center mt-3 text-sm font-medium ${
                trend.direction === 'up' ? 'text-md-success' : 'text-md-error'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
            >
              <span className="text-base mr-1">
                {trend.direction === 'up' ? '↑' : '↓'}
              </span>
              <span>{Math.abs(trend.value)}%</span>
            </motion.div>
          )}
        </div>
        <motion.div
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-md-primary/10 relative overflow-hidden"
          whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{ background: `radial-gradient(circle, ${glowColors[glow]} 0%, transparent 70%)` }}
          />
          <Icon className="h-7 w-7 text-md-primary relative z-10" />
        </motion.div>
      </div>
    </Card>
  );
}
