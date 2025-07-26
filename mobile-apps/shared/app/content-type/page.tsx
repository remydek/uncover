'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'

const contentTypes = [
  {
    id: 'situation',
    name: 'Situation',
    description: 'What would you do if...',
    color: 'bg-accent-red',
    icon: '🔥'
  },
  {
    id: 'dilemma',
    name: 'Dilemma',
    description: 'Moral choices & decisions',
    color: 'bg-accent-blue',
    icon: '💭'
  },
  {
    id: 'questions',
    name: 'Questions',
    description: 'Personal discovery prompts',
    color: 'bg-purple-600',
    icon: '❓'
  }
]

function ContentTypeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = searchParams.get('category')

  const handleContentTypeSelect = (contentType: string) => {
    router.push(`/cards?category=${category}&type=${contentType}`)
  }

  const handleBack = () => {
    router.back()
  }

  const getCategoryDisplayName = (categoryId: string | null) => {
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
    return categoryMap[categoryId || ''] || 'Unknown'
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
        <h1 className="text-3xl font-bold font-amiri text-accent-blue mb-2">
          Choose content type
        </h1>
      </div>

      {/* Content Types */}
      <div className="space-y-6 max-w-sm mx-auto">
        {contentTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleContentTypeSelect(type.id)}
            className={`w-full ${type.color} text-white p-6 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-xl font-semibold mb-1">{type.name}</div>
                <div className="text-sm opacity-90">{type.description}</div>
              </div>
              <div className="text-2xl">{type.icon}</div>
            </div>
          </button>
        ))}
      </div>

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

export default function ContentTypePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContentTypeContent />
    </Suspense>
  )
}
