import type { Metadata } from 'next'
import { Inter, Amiri } from 'next/font/google'
import './globals.css'
import BottomNavigation from '@/components/BottomNavigation'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const amiri = Amiri({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-amiri' })

export const metadata: Metadata = {
  title: 'Uncover - Deep Conversations',
  description: 'Discover meaningful connections through thought-provoking questions and scenarios',
  manifest: '/manifest.json',
  themeColor: '#1a1a1a',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${amiri.variable} font-sans bg-dark-bg text-text-primary`}>
        <div className="min-h-screen bg-gradient-dark">
          {children}
          <BottomNavigation />
        </div>
      </body>
    </html>
  )
}
