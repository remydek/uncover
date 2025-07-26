'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

const contentTypes = [
  { id: 'all', name: 'All Types', description: 'Mix of all question types' },
  { id: 'situation', name: 'Situations', description: 'What would you do scenarios' },
  { id: 'dilemma', name: 'Dilemmas', description: 'Moral choices & decisions' },
  { id: 'questions', name: 'Questions', description: 'Personal discovery prompts' }
]

export default function SettingsPage() {
  const router = useRouter()
  const [selectedContentType, setSelectedContentType] = useState('all')

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem('preferredContentType')
    if (saved) {
      setSelectedContentType(saved)
    }
  }, [])

  const handleContentTypeChange = (typeId: string) => {
    setSelectedContentType(typeId)
    localStorage.setItem('preferredContentType', typeId)
  }

  const handleBack = () => {
    router.back()
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
      
      {/* Content Overlay */}
      <div className="relative z-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-12">
        <button
          onClick={handleBack}
          className="text-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
      </div>

      {/* Content Type Preference */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-2">Question Type Preference</h2>
        <p className="text-text-secondary text-sm mb-6">
          Choose your preferred question type to skip the selection step each time
        </p>

        <div className="space-y-3">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleContentTypeChange(type.id)}
              className={`w-full p-4 rounded-lg border transition-all ${
                selectedContentType === type.id
                  ? 'border-accent-red bg-accent-red/10 text-white'
                  : 'border-gray-600 bg-card-bg text-text-secondary hover:border-gray-500 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-medium">{type.name}</div>
                  <div className="text-sm opacity-80">{type.description}</div>
                </div>
                {selectedContentType === type.id && (
                  <Check className="w-5 h-5 text-accent-red" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">About Uncover</h2>
        <div className="bg-card-bg p-4 rounded-lg">
          <p className="text-text-secondary text-sm leading-relaxed">
            Uncover helps you discover deeper connections through meaningful conversations. 
            Swipe through thought-provoking questions, scenarios, and dilemmas designed to 
            spark authentic discussions and personal discovery.
          </p>
        </div>
      </div>

      {/* Version */}
      <div className="text-center">
        <p className="text-text-secondary text-sm">Version 1.0.0</p>
      </div>
      </div>
    </div>
  )
}
