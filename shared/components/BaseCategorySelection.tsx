// Base category selection component for web and mobile
import React from 'react';
import { Category, Platform } from '../types';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_EMOJIS } from '../utils';

interface BaseCategorySelectionProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
  platform: Platform;
  className?: string;
  itemClassName?: string;
  layout?: 'grid' | 'list' | 'carousel';
}

export const BaseCategorySelection: React.FC<BaseCategorySelectionProps> = ({
  selectedCategory,
  onCategorySelect,
  platform,
  className = '',
  itemClassName = '',
  layout = 'grid'
}) => {
  const handleCategorySelect = (category: Category) => {
    onCategorySelect(category);
    // Add haptic feedback for mobile
    if (platform.capabilities.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'list':
        return 'flex flex-col space-y-3';
      case 'carousel':
        return 'flex overflow-x-auto space-x-4 pb-4';
      default:
        return 'grid grid-cols-2 gap-4';
    }
  };

  const getItemClasses = (category: Category) => {
    const baseClasses = `
      relative p-4 rounded-2xl cursor-pointer transition-all duration-200
      ${CATEGORY_COLORS[category]} bg-gradient-to-br
      ${selectedCategory === category ? 'ring-4 ring-white scale-105' : 'hover:scale-102'}
      ${itemClassName}
    `;
    
    if (layout === 'carousel') {
      return `${baseClasses} min-w-[200px] flex-shrink-0`;
    }
    
    return baseClasses;
  };

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {CATEGORIES.map((category) => (
        <div
          key={category}
          className={getItemClasses(category)}
          onClick={() => handleCategorySelect(category)}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{CATEGORY_EMOJIS[category]}</span>
              <span className="font-semibold text-sm md:text-base">
                {category}
              </span>
            </div>
            {selectedCategory === category && (
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-500 text-sm">✓</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BaseCategorySelection;
