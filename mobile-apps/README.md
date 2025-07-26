# Uncover Mobile Apps Structure

This directory contains the mobile app versions of the Uncover application, organized for maximum code reusability between web, iOS, and Android platforms.

## Directory Structure

```
mobile-apps/
├── shared/
│   ├── components/          # Reusable base components
│   ├── types/              # Shared TypeScript types
│   ├── utils/              # Shared utility functions
│   ├── hooks/              # Shared React hooks
│   ├── app/                # Duplicated app structure
│   └── components-web/     # Original web components (backup)
├── ios/
│   └── components/         # iOS-specific components
└── android/
    └── components/         # Android-specific components
```

## Shared Components

### Base Components
- **BaseCard**: Core card component with platform-specific adaptations
- **BaseCategorySelection**: Category selection with different layouts
- **BaseContentTypeSelection**: Content type selection component
- **BaseNavigation**: Navigation component with multiple layout options
- **BaseAuthModal**: Authentication modal with platform-specific features

### Shared Types
- `ContentType`: 'DILEMMA' | 'SITUATIONS' | 'QUESTIONS'
- `Category`: All available categories
- `Card`: Card data structure
- `User`: User data structure
- `SwipeAction`: Swipe gesture actions
- `Platform`: Platform detection and capabilities

### Shared Hooks
- `usePlatform()`: Detects current platform and capabilities
- `useCards()`: Manages card state and operations
- `useSwipeGestures()`: Handles swipe gestures across platforms
- `useLocalStorage()`: Cross-platform local storage
- `useFilters()`: Content filtering logic

### Shared Utilities
- Platform detection
- Card shuffling and filtering
- Category color mapping
- Content formatting
- Debounce and throttle functions

## Platform-Specific Features

### iOS (`ios/components/IOSCardInterface.tsx`)
- iOS-specific haptic feedback patterns
- iOS safe area handling (status bar, home indicator)
- iOS-style navigation and interactions
- Integration with iOS keychain and biometric auth
- iOS-specific UI patterns and animations

### Android (`android/components/AndroidCardInterface.tsx`)
- Android-specific haptic feedback (vibration patterns)
- Material Design elements
- Floating Action Button (FAB)
- Android status bar and navigation bar handling
- Integration with Android keystore and biometric auth
- Android-specific UI patterns and animations

## Key Features Implemented

### Playing Card Style Letters
- D (Dilemma), Q (Questions), S (Situations) letters in card corners
- Letters colored according to active category
- Positioned like traditional playing cards (top-left, bottom-right rotated)

### Paper Texture Background
- Applied to all cards with multiply blend mode
- 50% scale for subtle texture effect
- Maintains readability while adding visual appeal

### Responsive Design
- Components adapt to different screen sizes
- Platform-specific safe areas and navigation
- Touch-friendly interactions for mobile

## Usage

### Web Version
Continue using the existing components in the main `/components` directory.

### Mobile Apps
Use the platform-specific components that extend the shared base components:

```tsx
// iOS
import { IOSCardInterface } from './mobile-apps/ios/components/IOSCardInterface';

// Android  
import { AndroidCardInterface } from './mobile-apps/android/components/AndroidCardInterface';
```

### Shared Components
Import shared components for custom implementations:

```tsx
import { 
  BaseCard, 
  BaseCategorySelection, 
  useCards, 
  usePlatform 
} from './shared/components';
```

## Development Workflow

1. **Shared Changes**: Make updates to shared components in `/shared/components/`
2. **Platform-Specific**: Add platform-specific features in respective directories
3. **Testing**: Test across all platforms to ensure consistency
4. **Reusability**: Always consider if new features should be shared or platform-specific

## Next Steps

1. Set up React Native or Expo projects for iOS and Android
2. Integrate with native device APIs (camera, notifications, etc.)
3. Add platform-specific animations and transitions
4. Implement offline data synchronization
5. Add push notifications and deep linking
6. Optimize performance for mobile devices

## Benefits of This Structure

- **Code Reusability**: Shared components reduce duplication
- **Maintainability**: Changes to core logic update all platforms
- **Consistency**: Unified behavior across platforms
- **Flexibility**: Platform-specific customizations when needed
- **Scalability**: Easy to add new platforms or features
