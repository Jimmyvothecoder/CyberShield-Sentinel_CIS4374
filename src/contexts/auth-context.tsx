'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Session, User } from '@supabase/supabase-js'

const supabase = createClientComponentClient()

import type { Provider } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithProvider: (provider: Provider) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAuthStateChange = async (event: string, newSession: Session | null) => {
    console.log('Auth state changed:', { event, newSession })
    setSession(newSession)
    setUser(newSession?.user ?? null)

    if (event === 'SIGNED_IN' && newSession) {
      router.push('/dashboard')
    } else if (event === 'SIGNED_OUT') {
      router.push('/auth/login')
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
      } catch (error) {
        console.error('Error checking user session:', error)
        setError(error instanceof Error ? error.message : 'Failed to check session')
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange)

    return () => {
      subscription.unsubscribe()
    }
  }, [router])



  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address')
        throw new Error('Please enter a valid email address')
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })

      if (signUpError) {
        setError(signUpError.message)
        throw signUpError
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }



  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setError(error.message)
        throw error
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const signInWithProvider = async (provider: Provider): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) {
        setError(error.message)
        throw error
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      return { data: { user: null, session: null }, error }
    } catch (error) {
      console.error('Password reset error:', error)
      return { data: null, error: error instanceof Error ? error : new Error('An error occurred') }
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithProvider
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
