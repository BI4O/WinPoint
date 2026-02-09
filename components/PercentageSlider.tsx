'use client';

import { motion } from 'framer-motion';
import Button from './Button';

interface PercentageSliderProps {
  percentage: number;
  onChange: (percentage: number) => void;
  type: 'buy' | 'sell';
}

export default function PercentageSlider({ percentage, onChange, type }: PercentageSliderProps) {
  const percentages = [25, 50, 75, 100];
  const color = type === 'buy' ? 'success' : 'error';
  const bgColor = type === 'buy' ? 'bg-success' : 'bg-error';

  return (
    <div className="space-y-3">
      {/* 百分比按钮 */}
      <div className="grid grid-cols-4 gap-2">
        {percentages.map((p) => (
          <Button
            key={p}
            variant="outlined"
            size="sm"
            onClick={() => onChange(p)}
            className={percentage === p ? `border-${color} text-${color}` : ''}
          >
            {p}%
          </Button>
        ))}
      </div>

      {/* 进度条 */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${type === 'buy' ? '#10b981' : '#ef4444'} 0%, ${type === 'buy' ? '#10b981' : '#ef4444'} ${percentage}%, #e7e0ec ${percentage}%, #e7e0ec 100%)`
          }}
        />
        <style jsx>{`
          input[type='range']::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${type === 'buy' ? '#10b981' : '#ef4444'};
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          input[type='range']::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${type === 'buy' ? '#10b981' : '#ef4444'};
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </div>

      {/* 百分比显示 */}
      <div className="text-center">
        <motion.span
          key={percentage}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className={`text-lg font-bold text-${color}`}
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  );
}
