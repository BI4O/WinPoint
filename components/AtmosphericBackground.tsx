'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AtmosphericBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export default function AtmosphericBackground({ className, children }: AtmosphericBackgroundProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Primary blur shape - top right */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-md-primary/15 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.35, 0.25],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Tertiary blur shape - bottom left */}
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-md-tertiary/12 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1.15, 1, 1.15],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5
        }}
      />

      {/* Secondary accent blur shape - center/left */}
      <motion.div
        className="absolute top-1/2 -left-20 w-72 h-72 bg-md-secondary-container/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3
        }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-md-primary/5 via-transparent to-md-tertiary/5 pointer-events-none" />

      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
