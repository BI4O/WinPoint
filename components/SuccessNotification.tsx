'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SuccessNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  unit: string;
  message?: string;
  emoji?: string;
  showLoading?: boolean;
}

export default function SuccessNotification({
  isOpen,
  onClose,
  title,
  amount,
  unit,
  message,
  emoji = '🎉',
  showLoading = false
}: SuccessNotificationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="bg-md-surface-container rounded-[40px] p-10 text-center shadow-2xl border border-white/10 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.2, duration: 0.6, type: 'tween', ease: [0.2, 0, 0, 1] }}
              className="text-7xl mb-6"
            >
              {emoji}
            </motion.div>
            <h2 className="text-2xl font-bold text-md-on-background mb-3">
              {title}
            </h2>
            {amount !== 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
                className="mb-4"
              >
                <p className="text-4xl font-bold text-md-primary mb-2">
                  {amount >= 0 ? '+' : ''}{amount.toFixed(4)}
                </p>
                <p className="text-sm text-md-on-surface-variant">{unit}</p>
              </motion.div>
            )}
            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
                className="text-sm text-md-on-surface-variant flex items-center justify-center gap-2 whitespace-pre-line"
              >
                {showLoading && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-md-primary"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {message}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
