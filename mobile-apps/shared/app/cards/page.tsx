'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import CardInterface from '@/components/CardInterface'

function CardsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = searchParams.get('category')
  const type = searchParams.get('type')

  if (!category || !type) {
    router.push('/')
    return null
  }

  return <CardInterface category={category} contentType={type} />
}

export default function CardsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>}>
      <CardsContent />
    </Suspense>
  )
}
