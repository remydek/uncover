'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase, getUserFavorites, removeFromFavorites, ContentItem } from '@/lib/supabase'

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setUser(session.user)
      loadFavorites(session.user.id)
    } else {
      setLoading(false)
    }
  }

  const loadFavorites = async (userId: string) => {
    try {
      setLoading(true)
      const favoriteIds = await getUserFavorites(userId)
      
      if (favoriteIds.length > 0) {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .in('id', favoriteIds)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading favorites:', error)
        } else {
          setFavorites(data || [])
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (contentId: string) => {
    if (!user) return

    const success = await removeFromFavorites(user.id, contentId)
    if (success) {
      setFavorites(prev => prev.filter(item => item.id !== contentId))
    }
  }

  const handleBack = () => {
    router.back()
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'situation': return 'bg-accent-red'
      case 'dilemma': return 'bg-accent-blue'
      case 'questions': return 'bg-purple-600'
      default: return 'bg-gray-600'
    }
  }

  const getCategoryDisplayName = (category: string) => {
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
    return categoryMap[category] || category
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center pb-20">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
          {/* Animated Gradient Blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        <div className="relative z-10">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-red mx-auto mb-4"></div>
          <p>Loading favorites...</p>
        </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden p-4 pb-20">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
          {/* Animated Gradient Blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8 pt-12">
          <button
            onClick={handleBack}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-white">Favorites</h1>
        </div>

        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Sign in to save favorites</h2>
          <p className="text-text-secondary mb-6">
            Create an account to save your favorite questions and access them anytime
          </p>
          <button
            onClick={() => router.push('/categories')}
            className="bg-accent-red hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Get Started
          </button>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-4 pb-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Animated Gradient Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
      <div className="relative z-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-12">
        <button
          onClick={handleBack}
          className="text-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-semibold text-white">Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No favorites yet</h2>
          <p className="text-text-secondary mb-6">
            Start exploring and tap the heart icon to save questions you love
          </p>
          <button
            onClick={() => router.push('/categories')}
            className="bg-accent-red hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Explore Questions
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((item) => (
            <div key={item.id} className="bg-card-bg rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full text-white font-medium ${getContentTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {getCategoryDisplayName(item.category)}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(item.id)}
                  className="text-text-secondary hover:text-accent-red transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
