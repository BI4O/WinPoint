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
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
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

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-full
                    transition-all duration-300 ease-md
                    ${isActive
                      ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm'
                      : 'text-md-on-surface-variant hover:bg-md-primary/10'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-3 px-5 py-2.5 rounded-2xl bg-md-surface-container border border-md-border/10 shadow-sm">
            <span className="text-sm font-medium text-md-on-surface-variant">Credit:</span>
            <motion.span
              className="text-sm font-bold text-md-primary"
              key={user.credit}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.3, stiffness: 200 }}
            >
              {user.credit.toFixed(1)}
            </motion.span>
          </div>
          <motion.button
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-md-primary to-md-primary/90 text-md-on-primary shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">{user.address}</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
