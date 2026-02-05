'use client';

import { motion } from 'framer-motion';
import { Calendar, BarChart3, TrendingUp, CalendarDays } from 'lucide-react';

export type TimeRange = 'day' | 'week' | 'month' | 'year';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

interface RangeOption {
  value: TimeRange;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const rangeOptions: RangeOption[] = [
  { value: 'day', label: '日', icon: CalendarDays },
  { value: 'week', label: '周', icon: Calendar },
  { value: 'month', label: '月', icon: BarChart3 },
  { value: 'year', label: '年', icon: TrendingUp },
];

export default function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-md-surface-container-low">
      {rangeOptions.map((option) => {
        const isActive = value === option.value;
        const Icon = option.icon;

        return (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              isActive
                ? 'bg-md-primary text-md-on-primary shadow-md'
                : 'text-md-on-surface-variant hover:bg-md-surface-container'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{option.label}</span>
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-lg bg-md-primary/20"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
