'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'whileHover'> {
  hover?: boolean;
  glow?: 'primary' | 'tertiary' | 'none';
  children: ReactNode;
}

const MotionDiv = motion.div;

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, glow = 'none', children, ...props }, ref) => {
    const glowClasses = {
      primary: 'group-hover:glow-primary',
      tertiary: 'group-hover:glow-tertiary',
      none: ''
    };

    return (
      <MotionDiv
        ref={ref}
        className={cn(
          'group',
          'rounded-3xl bg-md-surface-container p-6',
          'shadow-sm',
          'transition-all duration-300 ease-md',
          hover && 'hover:shadow-md hover:scale-[1.02] cursor-pointer',
          glow !== 'none' && glowClasses[glow],
          className
        )}
        whileHover={hover ? { y: -2 } : undefined}
        transition={{ type: 'tween' as const, duration: 0.3, ease: [0.2, 0, 0, 1] as const }}
        {...props}
      >
        {children}
      </MotionDiv>
    );
  }
);

Card.displayName = 'Card';

export default Card;
