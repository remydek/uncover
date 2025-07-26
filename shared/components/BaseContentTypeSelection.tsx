// Base content type selection component for web and mobile
import React from 'react';
import { ContentType, Platform } from '../types';
import { CONTENT_TYPES } from '../utils';

interface BaseContentTypeSelectionProps {
  selectedContentType: ContentType | null;
  onContentTypeSelect: (type: ContentType) => void;
  platform: Platform;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

const CONTENT_TYPE_INFO = {
  DILEMMA: {
    emoji: '🤔',
    title: 'Dilemmas',
    description: 'Moral & ethical choices',
    color: 'from-purple-500 to-indigo-600'
  },
  SITUATIONS: {
    emoji: '🎭',
    title: 'Situations',
    description: 'What would you do?',
    color: 'from-blue-500 to-cyan-600'
  },
  QUESTIONS: {
    emoji: '💭',
    title: 'Questions',
    description: 'Personal discovery',
    color: 'from-green-500 to-teal-600'
  }
};

export const BaseContentTypeSelection: React.FC<BaseContentTypeSelectionProps> = ({
  selectedContentType,
  onContentTypeSelect,
  platform,
  className = '',
  layout = 'horizontal'
}) => {
  const handleContentTypeSelect = (type: ContentType) => {
    onContentTypeSelect(type);
    // Add haptic feedback for mobile
    if (platform.capabilities.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const getLayoutClasses = () => {
    return layout === 'vertical' 
      ? 'flex flex-col space-y-4' 
      : 'flex flex-row space-x-4 overflow-x-auto pb-4';
  };

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {CONTENT_TYPES.map((type) => {
        const info = CONTENT_TYPE_INFO[type];
        const isSelected = selectedContentType === type;
        
        return (
          <div
            key={type}
            className={`
              relative p-6 rounded-2xl cursor-pointer transition-all duration-200
              bg-gradient-to-br ${info.color}
              ${isSelected ? 'ring-4 ring-white scale-105' : 'hover:scale-102'}
              ${layout === 'horizontal' ? 'min-w-[200px] flex-shrink-0' : 'w-full'}
            `}
            onClick={() => handleContentTypeSelect(type)}
          >
            <div className="text-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{info.emoji}</span>
                {isSelected && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{info.title}</h3>
              <p className="text-sm opacity-90">{info.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BaseContentTypeSelection;
