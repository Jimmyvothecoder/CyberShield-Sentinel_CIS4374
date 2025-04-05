import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/icons'

type OnboardingStep = 'email' | 'malware' | 'network'

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('email')
  const [progress, setProgress] = useState(33)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/gmail.readonly',
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMicrosoftSignIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'Mail.Read',
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    switch (currentStep) {
      case 'email':
        setCurrentStep('malware')
        setProgress(66)
        break
      case 'malware':
        setCurrentStep('network')
        setProgress(100)
        break
      case 'network':
        router.push('/dashboard')
        break
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Setup</CardTitle>
        <CardDescription>
          Let&apos;s secure your digital assets step by step
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        {currentStep === 'email' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Connect Your Email</h3>
            <p className="text-sm text-gray-500">
              Connect your email account to enable phishing protection and email security monitoring.
            </p>
            <div className="grid gap-4">
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.google className="mr-2 h-4 w-4" />
                )}
                Connect Gmail Account
              </Button>
              <Button
                variant="outline"
                onClick={handleMicrosoftSignIn}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.microsoft className="mr-2 h-4 w-4" />
                )}
                Connect Outlook Account
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'malware' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Install Malware Protection</h3>
            <p className="text-sm text-gray-500">
              Download and install our desktop agent for real-time malware protection.
            </p>
            <Button variant="outline" className="w-full">
              <Icons.download className="mr-2 h-4 w-4" />
              Download Desktop Agent
            </Button>
          </div>
        )}

        {currentStep === 'network' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configure Network Monitoring</h3>
            <p className="text-sm text-gray-500">
              Set up network monitoring to detect and prevent potential threats.
            </p>
            <Button variant="outline" className="w-full">
              <Icons.shield className="mr-2 h-4 w-4" />
              Start Network Scan
            </Button>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button onClick={handleNext}>
            {currentStep === 'network' ? 'Finish Setup' : 'Next Step'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
