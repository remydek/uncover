// Shared utilities for web and mobile versions
import { ContentType, Category, Card, Platform } from '../types';

export const CONTENT_TYPES: ContentType[] = ['DILEMMA', 'SITUATIONS', 'QUESTIONS'];

export const CATEGORIES: Category[] = [
  'Family & Friends',
  'Dating & Relationship',
  'Fiction',
  'Only wrong answers',
  'Travel',
  'Money',
  '18+',
  'Randomized'
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Family & Friends': 'from-blue-500 to-purple-600',
  'Dating & Relationship': 'from-pink-500 to-red-500',
  'Fiction': 'from-green-500 to-teal-600',
  'Only wrong answers': 'from-yellow-500 to-orange-500',
  'Travel': 'from-cyan-500 to-blue-500',
  'Money': 'from-emerald-500 to-green-600',
  '18+': 'from-red-500 to-pink-600',
  'Randomized': 'from-purple-500 to-indigo-600'
};

export const CATEGORY_EMOJIS: Record<Category, string> = {
  'Family & Friends': '👨‍👩‍👧‍👦',
  'Dating & Relationship': '💕',
  'Fiction': '📚',
  'Only wrong answers': '🤪',
  'Travel': '✈️',
  'Money': '💰',
  '18+': '🔞',
  'Randomized': '🎲'
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getRandomCard = (cards: Card[]): Card | null => {
  if (cards.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
};

export const filterCardsByCategory = (cards: Card[], category: Category): Card[] => {
  if (category === 'Randomized') return cards;
  return cards.filter(card => card.category === category);
};

export const filterCardsByType = (cards: Card[], type: ContentType): Card[] => {
  return cards.filter(card => card.type === type);
};

export const formatCardContent = (content: string, maxLength: number = 300): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

export const detectPlatform = (): Platform => {
  if (typeof window === 'undefined') {
    return {
      type: 'web',
      version: '1.0.0',
      capabilities: {
        hapticFeedback: false,
        pushNotifications: false,
        biometricAuth: false,
        deepLinking: false
      }
    };
  }

  const userAgent = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  if (isIOS) {
    return {
      type: 'ios',
      version: '1.0.0',
      capabilities: {
        hapticFeedback: true,
        pushNotifications: true,
        biometricAuth: true,
        deepLinking: true
      }
    };
  }

  if (isAndroid) {
    return {
      type: 'android',
      version: '1.0.0',
      capabilities: {
        hapticFeedback: true,
        pushNotifications: true,
        biometricAuth: true,
        deepLinking: true
      }
    };
  }

  return {
    type: 'web',
    version: '1.0.0',
    capabilities: {
      hapticFeedback: false,
      pushNotifications: 'Notification' in window,
      biometricAuth: false,
      deepLinking: true
    }
  };
};

export const generateCardId = (): string => {
  return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
