// iOS-specific card interface using shared components
import React, { useState, useEffect } from 'react';
import { BaseCard, BaseNavigation, BaseAuthModal } from '../../../shared/components';
import { useCards, useSwipeGestures, usePlatform, useLocalStorage } from '../../../shared/hooks';
import { Card, SwipeAction, ContentType, Category } from '../../../shared/types';

interface IOSCardInterfaceProps {
  category: Category;
  contentType: ContentType;
  onNavigate: (path: string) => void;
}

export const IOSCardInterface: React.FC<IOSCardInterfaceProps> = ({
  category,
  contentType,
  onNavigate
}) => {
  const platform = usePlatform();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useLocalStorage<{ id: string; email: string; name: string } | null>('user', null);
  
  const {
    cards,
    currentCard,
    favorites,
    isLoading,
    getNextCard,
    toggleFavorite
  } = useCards();

  const handleSwipe = (action: SwipeAction) => {
    // iOS-specific haptic feedback
    if (platform?.capabilities.hapticFeedback) {
      const impact = (window as any).DeviceMotionEvent;
      if (impact) {
        // Use iOS haptic feedback API
        navigator.vibrate(action.action === 'favorite' ? 50 : 25);
      }
    }

    switch (action.action) {
      case 'favorite':
        if (currentCard) toggleFavorite(currentCard);
        break;
      case 'skip':
        getNextCard();
        break;
      case 'refresh':
        getNextCard();
        break;
    }
  };

  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getTransform,
    isDragging
  } = useSwipeGestures(handleSwipe);

  const handleAuth = async (email: string, password: string, isSignUp: boolean) => {
    // iOS-specific authentication logic
    // This would integrate with iOS keychain and biometric auth
    console.log('iOS Auth:', { email, isSignUp });
    
    // Mock authentication for now
    const mockUser = { id: '1', email, name: email.split('@')[0] };
    setUser(mockUser);
  };

  const navigationItems = [
    { id: 'cards', label: 'Cards', icon: '🃏', path: '/cards', isActive: true },
    { id: 'favorites', label: 'Favorites', icon: '❤️', path: '/favorites' },
    { id: 'categories', label: 'Categories', icon: '📂', path: '/categories' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' }
  ];

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Loading cards...</p>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <p className="mb-4">No cards available</p>
          <button 
            onClick={() => onNavigate('/categories')}
            className="px-6 py-3 bg-blue-500 rounded-xl"
          >
            Choose Category
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900 relative">
      {/* Status bar safe area */}
      <div className="h-12 bg-gray-900"></div>
      
      {/* Card container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="w-full max-w-sm h-96 relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => currentCard && handleTouchEnd(currentCard.id)}
          style={{
            transform: getTransform(),
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          <BaseCard
            card={currentCard}
            platform={platform || { type: 'ios', version: '1.0.0', capabilities: { hapticFeedback: true, pushNotifications: true, biometricAuth: true, deepLinking: true } }}
            onFavorite={toggleFavorite}
            onSkip={() => getNextCard()}
            onRefresh={() => getNextCard()}
            className="h-full shadow-2xl"
          />
        </div>
      </div>

      {/* iOS-style action indicators */}
      {isDragging && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">👎</span>
          </div>
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">❤️</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <BaseNavigation
        items={navigationItems}
        onNavigate={onNavigate}
        platform={platform || { type: 'ios', version: '1.0.0', capabilities: { hapticFeedback: true, pushNotifications: true, biometricAuth: true, deepLinking: true } }}
        layout="bottom"
        className="pb-8" // iOS safe area bottom
      />

      {/* Auth Modal */}
      <BaseAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={handleAuth}
        platform={platform || { type: 'ios', version: '1.0.0', capabilities: { hapticFeedback: true, pushNotifications: true, biometricAuth: true, deepLinking: true } }}
      />
    </div>
  );
};

export default IOSCardInterface;
