'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { ArrowRight, Coins, TrendingUp, Wallet, FileText } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { mockMetrics } from '@/lib/mock-data';

export default function Home() {
  const steps = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: '消费获得 积分',
      description: '在合作商家消费，每10元获得1个积分，积累消费价值'
    },
    {
      icon: <Coins className="w-8 h-8" />,
      title: '质押获得 RWA',
      description: '将积分质押，1:1获得RWA，成为商家生态的股东'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: '持续获得收益',
      description: '商家产生收入，RWA持有者按比例获得收益分配'
    }
  ];

  return (
    <div className="min-h-screen bg-md-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Organic Blur Shapes Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 bg-md-primary/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-md-tertiary/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gray-333 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              消费即积累，长期获得收益
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-1 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              通过 积分 & RWA 双资产模型，让每一次消费都成为长期价值的积累
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/merchants">
                <Button size="lg">
                  开始体验
                </Button>
              </Link>
              <a href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outlined">
                  白皮书
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-333 mb-4">
              如何运作
            </h2>
            <p className="text-lg text-gray-1 max-w-2xl mx-auto">
              三个简单步骤，开启您的收益之旅
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card hover className="h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-md-secondary-container flex items-center justify-center text-md-primary mb-6">
                      {step.icon}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-md-primary text-white flex items-center justify-center font-bold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-333 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-1">
                      {step.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-333 mb-4">
              平台数据
            </h2>
            <p className="text-lg text-gray-1 max-w-2xl mx-auto">
              实时展示平台运营数据
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
            >
              <Card className="text-center">
                <div className="text-gray-1 text-sm mb-2">
                  总用户数
                </div>
                <div className="text-4xl font-bold text-md-primary mb-1">
                  <CountUp end={mockMetrics.totalUsers} duration={2.5} separator="," />
                </div>
                <div className="text-xs text-gray-1">
                  活跃用户
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="text-center">
                <div className="text-gray-1 text-sm mb-2">
                  总积分发行量
                </div>
                <div className="text-4xl font-bold text-md-primary mb-1">
                  <CountUp end={mockMetrics.totalPoint} duration={2.5} separator="," />
                </div>
                <div className="text-xs text-gray-1">
                  累计发行
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="text-center">
                <div className="text-gray-1 text-sm mb-2">
                  已分配收益
                </div>
                <div className="text-4xl font-bold text-md-primary mb-1">
                  $<CountUp end={mockMetrics.totalRewards} duration={2.5} separator="," decimals={2} />
                </div>
                <div className="text-xs text-gray-1">
                  累计分配
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="text-center">
                <div className="text-gray-1 text-sm mb-2">
                  总 RWA 数量
                </div>
                <div className="text-4xl font-bold text-md-primary mb-1">
                  <CountUp end={mockMetrics.totalRwa} duration={2.5} separator="," />
                </div>
                <div className="text-xs text-gray-1">
                  流通中
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-md-primary/10 to-md-tertiary/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-333 mb-6">
              准备好开始了吗？
            </h2>
            <p className="text-lg text-gray-1 mb-8">
              立即体验 积分 & RWA 双资产模型，让消费创造长期价值
            </p>
            <Link href="/merchants">
              <Button size="lg">
                立即开始
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
