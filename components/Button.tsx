'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * variant: 'filled' | 'secondary' | 'outlined'
 * - filled: 主按钮，红色背景，白色文字
 * - secondary: 次要按钮，深灰背景，白色文字
 * - outlined: 再次要按钮，白色背景，灰色边框
 */
interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'variants'> {
  variant?: 'filled' | 'secondary' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const MotionButton = motion.button;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'filled', size = 'md', children, type = 'button', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      filled: `
        bg-primary text-white
        hover:bg-primary-hover
        focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
      `,
      secondary: `
        bg-gray-333 text-white
        hover:bg-gray-222
        focus-visible:outline-2 focus-visible:outline-gray-333 focus-visible:outline-offset-2
      `,
      outlined: `
        bg-white text-gray-333 border border-gray-2
        hover:bg-gray-100
        focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
      `,
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-10 px-6 text-sm',
      lg: 'h-12 px-8 text-base'
    };

    // Motion variants for hover states
    const motionVariants = {
      rest: { scale: 1 },
      hover: { scale: 1.02 },
      tap: { scale: 0.95 }
    };

    const transition = {
      type: 'tween' as const,
      duration: 0.3,
      ease: [0.2, 0, 0, 1] as const
    };

    return (
      <MotionButton
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        variants={motionVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        transition={transition}
        {...props}
      >
        {children}
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
