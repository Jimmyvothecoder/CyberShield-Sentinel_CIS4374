import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import { Database } from '@/types/supabase'

export const metadata = {
  title: 'Dashboard - CyberShield Sentinel',
  description: 'Monitor and manage your cybersecurity with CyberShield Sentinel',
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto p-6">
      <DashboardContent />
    </div>
  )
}
