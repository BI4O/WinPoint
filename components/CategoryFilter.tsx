'use client';

import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange
}: CategoryFilterProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              px-6 py-2.5 rounded-full font-medium text-sm whitespace-nowrap
              transition-all duration-300 ease-md
              ${isActive
                ? 'bg-md-secondary-container text-md-on-secondary-container shadow-sm'
                : 'bg-transparent text-md-on-surface-variant hover:bg-md-primary/10'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            {category}
          </motion.button>
        );
      })}
    </div>
  );
}
