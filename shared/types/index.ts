// Shared types for web and mobile versions
export type ContentType = 'DILEMMA' | 'SITUATIONS' | 'QUESTIONS';

export type Category = 
  | 'Family & Friends'
  | 'Dating & Relationship'
  | 'Fiction'
  | 'Only wrong answers'
  | 'Travel'
  | 'Money'
  | '18+'
  | 'Randomized';

export interface Card {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  category: Category;
  is_favorited?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface SwipeAction {
  direction: 'left' | 'right' | 'up' | 'down';
  cardId: string;
  action: 'skip' | 'favorite' | 'refresh';
}

export interface AppState {
  currentCard: Card | null;
  cards: Card[];
  favorites: Card[];
  selectedCategory: Category | null;
  selectedContentType: ContentType | null;
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
}

export interface Platform {
  type: 'web' | 'ios' | 'android';
  version: string;
  capabilities: {
    hapticFeedback: boolean;
    pushNotifications: boolean;
    biometricAuth: boolean;
    deepLinking: boolean;
  };
}
