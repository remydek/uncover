'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/')
          return
        }

        if (data.session) {
          // User is authenticated, redirect to main app
          router.push('/categories')
        } else {
          // No session, redirect to home
          router.push('/')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  )
}
