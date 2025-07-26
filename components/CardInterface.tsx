'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, RotateCcw, ArrowLeft, Users, Heart as HeartIcon, BookOpen, Smile, Plane, DollarSign, Shield, Dice6, Theater, HelpCircle, MessageCircle, Shuffle, ChevronDown, Check, Download } from 'lucide-react'
import { useGesture } from '@use-gesture/react'
import { useSpring, animated } from '@react-spring/web'
import html2canvas from 'html2canvas'
import { getContentByTypeAndCategory, getRandomContent, ContentItem, ContentType, Category, supabase, addToFavorites, removeFromFavorites, getUserFavorites } from '@/lib/supabase'
import AuthModal from './AuthModal'

interface DropdownOption {
  value: string
  label: string
}

interface CustomDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  className?: string
  buttonClassName?: string
  menuClassName?: string
  optionClassName?: string
  category?: string
}

const CustomDropdown = ({
  options,
  value,
  onChange,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  optionClassName = '',
  category = ''
}: CustomDropdownProps) => {
  
  const getCategoryColor = (categoryId: string) => {
    const colorMap: { [key: string]: string } = {
      'family-friends': '#60a5fa', // blue-400
      'dating-relationship': '#f472b6', // pink-400
      'fiction': '#a78bfa', // purple-400
      'only-wrong-answers': '#4ade80', // green-400
      'travel': '#facc15', // yellow-400
      'money': '#fb923c', // orange-400
      '18+': '#f87171', // red-400
      'randomized': '#9ca3af' // gray-400
    }
    return colorMap[categoryId] || '#9ca3af'
  }
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find(option => option.value === value) || options[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={`w-full flex items-center justify-between px-6 py-4 rounded-full bg-white/10 border border-white/20 text-sm font-medium hover:bg-white/20 transition-colors ${buttonClassName}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          color: selectedOption?.value === 'all' ? 'white' : getCategoryColor(category)
        }}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 w-full rounded-2xl bg-gray-800/95 backdrop-blur-lg shadow-lg overflow-visible border border-white/10 ${menuClassName}`}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-6 py-4 text-sm flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors ${optionClassName} ${value === option.value ? 'bg-white/5' : ''}`}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              <span>{option.label}</span>
              {value === option.value && <Check className="w-4 h-4 text-blue-400" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface CardInterfaceProps {
  category: string
  contentType: string
}

export default function CardInterface({ category, contentType }: CardInterfaceProps) {
  const router = useRouter()
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [cardHistory, setCardHistory] = useState<number[]>([]) // Track card history for back button
  const [cards, setCards] = useState<ContentItem[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [swipeCount, setSwipeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [userFavorites, setUserFavorites] = useState<string[]>([])
  const [nextCard, setNextCard] = useState<ContentItem | null>(null)
  const [isAnimating, setIsAnimating] = useState(false) // Track animation state

  useEffect(() => {
    checkUser()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        getUserFavorites(session.user.id).then(setUserFavorites)
      } else {
        setUser(null)
        setUserFavorites([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Update next card when current card or cards change
  useEffect(() => {
    if (cards.length > 0) {
      const nextIndex = (currentCardIndex + 1) % cards.length
      setNextCard(cards[nextIndex] || null)
    }
  }, [currentCardIndex, cards])

  // Create fallback content in case of errors
  const generateFallbackContent = (category: string, type: string): ContentItem[] => {
    const fallbackItems = [
      {
        id: `fallback-${type}-1`,
        content: `What's your favorite memory related to ${category}?`,
        type: type as ContentType || 'questions',
        category: category as Category || 'randomized',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `fallback-${type}-2`,
        content: `If you could change one thing about ${category}, what would it be?`,
        type: type as ContentType || 'questions',
        category: category as Category || 'randomized',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: `fallback-${type}-3`,
        content: `What's something about ${category} that most people don't know?`,
        type: type as ContentType || 'questions',
        category: category as Category || 'randomized',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    return fallbackItems;
  };

  useEffect(() => {
    console.log('=== CardInterface useEffect triggered ===');
    console.log('Props received:', { category, contentType });
    
    // Immediately set loading to true
    setLoading(true);
    setError(null);
    
    // Generate content synchronously to avoid async issues
    const generateContent = () => {
      console.log('Generating content for:', { category, contentType });
      
      let content: ContentItem[] = [];
      
      // Always use fallback/mock content for now to ensure it works
      if (category === 'randomized') {
        content = [
          {
            id: 'random-1',
            content: 'What\'s the most spontaneous thing you\'ve ever done?',
            type: 'questions',
            category: 'randomized',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'random-2',
            content: 'If you could have dinner with anyone, living or dead, who would it be?',
            type: 'questions',
            category: 'randomized',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'random-3',
            content: 'What\'s one thing you\'ve always wanted to try but never have?',
            type: 'questions',
            category: 'randomized',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      } else if (contentType === 'all') {
        // Mixed content for the category
        content = [
          {
            id: `${category}-situation-1`,
            content: `You\'re in a situation related to ${category}. What would you do?`,
            type: 'situation',
            category: category as Category,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: `${category}-dilemma-1`,
            content: `You face a tough choice about ${category}. What\'s your decision?`,
            type: 'dilemma',
            category: category as Category,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: `${category}-question-1`,
            content: `What\'s your most memorable experience with ${category}?`,
            type: 'questions',
            category: category as Category,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      } else {
        // Specific content type
        content = [
          {
            id: `${category}-${contentType}-1`,
            content: `Tell me about your experience with ${category} and ${contentType}.`,
            type: contentType as ContentType,
            category: category as Category,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: `${category}-${contentType}-2`,
            content: `What would you do if you had to choose something about ${category}?`,
            type: contentType as ContentType,
            category: category as Category,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: `${category}-${contentType}-3`,
            content: `Share a story about ${category} that shaped who you are.`,
            type: contentType as ContentType,
            category: category as Category,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
      
      console.log('Generated content:', content.length, 'items');
      return content;
    };
    
    // Use setTimeout to simulate async behavior but ensure it completes
    setTimeout(() => {
      try {
        const content = generateContent();
        setCards(content);
        setError(null);
        console.log('Cards set successfully:', content.length, 'items');
      } catch (err) {
        console.error('Error generating content:', err);
        setError('Failed to generate content');
      } finally {
        setLoading(false);
      }
    }, 100); // Very short delay to show loading state
  }, [category, contentType])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setUser(session.user)
      const favorites = await getUserFavorites(session.user.id)
      setUserFavorites(favorites)
    }
  }

  const [{ x, rotate }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
  }))

  const bind = useGesture({
    onDrag: ({ active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      const trigger = vx > 0.2 || Math.abs(mx) > 100
      
      if (!active && trigger) {
        // Swipe detected
        handleSwipe(xDir > 0 ? 'right' : 'left')
      } else {
        api.start({
          x: active ? mx : 0,
          rotate: active ? mx / 10 : 0,
          immediate: active,
        })
      }
    },
  })

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return; // Prevent multiple swipes during animation
    
    const newSwipeCount = swipeCount + 1;
    setSwipeCount(newSwipeCount);
    setIsAnimating(true);

    // Show auth prompt after 3 swipes ONLY if user is not logged in
    if (newSwipeCount >= 3 && !user) {
      setShowAuthPrompt(true);
      return;
    }

    // Add current card to history before moving to next
    setCardHistory(prev => [...prev, currentCardIndex]);

    // Animate card out with smoother animation
    api.start({
      x: direction === 'right' ? 1000 : -1000,
      rotate: direction === 'right' ? 30 : -30,
      config: { 
        tension: 300, 
        friction: 30,
        mass: 1,
        velocity: 5
      },
      onRest: () => {
        // Update card index after animation completes
        const newIndex = currentCardIndex < cards.length - 1 ? currentCardIndex + 1 : 0;
        setCurrentCardIndex(newIndex);
        
        // Reset card position with a slight delay for smoother transition
        setTimeout(() => {
          api.start({
            x: 0,
            rotate: 0,
            immediate: true,
            onRest: () => setIsAnimating(false)
          });
        }, 50);
      }
    });
  };

  const handleBack = () => {
    if (isAnimating || cardHistory.length === 0) return;
    
    setIsAnimating(true);
    
    // Animate card out to the right
    api.start({
      x: 1000,
      rotate: 30,
      config: { 
        tension: 300, 
        friction: 30,
        mass: 1,
        velocity: 5
      },
      onRest: () => {
        // Get the last card from history
        const previousIndex = cardHistory[cardHistory.length - 1];
        setCurrentCardIndex(previousIndex);
        setCardHistory(prev => prev.slice(0, -1));
        
        // Reset card position with a slight delay
        setTimeout(() => {
          api.start({
            x: 0,
            rotate: 0,
            immediate: true,
            onRest: () => setIsAnimating(false)
          });
        }, 50);
      }
    });
  };

  const handleFavorite = async () => {
    const currentCard = cards[currentCardIndex]
    if (!currentCard) return

    if (!user) {
      setShowAuthPrompt(true)
      return
    }

    const isFavorited = userFavorites.includes(currentCard.id)
    
    if (isFavorited) {
      const success = await removeFromFavorites(user.id, currentCard.id)
      if (success) {
        setUserFavorites(prev => prev.filter(id => id !== currentCard.id))
        const newFavorites = new Set(favorites)
        newFavorites.delete(currentCard.id)
        setFavorites(newFavorites)
      }
    } else {
      const success = await addToFavorites(user.id, currentCard.id)
      if (success) {
        setUserFavorites(prev => [...prev, currentCard.id])
        const newFavorites = new Set(favorites)
        newFavorites.add(currentCard.id)
        setFavorites(newFavorites)
      }
    }
  }

  const handleRefresh = () => {
    handleSwipe('left')
  }

  const getContentTypeDisplayName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'situation': 'Situation',
      'dilemma': 'Dilemma', 
      'questions': 'Questions'
    }
    return typeMap[type] || type
  }

  const getCategoryDisplayName = (categoryId: string) => {
    const categoryMap: { [key: string]: string } = {
      'family-friends': 'Family & Friends',
      'dating-relationship': 'Dating & Relationship',
      'fiction': 'Fiction',
      'only-wrong-answers': 'Only wrong answers',
      'travel': 'Travel',
      'money': 'Money',
      '18+': '18+',
      'randomized': 'Randomized'
    }
    return categoryMap[categoryId] || categoryId
  }

  const getCategoryBorderColor = (categoryId: string) => {
    const colorMap: { [key: string]: string } = {
      'family-friends': 'border-blue-500',
      'dating-relationship': 'border-pink-500',
      'fiction': 'border-purple-500',
      'only-wrong-answers': 'border-green-500',
      'travel': 'border-yellow-500',
      'money': 'border-orange-500',
      '18+': 'border-red-500',
      'randomized': 'border-gray-500'
    }
    return colorMap[categoryId] || 'border-gray-500'
  }

  const getCategoryTextColor = (categoryId: string) => {
    const colorMap: { [key: string]: string } = {
      'family-friends': 'text-blue-400',
      'dating-relationship': 'text-pink-400',
      'fiction': 'text-purple-400',
      'only-wrong-answers': 'text-green-400',
      'travel': 'text-yellow-400',
      'money': 'text-orange-400',
      '18+': 'text-red-400',
      'randomized': 'text-gray-400'
    }
    return colorMap[categoryId] || 'text-gray-400'
  }

  const getContentTypeLetter = (type: string) => {
    const letterMap: { [key: string]: string } = {
      'situation': 'S',
      'dilemma': 'D',
      'questions': 'Q'
    }
    return letterMap[type] || 'X'
  }

  const getCategoryColor = (categoryId: string) => {
    const colorMap: { [key: string]: string } = {
      'family-friends': '#60a5fa', // blue-400
      'dating-relationship': '#f472b6', // pink-400
      'fiction': '#a78bfa', // purple-400
      'only-wrong-answers': '#4ade80', // green-400
      'travel': '#facc15', // yellow-400
      'money': '#fb923c', // orange-400
      '18+': '#f87171', // red-400
      'randomized': '#9ca3af' // gray-400
    }
    return colorMap[categoryId] || '#9ca3af'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading cards...</div>
      </div>
    )
  }

  if (error || cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h2 className="text-white text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p className="text-white/70 text-lg mb-2">
            {error || 'No content available for this selection'}
          </p>
          <p className="text-white/50 text-sm">
            This might be due to database connection issues or missing content.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-accent-blue hover:text-white transition-colors backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="text-white/70 hover:text-white transition-colors backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  const currentCard = cards[currentCardIndex]



  // Function to handle downloading the card as an image
  const handleDownload = async () => {
    const cardElement = document.getElementById('main-card');
    if (!cardElement) return;

    // Create a temporary container with the same dimensions as the card
    const tempElement = document.createElement('div');
    tempElement.style.position = 'fixed';
    tempElement.style.left = '-9999px';
    tempElement.style.top = '0';
    tempElement.style.width = '320px';
    tempElement.style.height = '500px';
    tempElement.style.overflow = 'hidden';
    tempElement.style.borderRadius = '1.5rem';
    tempElement.style.boxShadow = `0 0 40px 5px ${getCategoryColor(category)}80, 0 25px 50px -12px rgba(0, 0, 0, 0.8)`;
    tempElement.style.border = `1px solid ${getCategoryColor(category)}30`;
    tempElement.style.background = 'transparent';

    // Create card background - Darker with transparency
    const cardBg = document.createElement('div');
    cardBg.style.position = 'absolute';
    cardBg.style.top = '0';
    cardBg.style.left = '0';
    cardBg.style.width = '100%';
    cardBg.style.height = '100%';
    cardBg.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    cardBg.style.backdropFilter = 'blur(20px)';
    // @ts-ignore - webkitBackdropFilter is needed for Safari
    cardBg.style.webkitBackdropFilter = 'blur(20px)';
    cardBg.style.borderRadius = '1.5rem';
    cardBg.style.border = `1px solid ${getCategoryColor(category)}20`; // Subtle border
    
    // Add paper texture - Darker and more subtle
    const paperTexture = document.createElement('div');
    paperTexture.style.position = 'absolute';
    paperTexture.style.top = '0';
    paperTexture.style.left = '0';
    paperTexture.style.width = '100%';
    paperTexture.style.height = '100%';
    paperTexture.style.backgroundImage = 'url(/card-paper-texture.jpg)';
    paperTexture.style.backgroundSize = '50% 50%';
    paperTexture.style.backgroundRepeat = 'repeat';
    paperTexture.style.opacity = '0.15';
    paperTexture.style.borderRadius = '1.5rem';
    paperTexture.style.mixBlendMode = 'overlay';
    
    // Add glass shine effect - More subtle
    const glassShine = document.createElement('div');
    glassShine.style.position = 'absolute';
    glassShine.style.top = '0';
    glassShine.style.left = '0';
    glassShine.style.width = '100%';
    glassShine.style.height = '100%';
    glassShine.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0) 100%)';
    glassShine.style.borderRadius = '1.5rem';
    glassShine.style.pointerEvents = 'none';
    glassShine.style.opacity = '0.8';
    
    // Add top shine line
    const topShine = document.createElement('div');
    topShine.style.position = 'absolute';
    topShine.style.top = '0';
    topShine.style.left = '0';
    topShine.style.width = '100%';
    topShine.style.height = '3px';
    topShine.style.background = 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)';
    topShine.style.borderRadius = '1.5rem 1.5rem 0 0';
    
    // Create card content container
    const cardContent = document.createElement('div');
    cardContent.style.position = 'relative';
    cardContent.style.width = '100%';
    cardContent.style.height = '100%';
    cardContent.style.padding = '2rem';
    cardContent.style.display = 'flex';
    cardContent.style.flexDirection = 'column';
    cardContent.style.alignItems = 'center';
    cardContent.style.justifyContent = 'center';
    
    // Add card type indicator (top left)
    const typeIndicatorTop = document.createElement('div');
    typeIndicatorTop.style.position = 'absolute';
    typeIndicatorTop.style.top = '1rem';
    typeIndicatorTop.style.left = '1rem';
    typeIndicatorTop.style.fontSize = '2.25rem';
    typeIndicatorTop.style.fontWeight = 'bold';
    typeIndicatorTop.style.fontFamily = 'Amiri, serif';
    typeIndicatorTop.style.color = getCategoryColor(category);
    typeIndicatorTop.textContent = getContentTypeLetter(cards[currentCardIndex]?.type || 'question');
    
    // Add card type indicator (bottom right, rotated)
    const typeIndicatorBottom = document.createElement('div');
    typeIndicatorBottom.style.position = 'absolute';
    typeIndicatorBottom.style.bottom = '1rem';
    typeIndicatorBottom.style.right = '1rem';
    typeIndicatorBottom.style.fontSize = '2.25rem';
    typeIndicatorBottom.style.fontWeight = 'bold';
    typeIndicatorBottom.style.fontFamily = 'Amiri, serif';
    typeIndicatorBottom.style.color = getCategoryColor(category);
    typeIndicatorBottom.style.transform = 'rotate(180deg)';
    typeIndicatorBottom.textContent = getContentTypeLetter(cards[currentCardIndex]?.type || 'question');
    
    // Add card text
    const cardText = document.createElement('p');
    cardText.style.fontSize = '1.125rem';
    cardText.style.lineHeight = '1.75';
    cardText.style.color = 'white';
    cardText.style.fontFamily = 'Inter, sans-serif';
    cardText.style.textAlign = 'center';
    cardText.style.maxWidth = '100%';
    cardText.style.wordBreak = 'break-word';
    cardText.textContent = cards[currentCardIndex]?.content || '';
    
    // Add "by Uncover" watermark
    const watermark = document.createElement('div');
    watermark.textContent = 'by Uncover';
    watermark.style.position = 'absolute';
    watermark.style.bottom = '1rem';
    watermark.style.left = '50%';
    watermark.style.transform = 'translateX(-50%)';
    watermark.style.fontSize = '0.875rem';
    watermark.style.opacity = '0.7';
    watermark.style.fontFamily = 'Inter, sans-serif';
    watermark.style.color = 'white';
    
    // Assemble the card
    cardContent.appendChild(typeIndicatorTop);
    cardContent.appendChild(typeIndicatorBottom);
    cardContent.appendChild(cardText);
    cardContent.appendChild(watermark);
    
    tempElement.appendChild(cardBg);
    tempElement.appendChild(paperTexture);
    tempElement.appendChild(glassShine);
    tempElement.appendChild(topShine);
    tempElement.appendChild(cardContent);
    
    document.body.appendChild(tempElement);

    try {
      // Add favorite heart to the card if it's favorited (positioned bottom-left of card)
      if (userFavorites.includes(cards[currentCardIndex]?.id)) {
        // Add D/S/Q letter (top-left)
        const letterSpan = document.createElement('span');
        letterSpan.textContent = getContentTypeLetter(cards[currentCardIndex].type);
        letterSpan.style.position = 'absolute';
        letterSpan.style.top = '1rem';
        letterSpan.style.left = '1rem';
        letterSpan.style.fontSize = '2.25rem';
        letterSpan.style.fontWeight = 'bold';
        letterSpan.style.fontFamily = 'Amiri, serif';
        letterSpan.style.color = getCategoryColor(category);
        letterSpan.style.lineHeight = '1';
        cardContent.appendChild(letterSpan);
        
        // Add heart icon (bottom-left of card)
        const heartContainer = document.createElement('div');
        heartContainer.style.position = 'absolute';
        heartContainer.style.bottom = '1rem';
        heartContainer.style.left = '1rem';
        heartContainer.style.display = 'flex';
        heartContainer.style.alignItems = 'center';
        heartContainer.style.justifyContent = 'center';
        heartContainer.style.zIndex = '20';
        
        const heartSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        heartSvg.setAttribute('width', '28');
        heartSvg.setAttribute('height', '28');
        heartSvg.setAttribute('viewBox', '0 0 24 24');
        heartSvg.setAttribute('fill', '#f87171');
        heartSvg.setAttribute('stroke', '#f87171');
        heartSvg.setAttribute('stroke-width', '2.5');
        heartSvg.setAttribute('stroke-linecap', 'round');
        heartSvg.setAttribute('stroke-linejoin', 'round');
        heartSvg.style.filter = 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.3))';
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z');
        
        heartSvg.appendChild(path);
        heartContainer.appendChild(heartSvg);
        cardContent.appendChild(heartContainer);
      }

      const canvas = await html2canvas(tempElement, {
        backgroundColor: null, // Fully transparent background
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 15000, // Increase timeout for image loading
        removeContainer: true, // Clean up the temporary container
        foreignObjectRendering: false, // Better text rendering
        onclone: (clonedDoc: Document) => {
          // Ensure the cloned element has the same styles
          const clonedElement = clonedDoc.getElementById('card-for-download');
          if (clonedElement) {
            clonedElement.style.backgroundColor = 'transparent';
          }
        },
        ignoreElements: (element: HTMLElement) => {
          // Ignore elements that might cause rendering issues
          return element.classList?.contains('ignore-on-export');
        }
      } as any); // Using type assertion to bypass TypeScript errors with html2canvas types
      
      // Create download link
      const link = document.createElement('a');
      link.download = `uncover-card-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating card image:', error);
    } finally {
      // Clean up
      document.body.removeChild(tempElement);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-4 flex flex-col items-center justify-center">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Animated Gradient Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-sm mx-auto flex-1 flex flex-col justify-center">


      {/* Dropdown Selectors */}
      <div className="flex flex-col items-center justify-center mb-8 space-y-4 w-full px-4 mx-auto" style={{ maxWidth: 'calc(22ch + 40px)' }}>
        {/* Content Type Dropdown */}
        <div className="w-full">
          <CustomDropdown
            value={contentType}
            onChange={(newContentType) => {
              window.location.href = `/cards?category=${category}&type=${newContentType}`
            }}
            options={[
              { value: 'situation', label: 'Situations' },
              { value: 'dilemma', label: 'Dilemmas' },
              { value: 'questions', label: 'Questions' },
              { value: 'all', label: 'All Types' }
            ]}
            category={category}
            buttonClassName="text-center"
            menuClassName="ring-1 ring-white/10 shadow-xl w-full"
            optionClassName="py-3"
          />
        </div>

        {/* Category Dropdown */}
        <div className="w-full">
          <CustomDropdown
            value={category}
            onChange={(newCategory) => {
              router.push(`/cards?category=${newCategory}&type=${contentType}`)
            }}
            options={[
              { value: 'family-friends', label: 'Family & Friends' },
              { value: 'dating-relationship', label: 'Dating & Relationship' },
              { value: 'fiction', label: 'Fiction' },
              { value: 'only-wrong-answers', label: 'Only wrong answers' },
              { value: 'travel', label: 'Travel' },
              { value: 'money', label: 'Money' },
              { value: '18+', label: '18+' },
              { value: 'randomized', label: 'Randomized' }
            ]}
            category={category}
            buttonClassName="text-center"
            menuClassName="ring-1 ring-white/10 shadow-xl w-full"
            optionClassName="py-3"
          />
        </div>
      </div>

      {/* Card Container */}
      <div className="flex items-center justify-center" style={{perspective: '1000px'}}>
        <div className="relative flex items-center justify-center" style={{width: '320px', height: '500px'}}>
          {/* Card Stack - Background Cards with 3D Effect */}
          
          {/* Third card (deepest) */}
          <div className="absolute inset-0 transform translate-x-4 translate-y-6 scale-90" style={{transform: 'translateX(16px) translateY(24px) scale(0.90) rotateX(5deg) rotateY(-3deg)', height: '500px', width: '320px'}}>
            <div className={`backdrop-blur-md bg-black/20 rounded-3xl h-full shadow-2xl opacity-40`}
                 style={{filter: 'blur(1px)'}}></div>
          </div>
          
          {/* Second card (middle) */}
          <div className="absolute inset-0 transform translate-x-2 translate-y-3 scale-95" style={{transform: 'translateX(8px) translateY(12px) scale(0.95) rotateX(3deg) rotateY(-2deg)', height: '500px', width: '320px'}}>
            <div className={`backdrop-blur-lg bg-black/25 rounded-3xl h-full shadow-xl opacity-60`}
                 style={{filter: 'blur(0.5px)'}}></div>
          </div>
          
          {/* Next Card Preview */}
          {nextCard && (
            <div className="absolute inset-0 transform translate-x-1 translate-y-1.5 scale-98" style={{transform: 'translateX(4px) translateY(6px) scale(0.98) rotateX(1deg) rotateY(-1deg)', height: '500px', width: '320px'}}>
              <div className="backdrop-blur-xl bg-black/30 rounded-3xl h-full shadow-xl opacity-75 p-8 flex items-center justify-center">
                <p className="text-white/70 text-center text-sm">{nextCard.content.substring(0, 80)}{nextCard.content.length > 80 ? '...' : ''}</p>
              </div>
            </div>
          )}
          
          {/* Main Card */}
          <animated.div
            id="main-card"
            {...bind()}
            style={{
              x,
              rotate: rotate.to(r => `${r}deg`),
              transform: 'translateZ(0px)',
              boxShadow: `0 0 40px 5px ${getCategoryColor(category)}80, 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
              border: `2px solid ${getCategoryColor(category)}`,
              height: '500px',
              width: '320px'
            }}
            className="relative backdrop-blur-xl bg-black/35 rounded-3xl p-8 cursor-grab active:cursor-grabbing no-select touch-none overflow-hidden z-10 flex flex-col items-center justify-center"
          >
            {/* Paper texture background */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-20"
              style={{
                backgroundImage: 'url(/card-paper-texture.jpg)',
                backgroundSize: '50% 50%',
                backgroundRepeat: 'repeat'
              }}
            ></div>
            
            {/* Enhanced glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/5 to-transparent rounded-3xl pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-t-3xl"></div>
            
            {/* Connecting strokes */}
            <div className="absolute inset-0 pointer-events-none">

            </div>
            
            {/* Playing card letters - Top Left */}
            <div className="absolute top-4 left-4">
              <span 
                className="text-4xl font-bold font-amiri leading-none block"
                style={{ color: getCategoryColor(category) }}
              >
                {getContentTypeLetter(currentCard.type)}
              </span>
            </div>
            
            {/* Heart Icon - Bottom Left of Card */}
            <div 
              className="absolute bottom-4 left-4 flex items-center justify-center cursor-pointer z-20"
              onClick={(e) => {
                e.stopPropagation();
                handleFavorite();
              }}
              aria-label={userFavorites.includes(currentCard.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <HeartIcon 
                className={`transition-all duration-200 ${userFavorites.includes(currentCard.id) ? 'text-red-400 hover:text-red-300' : 'text-white/70 hover:text-white'}`}
                style={{
                  width: '1.75rem',
                  height: '1.75rem',
                  filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.3))'
                }}
                fill={userFavorites.includes(currentCard.id) ? 'currentColor' : 'none'} 
                strokeWidth={2.5}
              />
            </div>
            
            {/* Playing card letters - Bottom Right (rotated) */}
            <div className="absolute bottom-4 right-4 flex flex-col items-center transform rotate-180">
              <span 
                className="text-4xl font-bold font-amiri leading-none"
                style={{ color: getCategoryColor(category) }}
              >
                {getContentTypeLetter(currentCard.type)}
              </span>
            </div>
            
            {/* Card content */}
            <div className="relative z-10 text-center flex items-center justify-center h-full">
              <p className="text-lg leading-relaxed text-white font-inter drop-shadow-lg">
                {currentCard.content}
              </p>
              

            </div>
          </animated.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-4 md:gap-6 mt-8 mb-20">
        {/* Back Button */}
        <button
          onClick={handleBack}
          disabled={cardHistory.length === 0}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-xl border ${
            cardHistory.length > 0 
              ? 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20 border-white/20' 
              : 'bg-white/5 text-white/30 border-white/10 cursor-not-allowed'
          }`}
          aria-label="Go back to previous card"
        >
          <ArrowLeft className="w-6 h-6 md:w-7 md:h-7" />
        </button>
        
        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-14 h-14 md:w-16 md:h-16 backdrop-blur-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-white/20"
          aria-label="Download card"
        >
          <Download className="w-6 h-6 md:w-7 md:h-7" />
        </button>
        
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="w-14 h-14 md:w-16 md:h-16 backdrop-blur-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-white/20"
          aria-label="Next card"
        >
          <RotateCcw className="w-6 h-6 md:w-7 md:h-7" />
        </button>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        onSuccess={() => {
          setShowAuthPrompt(false)
          checkUser()
        }}
      />

      {/* Back Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to categories</span>
        </button>
      </div>
      </div>
    </div>
  )
}
