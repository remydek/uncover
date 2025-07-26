'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'

export default function WelcomePage() {
  const router = useRouter()

  const handleStart = () => {
    router.push('/categories')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg.jpeg)',
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        {/* Logo/Title Section */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-accent-red mr-2" />
            <Sparkles className="w-6 h-6 text-accent-blue" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Uncover
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-md mx-auto leading-relaxed">
            Discover deeper connections through meaningful conversations
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 space-y-3 text-white/80">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-accent-red rounded-full"></div>
            <span className="text-lg">Thought-provoking questions</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
            <span className="text-lg">Real-life scenarios</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-lg">Personal discovery</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="group relative bg-accent-red hover:bg-red-600 text-white font-semibold text-xl py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-accent-red/25"
        >
          <span className="flex items-center gap-3">
            Start Exploring
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </span>
        </button>

        {/* Subtitle */}
        <p className="mt-8 text-white/60 text-sm max-w-xs mx-auto">
          Swipe through cards to spark authentic conversations
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent-red/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-accent-blue/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>
    </div>
  )
}
