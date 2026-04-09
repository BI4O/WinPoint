'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselItem {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
}

const carouselItems: CarouselItem[] = [
  {
    id: '1',
    emoji: '🎉',
    title: '限时特惠',
    subtitle: '100积分 = ¥1 现金券',
  },
  {
    id: '2',
    emoji: '☕',
    title: '星巴克专区',
    subtitle: '咖啡饮品 100积分起',
  },
  {
    id: '3',
    emoji: '👟',
    title: 'Nike 运动季',
    subtitle: '积分兑换运动装备',
  },
  {
    id: '4',
    emoji: '💎',
    title: '奢侈品专区',
    subtitle: '珠宝首饰 限时兑换',
  },
];

export default function PromotionCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl mb-8">
      <div className="relative h-32 md:h-36">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center"
          >
            <div className="flex items-center gap-6 px-8">
              <motion.span
                className="text-6xl md:text-7xl"
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
              >
                {carouselItems[currentIndex].emoji}
              </motion.span>
              <div className="text-white">
                <motion.h3
                  className="text-2xl md:text-3xl font-bold mb-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {carouselItems[currentIndex].title}
                </motion.h3>
                <motion.p
                  className="text-white/90 text-lg md:text-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {carouselItems[currentIndex].subtitle}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicator dots */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
