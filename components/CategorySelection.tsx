'use client'

import { useEffect } from 'react'
import { Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

const categories = [
  { id: 'family-friends', name: 'Family & Friends', borderColor: 'border-blue-500', textColor: 'text-blue-400', hoverBorderColor: 'hover:border-blue-400' },
  { id: 'dating-relationship', name: 'Dating & Relationship', borderColor: 'border-pink-500', textColor: 'text-pink-400', hoverBorderColor: 'hover:border-pink-400' },
  { id: 'fiction', name: 'Fiction', borderColor: 'border-purple-500', textColor: 'text-purple-400', hoverBorderColor: 'hover:border-purple-400' },
  { id: 'only-wrong-answers', name: 'Only wrong answers', borderColor: 'border-green-500', textColor: 'text-green-400', hoverBorderColor: 'hover:border-green-400' },
  { id: 'travel', name: 'Travel', borderColor: 'border-yellow-500', textColor: 'text-yellow-400', hoverBorderColor: 'hover:border-yellow-400' },
  { id: 'money', name: 'Money', borderColor: 'border-orange-500', textColor: 'text-orange-400', hoverBorderColor: 'hover:border-orange-400' },
  { id: '18+', name: '🔞 18+', borderColor: 'border-red-500', textColor: 'text-red-400', hoverBorderColor: 'hover:border-red-400' },
  { id: 'randomized', name: 'Randomized', borderColor: 'border-gray-500', textColor: 'text-gray-400', hoverBorderColor: 'hover:border-gray-400' },
]

export default function CategorySelection() {
  const router = useRouter()

  // Ensure pointer events work on the entire page
  useEffect(() => {
    document.body.style.pointerEvents = 'auto'
    return () => {
      document.body.style.pointerEvents = ''
    }
  }, [])

  const handleCategorySelect = (categoryId: string, e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Category selected:', categoryId)
    
    try {
      // Check if user has a preferred content type in settings
      const preferredContentType = typeof window !== 'undefined' 
        ? localStorage.getItem('preferredContentType') 
        : 'all'
      
      // Use preferred type or default to 'all' (which will show mixed content)
      const contentType = preferredContentType || 'all'
      
      console.log('Navigating to:', `/cards?category=${categoryId}&type=${contentType}`)
      
      // Try Next.js router first, fallback to window.location
      try {
        router.push(`/cards?category=${categoryId}&type=${contentType}`)
      } catch (error) {
        console.error('Router error, falling back to window.location:', error)
        window.location.href = `/cards?category=${categoryId}&type=${contentType}`
      }
    } catch (error) {
      console.error('Error in handleCategorySelect:', error)
      // Fallback to a safe route
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 relative overflow-hidden">
      {/* Background elements with pointer-events-none */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      {/* Main content with higher z-index */}
      <div className="relative z-10 max-w-md mx-auto h-full flex flex-col">
        {/* Title */}
        <div className="text-center mb-8 mt-12">
          <h1 className="text-3xl font-bold text-white mb-2">
            Choose a category
          </h1>
          <p className="text-gray-400">Select a category to start exploring</p>
        </div>

        {/* Categories */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`/cards?category=${category.id}&type=all`}
              onClick={(e) => {
                e.preventDefault()
                handleCategorySelect(category.id, e)
              }}
              className={`block w-full text-center border-2 ${category.borderColor} ${category.textColor} ${category.hoverBorderColor} py-4 px-6 rounded-lg font-medium text-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-gray-900/50 cursor-pointer`}
            >
              {category.name}
            </a>
          ))}
        </div>

        {/* Settings */}
        <div className="py-8 text-center">
          <button 
            onClick={() => router.push('/settings')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}
