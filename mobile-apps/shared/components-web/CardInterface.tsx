'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, RotateCcw, ArrowLeft } from 'lucide-react'
import { useGesture } from '@use-gesture/react'
import { useSpring, animated } from '@react-spring/web'
import { getContentByTypeAndCategory, getRandomContent, ContentItem, ContentType, Category, supabase, addToFavorites, removeFromFavorites, getUserFavorites } from '@/lib/supabase'
import AuthModal from './AuthModal'

interface CardInterfaceProps {
  category: string
  contentType: string
}

export default function CardInterface({ category, contentType }: CardInterfaceProps) {
  const router = useRouter()
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [cards, setCards] = useState<ContentItem[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [swipeCount, setSwipeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [userFavorites, setUserFavorites] = useState<string[]>([])

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

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        setError(null)
        
        let content: ContentItem[] = []
        
        if (category === 'randomized') {
          content = await getRandomContent(20)
        } else if (contentType === 'all') {
          // Get mixed content from all types for this category
          const [situations, dilemmas, questions] = await Promise.all([
            getContentByTypeAndCategory('situation', category as Category),
            getContentByTypeAndCategory('dilemma', category as Category),
            getContentByTypeAndCategory('questions', category as Category)
          ])
          content = [...situations, ...dilemmas, ...questions]
          // Shuffle the mixed content
          content = content.sort(() => Math.random() - 0.5)
        } else {
          content = await getContentByTypeAndCategory(
            contentType as ContentType, 
            category as Category
          )
        }
        
        if (content.length === 0) {
          setError('No content available for this combination')
        } else {
          setCards(content)
        }
      } catch (err) {
        console.error('Error fetching content:', err)
        setError('Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
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
    const newSwipeCount = swipeCount + 1
    setSwipeCount(newSwipeCount)

    // Show auth prompt after 3 swipes ONLY if user is not logged in
    if (newSwipeCount >= 3 && !user) {
      setShowAuthPrompt(true)
      return
    }

    // Animate card out
    api.start({
      x: direction === 'right' ? 1000 : -1000,
      rotate: direction === 'right' ? 30 : -30,
      config: { tension: 200, friction: 20 },
    })

    // Move to next card after animation
    setTimeout(() => {
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1)
      } else {
        // Reset to first card or handle end of deck
        setCurrentCardIndex(0)
      }
      
      // Reset card position
      api.start({
        x: 0,
        rotate: 0,
        immediate: true,
      })
    }, 300)
  }

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

  const handleBack = () => {
    router.back()
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
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p>Loading content...</p>
        </div>
      </div>
    )
  }

  if (error || cards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">{error || 'No content available for this combination'}</p>
          <button onClick={handleBack} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const currentCard = cards[currentCardIndex]



  return (
    <div className="min-h-screen relative overflow-hidden p-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Animated Gradient Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10">


      {/* Content Type Title */}
      <div className="text-center mb-8 mt-16">
        <h1 className={`text-3xl font-bold font-amiri ${getCategoryTextColor(category)}`}>
          {getContentTypeDisplayName(currentCard.type)}
        </h1>
      </div>

      {/* Category Selector */}
      <div className="flex justify-center mb-8">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full px-4 py-2">
          <span className={`text-sm font-medium ${getCategoryTextColor(category)}`}>
            {getCategoryDisplayName(category)}
          </span>
        </div>
      </div>

      {/* Card Container */}
      <div className="flex-1 flex items-center justify-center px-4" style={{perspective: '1000px'}}>
        <div className="relative w-full max-w-sm">
          {/* Card Stack - Background Cards with 3D Effect */}
          
          {/* Third card (deepest) */}
          <div className="absolute inset-0 transform translate-x-4 translate-y-6 scale-90" style={{transform: 'translateX(16px) translateY(24px) scale(0.90) rotateX(5deg) rotateY(-3deg)', height: '400px'}}>
            <div className={`backdrop-blur-md bg-white/3 rounded-3xl h-full shadow-2xl border border-white/8 ${getCategoryBorderColor(category)} opacity-40`}
                 style={{filter: 'blur(1px)'}}></div>
          </div>
          
          {/* Second card (middle) */}
          <div className="absolute inset-0 transform translate-x-2 translate-y-3 scale-95" style={{transform: 'translateX(8px) translateY(12px) scale(0.95) rotateX(3deg) rotateY(-2deg)', height: '400px'}}>
            <div className={`backdrop-blur-lg bg-white/5 rounded-3xl h-full shadow-xl border border-white/12 ${getCategoryBorderColor(category)} opacity-60`}
                 style={{filter: 'blur(0.5px)'}}></div>
          </div>
          
          {/* First card (closest background) */}
          <div className="absolute inset-0 transform translate-x-1 translate-y-1.5 scale-98" style={{transform: 'translateX(4px) translateY(6px) scale(0.98) rotateX(1deg) rotateY(-1deg)', height: '400px'}}>
            <div className={`backdrop-blur-xl bg-white/7 rounded-3xl h-full shadow-xl border border-white/15 ${getCategoryBorderColor(category)} opacity-75`}></div>
          </div>
          
          {/* Main Card */}
          <animated.div
            {...bind()}
            style={{
              x,
              rotate: rotate.to(r => `${r}deg`),
              transform: 'translateZ(0px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              height: '400px'
            }}
            className={`relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 cursor-grab active:cursor-grabbing no-select touch-none border border-white/20 ${getCategoryBorderColor(category)} overflow-hidden z-10 flex items-center justify-center`}
          >
            {/* Paper texture background */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-30"
              style={{
                backgroundImage: 'url(/card-paper-texture.jpg)',
                backgroundSize: '50% 50%',
                backgroundRepeat: 'repeat',
                mixBlendMode: 'multiply'
              }}
            ></div>
            
            {/* Enhanced glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/5 to-transparent rounded-3xl pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-t-3xl"></div>
            
            {/* Playing card letters - Top Left */}
            <div className="absolute top-4 left-4 flex flex-col items-center">
              <span 
                className="text-2xl font-bold font-mono leading-none"
                style={{ color: getCategoryColor(category) }}
              >
                {getContentTypeLetter(currentCard.type)}
              </span>
            </div>
            
            {/* Playing card letters - Bottom Right (rotated) */}
            <div className="absolute bottom-4 right-4 flex flex-col items-center transform rotate-180">
              <span 
                className="text-2xl font-bold font-mono leading-none"
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
      <div className="flex justify-center items-center gap-8 mt-8 mb-20">
        <button
          onClick={handleFavorite}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-xl border border-white/20 ${
            userFavorites.includes(currentCard.id) 
              ? 'bg-red-500/30 text-red-300 border-red-400/50' 
              : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
          }`}
        >
          <Heart className="w-7 h-7" fill={userFavorites.includes(currentCard.id) ? 'currentColor' : 'none'} />
        </button>
        
        <button
          onClick={handleRefresh}
          className="w-16 h-16 backdrop-blur-xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-white/20"
        >
          <RotateCcw className="w-7 h-7" />
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
