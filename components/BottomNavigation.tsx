'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Grid3X3, Heart, Settings, User, LogIn } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AuthModal from './AuthModal'

export default function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    checkUser()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  const handleAuthClick = () => {
    if (user) {
      // User is logged in, show profile or logout option
      handleLogout()
    } else {
      // User is not logged in, show auth modal
      setShowAuthModal(true)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const navItems = [
    {
      id: 'categories',
      icon: Grid3X3,
      label: 'Categories',
      path: '/categories',
      isActive: pathname === '/categories' || pathname.startsWith('/content-type') || pathname.startsWith('/cards')
    },
    {
      id: 'favorites',
      icon: Heart,
      label: 'Favorites',
      path: '/favorites',
      isActive: pathname === '/favorites'
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      path: '/settings',
      isActive: pathname === '/settings'
    },
    {
      id: 'auth',
      icon: user ? User : LogIn,
      label: user ? 'Profile' : 'Login',
      path: null, // Handle click differently
      isActive: false
    }
  ]

  const handleNavigation = (path: string | null, itemId: string) => {
    if (itemId === 'auth') {
      handleAuthClick()
    } else if (path) {
      router.push(path)
    }
  }

  // Don't show on welcome page
  if (pathname === '/') {
    return null
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-gray-700 z-40">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path, item.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  item.isActive
                    ? 'text-accent-red'
                    : item.id === 'auth' && user
                    ? 'text-accent-blue'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {item.id === 'auth' && user ? (
                  <div className="w-6 h-6 mb-1 bg-accent-blue rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <Icon className="w-6 h-6 mb-1" />
                )}
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false)
          checkUser()
        }}
      />
    </>
  )
}
