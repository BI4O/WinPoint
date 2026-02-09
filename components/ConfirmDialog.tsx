'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  type = 'warning'
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const iconColor = type === 'danger' ? 'text-error' : type === 'warning' ? 'text-yellow-500' : 'text-md-primary';
  const confirmButtonClass = type === 'danger' ? 'bg-error hover:bg-error/90' : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 对话框 */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
              className="bg-md-background rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 内容 */}
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${type === 'danger' ? 'error' : type === 'warning' ? 'yellow-500' : 'md-primary'}/10 flex items-center justify-center`}
                >
                  <AlertCircle className={`w-8 h-8 ${iconColor}`} />
                </motion.div>

                <h2 className="text-xl font-bold text-md-on-background mb-2">
                  {title}
                </h2>
                <p className="text-md-on-surface-variant mb-6">
                  {message}
                </p>
              </div>

              {/* 底部按钮 */}
              <div className="p-6 pt-0 flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outlined"
                  size="lg"
                  className="flex-1"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  variant="filled"
                  size="lg"
                  className={`flex-1 ${confirmButtonClass}`}
                >
                  {confirmText}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
