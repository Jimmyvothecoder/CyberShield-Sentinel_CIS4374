'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [fullName, setFullName] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      if (error) {
        throw error
      }

      // If signup is successful but email is not confirmed
      if (data?.user) {
        setSuccess(
          `Account created successfully! You can now log in.`
        )
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)  // Give user time to read the message
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your CyberShield Sentinel account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 bg-green-50 border border-green-200 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <a href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
