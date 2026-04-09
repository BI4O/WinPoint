'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useBrandInfo } from '@/hooks/useBrand';

export default function Footer() {
  const brandInfo = useBrandInfo();
  const footerLinks = [
    { href: '/about', label: '关于我们' },
    { href: '/terms', label: '服务条款' },
    { href: '/privacy', label: '隐私政策' },
    { href: '/contact', label: '联系我们' },
  ];

  return (
    <footer className="w-full bg-primary text-white">
      <div className="container mx-auto px-4 py-8">
        {/* 主要内容区 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo 和版权 */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={brandInfo.logo.replace('_white', '_red')}
              alt={brandInfo.logoAlt}
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="font-bold text-lg text-primary">{brandInfo.name}</span>
          </motion.div>

          {/* 链接 */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/80 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 分隔线 */}
        <div className="my-6 border-t border-white/20" />

        {/* 版权信息 */}
        <div className="text-center">
          <p className="text-sm text-white/60">
            {brandInfo.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
