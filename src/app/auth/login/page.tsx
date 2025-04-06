"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Authenticate with Supabase
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (error) throw error
      
      // Redirect to dashboard after successful authentication
      router.push('/dashboard')
      router.refresh() // Refresh to update auth state
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <p className="text-center mb-6 text-gray-600 dark:text-gray-400">Welcome to CyberShield Sentinel</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-center rounded transition-colors"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-blue-600 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  )
}
