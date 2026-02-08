'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Wallet, Home, Store, Gift, LayoutDashboard, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const { user } = useStore();

  const navItems = [
    { href: '/', label: '首页', icon: Home },
    { href: '/merchants', label: '商家', icon: Store },
    { href: '/rewards', label: '积分商城', icon: Gift },
    { href: '/dashboard', label: '资产', icon: LayoutDashboard },
    { href: '/market', label: '市场', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-md-border/20 bg-md-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-md-primary to-md-secondary-container text-md-on-primary font-bold text-lg shadow-md">
              C&S
            </div>
            <span className="font-bold text-lg">Credit & Share</span>
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center">
          <div className="relative flex items-center bg-md-surface-container p-1 rounded-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-md-secondary-container rounded-xl shadow-sm z-0"
                      transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                    />
                  )}
                  <motion.div
                    className={`
                      relative z-10 flex items-center space-x-2 px-4 py-2.5 rounded-xl
                      ${isActive
                        ? 'text-md-on-secondary-container'
                        : 'text-md-on-surface-variant'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <motion.div
            className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/60"
            whileHover={{ scale: 1.02, borderColor: 'rgba(251, 191, 36, 0.5)' }}
            transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <span className="text-sm font-semibold text-amber-700">Credit</span>
            <div className="w-px h-4 bg-amber-300/50" />
            <motion.span
              className="text-base font-bold text-amber-600 tabular-nums"
              key={user.credit}
              initial={{ scale: 1.3, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.4, stiffness: 300 }}
            >
              {user.credit.toFixed(1)}
            </motion.span>
          </motion.div>
          <motion.button
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-md-primary to-md-primary/90 text-md-on-primary border-2 border-md-primary shadow-md hover:shadow-lg hover:border-md-primary/80"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-semibold hidden sm:inline">{user.address}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
