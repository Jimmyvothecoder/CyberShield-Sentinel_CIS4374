import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { EmailThreadViewer } from '@/components/email-security/email-thread-viewer'
import { Database } from '@/types/supabase'

interface Props {
  params: {
    id: string
  }
}

export default async function EmailScanPage({ params }: Props) {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Verify user has access to this scan
  const { data: scan } = await supabase
    .from('email_scans')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!scan) {
    redirect('/email-security')
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <EmailThreadViewer />
      </div>
    </div>
  )
}
