'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'variants'> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const MotionButton = motion.button;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'filled', size = 'md', children, type = 'button', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      filled: 'bg-md-primary text-md-on-primary shadow-sm',
      tonal: 'bg-md-secondary-container text-md-on-secondary-container',
      outlined: 'border border-md-outline text-md-primary',
      text: 'text-md-primary'
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
