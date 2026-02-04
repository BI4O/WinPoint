'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

const MotionButton = motion.button;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'filled', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed';

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
      ease: [0.2, 0, 0, 1] // cubic-bezier(0.2, 0, 0, 1)
    };

    return (
      <MotionButton
        ref={ref}
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
