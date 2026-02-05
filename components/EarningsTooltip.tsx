'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EarningsTooltip() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <motion.button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="flex items-center justify-center w-5 h-5 rounded-full bg-md-surface-container-low hover:bg-md-surface-container text-md-on-surface-variant hover:text-md-primary transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Info className="w-3 h-3" />
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 5, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 5, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 bottom-6 z-50 w-72 p-4 rounded-xl bg-md-surface-container shadow-lg border border-md-outline/20"
          >
            <h4 className="font-semibold text-md-on-background text-sm mb-3">收益发放规则</h4>

            <div className="space-y-3 text-xs text-md-on-surface-variant">
              <div className="flex gap-2">
                <span className="text-md-primary font-medium shrink-0">每日</span>
                <span>持有 Share 产生收益，累积到待发放账户</span>
              </div>

              <div className="flex gap-2">
                <span className="text-md-success font-medium shrink-0">月底</span>
                <span>待发放收益统一发放，可随时提取</span>
              </div>

              <div className="border-t border-md-outline/20 pt-2 mt-2">
                <p className="text-[11px] text-md-outline">
                  <span className="font-medium text-md-on-surface-variant">日/周视图：</span>
                  显示本月待发放累积收益（月底发放后下月归零）
                </p>
                <p className="text-[11px] text-md-outline mt-1">
                  <span className="font-medium text-md-on-surface-variant">月/年视图：</span>
                  显示历史总收益（持续累积）
                </p>
              </div>
            </div>

            {/* 小箭头 */}
            <div className="absolute -bottom-1 left-2 w-2 h-2 bg-md-surface-container border-l border-b border-md-outline/20 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
