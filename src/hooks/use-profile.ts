'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['user_profiles']['Row']

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        setProfile(data)
      } catch (e) {
        console.error('Error fetching profile:', e)
        setError(e instanceof Error ? e : new Error('Failed to fetch profile'))
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in')

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      return data
    } catch (e) {
      console.error('Error updating profile:', e)
      throw e instanceof Error ? e : new Error('Failed to update profile')
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
  }
}
