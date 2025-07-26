// Base card component that can be used across web and mobile
import React from 'react';
import { Card, Platform } from '../types';
import { CATEGORY_COLORS, CATEGORY_EMOJIS } from '../utils';

interface BaseCardProps {
  card: Card;
  platform: Platform;
  onFavorite?: (card: Card) => void;
  onSkip?: (card: Card) => void;
  onRefresh?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  card,
  platform,
  onFavorite,
  onSkip,
  onRefresh,
  className = '',
  style = {},
  children
}) => {
  const gradientClass = CATEGORY_COLORS[card.category];
  const emoji = CATEGORY_EMOJIS[card.category];

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(card);
      // Add haptic feedback for mobile
      if (platform.capabilities.hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip(card);
      // Add haptic feedback for mobile
      if (platform.capabilities.hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(25);
      }
    }
  };

  return (
    <div
      className={`relative w-full h-full rounded-3xl shadow-2xl overflow-hidden ${className}`}
      style={style}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-90`} />
      
      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{emoji}</span>
            <span className="text-sm font-medium opacity-80">{card.category}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs px-2 py-1 bg-white/20 rounded-full">
              {card.type}
            </span>
            {card.is_favorited && (
              <span className="text-red-400">❤️</span>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 leading-tight">
            {card.title}
          </h2>
          <p className="text-lg opacity-90 leading-relaxed">
            {card.content}
          </p>
        </div>

        {/* Action buttons for web */}
        {platform.type === 'web' && (
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handleSkip}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Skip card"
            >
              <span className="text-xl">👎</span>
            </button>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Refresh"
              >
                <span className="text-xl">🔄</span>
              </button>
            )}
            <button
              onClick={handleFavorite}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Favorite card"
            >
              <span className="text-xl">❤️</span>
            </button>
          </div>
        )}

        {/* Custom children content */}
        {children}
      </div>
    </div>
  );
};

export default BaseCard;
