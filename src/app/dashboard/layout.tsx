'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!session || !user) {
      router.replace('/auth/login')
    }
  }, [session, user, router])

  if (!session || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
}
