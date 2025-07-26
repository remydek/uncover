'use client'

import { useState } from 'react'
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

  const handleCategorySelect = (categoryId: string) => {
    // Check if user has a preferred content type in settings
    const preferredContentType = localStorage.getItem('preferredContentType')
    
    // Use preferred type or default to 'all' (which will show mixed content)
    const contentType = preferredContentType || 'all'
    
    // Always skip content type selection and go directly to cards
    router.push(`/cards?category=${categoryId}&type=${contentType}`)
  }

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


      {/* Title */}
      <div className="text-center mb-12 mt-8">
        <h1 className="text-3xl font-bold font-amiri text-accent-red mb-2">
          Choose a category
        </h1>
      </div>

      {/* Categories */}
      <div className="space-y-4 max-w-sm mx-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`w-full bg-black border-2 ${category.borderColor} ${category.textColor} ${category.hoverBorderColor} py-4 px-6 rounded-lg font-medium text-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-gray-900`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Settings */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <button className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
      </div>
    </div>
  )
}
