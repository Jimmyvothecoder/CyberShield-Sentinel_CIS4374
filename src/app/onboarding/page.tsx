import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { OnboardingForm } from '@/components/onboarding/onboarding-form'
import { Database } from '@/types/supabase'

export const metadata = {
  title: 'Onboarding - CyberShield Sentinel',
  description: 'Complete your setup to start protecting your digital assets',
}

export default async function OnboardingPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <OnboardingForm />
      </div>
    </div>
  )
}
