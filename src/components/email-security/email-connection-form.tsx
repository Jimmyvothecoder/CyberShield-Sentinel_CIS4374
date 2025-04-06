"use client"

import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

interface EmailProvider {
  id: string
  name: string
  icon: React.ReactNode
  color: string
}

const providers: EmailProvider[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: <Icons.gmail className="h-6 w-6" />,
    color: 'bg-red-500'
  },
  {
    id: 'outlook',
    name: 'Outlook',
    icon: <Icons.outlook className="h-6 w-6" />,
    color: 'bg-blue-600'
  },
  {
    id: 'yahoo',
    name: 'Yahoo',
    icon: <Icons.yahoo className="h-6 w-6" />,
    color: 'bg-purple-600'
  }
]

export function EmailConnectionForm() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate connection process
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: 'Connection Saved',
        description: `Successfully saved ${selectedProvider?.toUpperCase()} connection`,
        variant: 'default'
      })
      
      // Reset form
      setSelectedProvider(null)
      setEmail('')
      setPassword('')
    }, 1500)
  }

  const handleProviderClick = (providerId: string) => {
    setSelectedProvider(providerId)
    setEmail('')
    setPassword('')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Connect Your Email Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {providers.map((provider) => (
            <Button
              key={provider.id}
              variant="outline"
              className={cn(
                "flex items-center justify-between space-x-2",
                selectedProvider === provider.id && "bg-muted"
              )}
              onClick={() => handleProviderClick(provider.id)}
            >
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "rounded-full p-1.5",
                  provider.color
                )}>
                  {provider.icon}
                </span>
                <span>{provider.name}</span>
              </div>
              {selectedProvider === provider.id && (
                <Icons.check className="h-4 w-4" />
              )}
            </Button>
          ))}
        </div>

        {selectedProvider && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Account'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
