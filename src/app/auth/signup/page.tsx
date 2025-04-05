'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [fullName, setFullName] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [profile, setProfile] = React.useState<any>(null)
  const auth = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    if (!email || !password) {
      setError('Email and password are required')
      setLoading(false)
      return
    }

    try {
      const { error, data } = await auth.signUp(email, password, fullName)
      
      if (error) {
        setError(error.message)
        return
      }

      // If signup is successful but email is not confirmed
      if (data?.user) {
        setSuccess(
          `Check your email (${email}) for a confirmation link. You'll need to confirm your email before logging in.`
        )
        
        // Redirect to login after a delay
        setTimeout(() => {
          window.location.href = '/auth/login'
        }, 5000)  // Give user time to read the message
      }
    } catch (error) {
      setError('An unexpected error occurred during signup')
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
            <Alert variant="success" className="mt-4">
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
