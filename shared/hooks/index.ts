// Shared hooks for web and mobile versions
import { useState, useEffect, useCallback } from 'react';
import { Card, ContentType, Category, SwipeAction, Platform } from '../types';
import { detectPlatform, shuffleArray, getRandomCard, filterCardsByCategory, filterCardsByType } from '../utils';

export const usePlatform = () => {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  return platform;
};

export const useCards = (initialCards: Card[] = []) => {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [favorites, setFavorites] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const shuffleCards = useCallback(() => {
    setCards(prev => shuffleArray(prev));
  }, []);

  const getNextCard = useCallback(() => {
    if (cards.length === 0) return null;
    const nextCard = getRandomCard(cards);
    setCurrentCard(nextCard);
    return nextCard;
  }, [cards]);

  const addToFavorites = useCallback((card: Card) => {
    setFavorites(prev => {
      if (prev.find(fav => fav.id === card.id)) return prev;
      return [...prev, { ...card, is_favorited: true }];
    });
  }, []);

  const removeFromFavorites = useCallback((cardId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== cardId));
  }, []);

  const toggleFavorite = useCallback((card: Card) => {
    const isFavorited = favorites.find(fav => fav.id === card.id);
    if (isFavorited) {
      removeFromFavorites(card.id);
    } else {
      addToFavorites(card);
    }
  }, [favorites, addToFavorites, removeFromFavorites]);

  return {
    cards,
    setCards,
    currentCard,
    setCurrentCard,
    favorites,
    isLoading,
    setIsLoading,
    shuffleCards,
    getNextCard,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite
  };
};

export const useSwipeGestures = (onSwipe: (action: SwipeAction) => void) => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setCurrentX(touch.clientX);
    setCurrentY(touch.clientY);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setCurrentX(touch.clientX);
    setCurrentY(touch.clientY);
  }, [isDragging]);

  const handleTouchEnd = useCallback((cardId: string) => {
    if (!isDragging) return;
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const threshold = 100;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) {
        onSwipe({ direction: 'right', cardId, action: 'favorite' });
      } else if (deltaX < -threshold) {
        onSwipe({ direction: 'left', cardId, action: 'skip' });
      }
    } else {
      if (deltaY < -threshold) {
        onSwipe({ direction: 'up', cardId, action: 'refresh' });
      }
    }

    setIsDragging(false);
    setStartX(0);
    setStartY(0);
    setCurrentX(0);
    setCurrentY(0);
  }, [isDragging, currentX, currentY, startX, startY, onSwipe]);

  const getTransform = () => {
    if (!isDragging) return 'translate(0px, 0px) rotate(0deg)';
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const rotation = deltaX * 0.1;
    
    return `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getTransform,
    isDragging
  };
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

export const useFilters = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | null>(null);

  const applyFilters = useCallback((cards: Card[]) => {
    let filtered = cards;
    
    if (selectedCategory) {
      filtered = filterCardsByCategory(filtered, selectedCategory);
    }
    
    if (selectedContentType) {
      filtered = filterCardsByType(filtered, selectedContentType);
    }
    
    return filtered;
  }, [selectedCategory, selectedContentType]);

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedContentType(null);
  }, []);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedContentType,
    setSelectedContentType,
    applyFilters,
    clearFilters
  };
};
