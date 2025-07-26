'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Mail, Chrome, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true)
      setMessage('')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      
      if (error) {
        setMessage(error.message || 'Error signing in with Google')
        console.error('Google auth error:', error)
      } else if (data.url) {
        // The OAuth flow will handle the redirect
        window.location.href = data.url
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setMessage(`Error signing in with Google: ${errorMessage}`)
      console.error('Google auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      setIsLoading(true)
      setMessage('')

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password: 'temp-password-123', // In production, you'd want a proper password field
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) {
          setMessage(error.message)
        } else {
          setMessage('Check your email for the confirmation link!')
        }
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) {
          setMessage(error.message)
        } else {
          setMessage('Check your email for the login link!')
        }
      }
    } catch (error) {
      setMessage('Authentication error occurred')
      console.error('Email auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMaybeLater = () => {
    onClose()
    onSuccess() // Continue without auth
  }

  // Get category color for the modal accent
  const getCategoryColor = () => {
    // Default to a nice blue if category isn't available
    return '#60a5fa';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="relative max-w-sm w-full rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${getCategoryColor()}40`,
          boxShadow: `0 0 40px 5px ${getCategoryColor()}40, 0 25px 50px -12px rgba(0, 0, 0, 0.8)`,
        }}
      >
        {/* Paper texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(/card-paper-texture.jpg)',
            backgroundSize: '50% 50%',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay',
          }}
        />
        
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        
        <div className="relative z-10 p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {isSignUp ? 'Join the Community' : 'Welcome Back'}
            </h2>
            <p className="text-white/60">
              {isSignUp 
                ? 'Create an account to save your favorites and preferences'
                : 'Sign in to continue where you left off'}
            </p>
          </div>

          {/* Message alert */}
          {message && (
            <div 
              className="mb-6 p-3 rounded-xl backdrop-blur-sm"
              style={{
                background: 'rgba(96, 165, 250, 0.1)',
                border: '1px solid rgba(96, 165, 250, 0.3)',
              }}
            >
              <p className="text-sm text-blue-300">{message}</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Email form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-xl ${
                    email ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/30'
                  } transition-colors`}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-sm bg-transparent text-white/40">or continue with</span>
              </div>
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 px-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50"
            >
              <Chrome className="w-5 h-5" />
              <span>Google</span>
            </button>

            {/* Toggle sign in/up */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <span className="text-blue-400 font-medium">
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
