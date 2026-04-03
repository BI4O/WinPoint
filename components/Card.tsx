'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'whileHover'> {
  hover?: boolean;
  children: ReactNode;
}

const MotionDiv = motion.div;

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <MotionDiv
        ref={ref}
        className={cn(
          'group',
          'rounded-xl bg-white border border-gray-2 p-5',
          'shadow-md hover:shadow-xl',
          'transition-all duration-300 ease-md',
          hover && 'hover:scale-[1.01] cursor-pointer',
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
