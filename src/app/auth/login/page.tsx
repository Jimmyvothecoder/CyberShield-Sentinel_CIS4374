'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [mounted, setMounted] = React.useState(false)
  const auth = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }

    try {
      console.log('Attempting to sign in with:', { email })
      await auth.signIn(email, password)
      // Redirect will be handled by the auth context
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await auth.signInWithProvider('google')
    } catch (error) {
      console.error('Google sign in error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred during Google sign in')
    }
  }

  const handleMicrosoftSignIn = async () => {
    try {
      await auth.signInWithProvider('azure')
    } catch (error) {
      console.error('Microsoft sign in error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred during Microsoft sign in')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Welcome back to CyberShield Sentinel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
