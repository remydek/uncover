// Base navigation component for web and mobile
import React from 'react';
import { Platform } from '../types';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  isActive?: boolean;
}

interface BaseNavigationProps {
  items: NavigationItem[];
  onNavigate: (path: string) => void;
  platform: Platform;
  className?: string;
  layout?: 'bottom' | 'top' | 'sidebar';
}

export const BaseNavigation: React.FC<BaseNavigationProps> = ({
  items,
  onNavigate,
  platform,
  className = '',
  layout = 'bottom'
}) => {
  const handleNavigate = (path: string) => {
    onNavigate(path);
    // Add haptic feedback for mobile
    if (platform.capabilities.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'top':
        return 'fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200';
      case 'sidebar':
        return 'fixed left-0 top-0 bottom-0 z-50 bg-white/90 backdrop-blur-md border-r border-gray-200 w-64';
      default:
        return 'fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200';
    }
  };

  const getContainerClasses = () => {
    switch (layout) {
      case 'sidebar':
        return 'flex flex-col p-4 space-y-2';
      default:
        return 'flex justify-around items-center p-4';
    }
  };

  const getItemClasses = (item: NavigationItem) => {
    const baseClasses = `
      flex items-center justify-center p-3 rounded-xl transition-all duration-200
      ${item.isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}
    `;
    
    if (layout === 'sidebar') {
      return `${baseClasses} w-full space-x-3`;
    }
    
    return `${baseClasses} flex-col space-y-1 min-w-[60px]`;
  };

  return (
    <nav className={`${getLayoutClasses()} ${className}`}>
      <div className={getContainerClasses()}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.path)}
            className={getItemClasses(item)}
            aria-label={item.label}
          >
            <span className={layout === 'sidebar' ? 'text-xl' : 'text-2xl'}>
              {item.icon}
            </span>
            {(layout === 'sidebar' || !platform.capabilities.hapticFeedback) && (
              <span className={`text-xs font-medium ${layout === 'sidebar' ? 'text-base' : ''}`}>
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BaseNavigation;
