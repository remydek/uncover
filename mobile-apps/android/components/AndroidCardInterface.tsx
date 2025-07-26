// Android-specific card interface using shared components
import React, { useState, useEffect } from 'react';
import { BaseCard, BaseNavigation, BaseAuthModal } from '../../../shared/components';
import { useCards, useSwipeGestures, usePlatform, useLocalStorage } from '../../../shared/hooks';
import { Card, SwipeAction, ContentType, Category } from '../../../shared/types';

interface AndroidCardInterfaceProps {
  category: Category;
  contentType: ContentType;
  onNavigate: (path: string) => void;
}

export const AndroidCardInterface: React.FC<AndroidCardInterfaceProps> = ({
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
    // Android-specific haptic feedback
    if (platform?.capabilities.hapticFeedback) {
      // Use Android vibration API
      navigator.vibrate(action.action === 'favorite' ? [50, 25, 50] : [25]);
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
    // Android-specific authentication logic
    // This would integrate with Android keystore and biometric auth
    console.log('Android Auth:', { email, isSignUp });
    
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
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
            className="px-6 py-3 bg-green-500 rounded-xl"
          >
            Choose Category
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900 relative">
      {/* Android status bar */}
      <div className="h-6 bg-gray-900"></div>
      
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
            platform={platform || { type: 'android', version: '1.0.0', capabilities: { hapticFeedback: true, pushNotifications: true, biometricAuth: true, deepLinking: true } }}
            onFavorite={toggleFavorite}
            onSkip={() => getNextCard()}
            onRefresh={() => getNextCard()}
            className="h-full shadow-2xl"
          />
        </div>
      </div>

      {/* Android Material Design action indicators */}
      {isDragging && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-8">
          <div className="w-16 h-16 bg-red-500/30 rounded-full flex items-center justify-center border-2 border-red-500/50">
            <span className="text-2xl">👎</span>
          </div>
          <div className="w-16 h-16 bg-green-500/30 rounded-full flex items-center justify-center border-2 border-green-500/50">
            <span className="text-2xl">❤️</span>
          </div>
        </div>
      )}

      {/* Floating Action Button (Android style) */}
      <div className="absolute bottom-20 right-4">
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-14 h-14 bg-green-500 rounded-full shadow-lg flex items-center justify-center"
        >
          <span className="text-white text-xl">👤</span>
        </button>
      </div>

      {/* Navigation */}
      <BaseNavigation
        items={navigationItems}
        onNavigate={onNavigate}
        platform={platform || { type: 'android', version: '1.0.0', capabilities: { hapticFeedback: true, pushNotifications: true, biometricAuth: true, deepLinking: true } }}
        layout="bottom"
        className="pb-4" // Android navigation bar
      />

      {/* Auth Modal */}
      <BaseAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={handleAuth}
        platform={platform || { type: 'android', version: '1.0.0', capabilities: { hapticFeedback: true, pushNotifications: true, biometricAuth: true, deepLinking: true } }}
      />
    </div>
  );
};

export default AndroidCardInterface;
