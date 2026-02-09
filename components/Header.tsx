'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Wallet, Home, Store, Gift, LayoutDashboard, TrendingUp, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { user } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: '首页', icon: Home },
    { href: '/merchants', label: '商家', icon: Store },
    { href: '/rewards', label: '兑换', icon: Gift },
    { href: '/dashboard', label: '资产', icon: LayoutDashboard },
    { href: '/market', label: '市场', icon: TrendingUp },
  ];

  return (
    <>
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
                P&R
              </div>
              <span className="font-bold text-lg">Point & RWA</span>
            </motion.div>
          </Link>

          {/* 桌面端导航 */}
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
              className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-md-secondary-container text-md-on-secondary-container shadow-sm"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(232, 222, 248, 0.9)' }}
              transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
            >
              <span className="text-sm font-semibold">Point</span>
              <div className="w-px h-4 bg-md-on-secondary-container/20" />
              <motion.span
                className="text-base font-bold tabular-nums"
                key={user.point}
                initial={{ scale: 1.3, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.4, stiffness: 300 }}
              >
                {user.point.toFixed(1)}
              </motion.span>
            </motion.div>
            <motion.button
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-md-primary text-md-on-primary shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(103, 80, 164, 0.9)' }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
            >
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-semibold hidden sm:inline">{user.address}</span>
            </motion.button>

            {/* 移动端汉堡菜单按钮 */}
            <motion.button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-md-surface-container text-md-on-surface"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(231, 224, 236, 1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* 移动端侧边栏 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* 侧边栏 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.2, 0, 0, 1] }}
              className="fixed top-0 right-0 z-50 h-full w-72 bg-md-surface md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-md-outline-variant/20">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-md-primary to-md-secondary-container text-md-on-primary font-bold text-lg shadow-md">
                      P&R
                    </div>
                    <span className="font-bold text-lg">Point & RWA</span>
                  </div>
                  <motion.button
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-md-surface-container-low text-md-on-surface"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* 导航菜单 */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {navItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`
                              flex items-center space-x-3 px-4 py-3.5 rounded-2xl
                              transition-all duration-200
                              ${isActive
                                ? 'bg-md-secondary-container text-md-on-secondary-container'
                                : 'text-md-on-surface-variant hover:bg-md-surface-container-low'
                              }
                            `}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-base font-semibold">{item.label}</span>
                            {isActive && (
                              <motion.div
                                layoutId="activeMobileNav"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-md-primary"
                                transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </nav>

                {/* 底部用户信息 */}
                <div className="p-4 border-t border-md-outline-variant/20 bg-md-surface-container-low/30">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-md-surface-container">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-md-primary text-md-on-primary">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-md-on-surface truncate">{user.address}</p>
                      <p className="text-xs text-md-on-surface-variant">
                        {user.point.toFixed(1)} Point
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
