"use client"

import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from '@/components/ui/toaster'
import { ChatBot } from '@/components/ai-assistant/chat-bot'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <ChatBot />
      <Toaster />
    </AuthProvider>
  )
}
