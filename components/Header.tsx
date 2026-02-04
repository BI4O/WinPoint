'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Wallet, Home, Store, LayoutDashboard, TrendingUp } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { user } = useStore();

  const navItems = [
    { href: '/', label: '首页', icon: Home },
    { href: '/merchants', label: '商家', icon: Store },
    { href: '/dashboard', label: '资产', icon: LayoutDashboard },
    { href: '/market', label: '市场', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-md-border/20 bg-md-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-md-primary text-md-on-primary font-bold text-lg">
            C&S
          </div>
          <span className="font-bold text-lg">Credit & Share</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full
                  transition-all duration-300
                  ${isActive
                    ? 'bg-md-secondary-container text-md-on-secondary-container'
                    : 'text-md-on-surface-variant hover:bg-md-primary/10'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full bg-md-surface-container">
            <span className="text-sm font-medium">Credit:</span>
            <span className="text-sm font-bold text-md-primary">{user.credit.toFixed(1)}</span>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-md-primary text-md-on-primary hover:bg-md-primary/90 transition-all duration-300 active:scale-95">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">{user.address}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
