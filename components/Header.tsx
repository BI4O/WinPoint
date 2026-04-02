'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Home, Store, Gift, LayoutDashboard, Menu, X } from 'lucide-react';
import IdentitySwitcher from './IdentitySwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const { user, identityMode } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine nav items based on identity mode
  const navItems = identityMode === 'merchant'
    ? [
        { href: '/merchant/manage', label: '商户管理', icon: Store },
      ]
    : [
        { href: '/', label: '首页', icon: Home },
        { href: '/merchants', label: '商家', icon: Store },
        { href: '/rewards', label: '积分商城', icon: Gift },
        { href: '/dashboard', label: '资产', icon: LayoutDashboard },
      ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-primary text-white">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
            >
              <Image
                src="/images/winpoint_logo_white.svg"
                alt="WinPoint"
                width={60}
                height={60}
                className="h-14 w-14"
              />
              <span className="font-bold text-lg">WinPoint</span>
            </motion.div>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center">
            <div className="relative flex items-center bg-white/10 p-1 rounded-2xl">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-white/20 rounded-xl shadow-sm z-0"
                        transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                      />
                    )}
                    <motion.div
                      className={`
                        relative z-10 flex items-center space-x-2 px-4 py-2.5 rounded-xl
                        ${isActive
                          ? 'text-white bg-white/20'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
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
              className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/10 text-white shadow-sm"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
            >
              <span className="text-sm font-semibold">Point</span>
              <div className="w-px h-4 bg-white/20" />
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
            <IdentitySwitcher />

            {/* 移动端汉堡菜单按钮 */}
            <motion.button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
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
              className="fixed top-0 right-0 z-50 h-full w-72 bg-white md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* 头部 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/images/winpoint_logo_white.svg"
                      alt="WinPoint"
                      width={60}
                      height={60}
                      className="h-14 w-14"
                    />
                    <span className="font-bold text-lg">WinPoint</span>
                  </div>
                  <motion.button
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-333"
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
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-333 hover:bg-gray-100'
                              }
                            `}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="text-base font-semibold">{item.label}</span>
                            {isActive && (
                              <motion.div
                                layoutId="activeMobileNav"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
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
                <div className="p-4 border-t border-gray-200 bg-gray-50/30">
                  <IdentitySwitcher />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
