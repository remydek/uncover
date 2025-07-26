'use client'

import { useState } from 'react'
import { X, Mail, Chrome } from 'lucide-react'
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        setMessage('Error signing in with Google')
        console.error('Google auth error:', error)
      }
    } catch (error) {
      setMessage('Error signing in with Google')
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-card-bg rounded-2xl p-8 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Continue Exploring
          </h2>
          <p className="text-text-secondary">
            Sign in to save your favorites and continue discovering more content
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-accent-blue/20 border border-accent-blue/30 rounded-lg">
            <p className="text-sm text-accent-blue">{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full bg-white text-black py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card-bg text-text-secondary">or</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-bg text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-accent-blue focus:outline-none"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-accent-blue text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Mail className="w-5 h-5" />
              {isSignUp ? 'Sign Up with Email' : 'Sign In with Email'}
            </button>
          </form>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-text-secondary hover:text-white transition-colors text-sm"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </button>

          <button 
            onClick={handleMaybeLater}
            className="w-full text-text-secondary hover:text-white transition-colors py-2 text-sm"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
