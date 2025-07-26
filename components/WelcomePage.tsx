'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Heart, Sparkles, MessageCircle } from 'lucide-react'
import { useEffect } from 'react'

export default function WelcomePage() {
  const router = useRouter()

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Start Exploring button clicked')
    try {
      // Try Next.js router first
      if (typeof window !== 'undefined') {
        window.location.href = '/categories'
      } else {
        router.push('/categories')
      }
    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback to full page reload
      if (typeof window !== 'undefined') {
        window.location.href = '/categories'
      }
    }
  }

  // Ensure pointer events work on the entire page
  useEffect(() => {
    document.body.style.pointerEvents = 'auto'
    return () => {
      document.body.style.pointerEvents = ''
    }
  }, [])

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="fixed inset-0 w-full h-full -z-20"
        style={{
          backgroundImage: 'url(/bg.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          transform: 'translateZ(0)'
        }}
      ></div>
      <div className="fixed inset-0 bg-black/50 -z-10"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Logo/Title Section */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Heart className="w-12 h-12 text-red-400 mr-3" fill="currentColor" />
              <Sparkles className="w-6 h-6 text-blue-400 absolute -top-1 -right-1" />
            </div>
            <MessageCircle className="w-10 h-10 text-purple-400 ml-2" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Uncover
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-light mb-12">
            Discover deeper connections through meaningful conversations
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 space-y-4 w-full max-w-md mx-auto">
          {[
            { text: 'Thought-provoking questions', color: 'red' },
            { text: 'Real-life scenarios', color: 'blue' },
            { text: 'Personal discovery', color: 'purple' }
          ].map((item, index) => (
            <div 
              key={item.text} 
              className="flex items-center justify-center gap-3 text-white/80 bg-white/5 rounded-full px-6 py-3 border border-white/10 w-full"
            >
              <div 
                className={`w-2 h-2 bg-${item.color}-400 rounded-full`}
                style={{ animation: `pulse 2s ${index * 0.5}s infinite` }}
              ></div>
              <span className="text-lg">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <div className="relative">
          <a
            href="/categories"
            onClick={handleStart}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold text-xl py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25 border border-white/20 cursor-pointer"
          >
            Start Exploring
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Subtitle */}
        <p className="mt-8 text-white/60 text-base max-w-md mx-auto">
          Swipe through cards to spark authentic conversations and discover what matters most
        </p>
      </div>
    </div>
  )
}
