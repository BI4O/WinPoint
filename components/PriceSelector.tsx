'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface PriceOption {
  label: string;
  value: number; // 百分比，1.0 = 市价
  displayValue?: string; // 显示的值
}

interface PriceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  marketPrice: number;
  tradeType: 'buy' | 'sell';
  disabled?: boolean;
}

export default function PriceSelector({
  value,
  onChange,
  marketPrice,
  tradeType,
  disabled = false
}: PriceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 根据交易类型生成选项
  const options: PriceOption[] = [
    { label: '市价', value: 1.0 },
    ...(tradeType === 'buy'
      ? [
          { label: '95% 市价', value: 0.95 },
          { label: '90% 市价', value: 0.90 },
          { label: '85% 市价', value: 0.85 },
          { label: '80% 市价', value: 0.80 }
        ]
      : [
          { label: '105% 市价', value: 1.05 },
          { label: '110% 市价', value: 1.10 },
          { label: '115% 市价', value: 1.15 },
          { label: '120% 市价', value: 1.20 }
        ]
    )
  ];

  // 检测当前选中的选项
  const getCurrentOption = (): PriceOption | null => {
    const currentPrice = parseFloat(value);
    if (isNaN(currentPrice)) return null;

    for (const option of options) {
      if (Math.abs(currentPrice - marketPrice * option.value) < 0.0001) {
        return option;
      }
    }
    return null;
  };

  const currentOption = getCurrentOption();

  // 处理选项选择
  const handleSelectOption = (option: PriceOption) => {
    const newPrice = (marketPrice * option.value).toFixed(4);
    onChange(newPrice);
    setIsOpen(false);
  };

  // 处理输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      {/* 输入框容器 */}
      <div className="relative">
        {/* 价格输入框 */}
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="0.0000"
          step="0.0001"
          className={`
            w-full px-4 py-3 pr-28
            bg-md-surface-container-low
            rounded-2xl
            border border-md-outline-variant
            focus:border-md-primary focus:outline-none
            text-md-on-surface font-mono
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />

        {/* 内嵌的下拉按钮 - pill-shaped */}
        <motion.button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            absolute right-2 top-1/2 -translate-y-1/2
            px-3 py-1.5
            bg-md-primary/10 hover:bg-md-primary/20
            active:bg-md-primary/30
            rounded-full
            text-md-primary font-medium text-xs
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-1
          `}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          transition={{
            duration: 0.2,
            ease: [0.2, 0, 0, 1]
          }}
        >
          <span>{currentOption?.label || '自定义'}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3 h-3" />
          </motion.div>
        </motion.button>
      </div>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.2, 0, 0, 1]
            }}
            className="
              absolute z-50 w-full mt-2
              bg-md-surface-container
              rounded-2xl
              shadow-lg
              border border-md-outline-variant/20
              overflow-hidden
            "
          >
            <div className="py-2">
              {options.map((option, index) => (
                <motion.button
                  key={option.label}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`
                    w-full px-4 py-3
                    text-left
                    transition-colors duration-200
                    ${
                      currentOption?.label === option.label
                        ? 'bg-md-primary/20 text-md-primary'
                        : 'text-md-on-surface hover:bg-md-primary/10'
                    }
                  `}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.15,
                    delay: index * 0.03,
                    ease: [0.2, 0, 0, 1]
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    <span className="font-mono text-sm text-md-on-surface-variant">
                      {(marketPrice * option.value).toFixed(4)}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
