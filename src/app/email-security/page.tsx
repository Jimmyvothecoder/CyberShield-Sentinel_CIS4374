import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RecentScans } from '@/components/email-security/recent-scans'
import { ScanButton } from '@/components/email-security/scan-button'
import { Icons } from '@/components/ui/icons'
import { Database } from '@/types/supabase'

export const metadata = {
  title: 'Email Security - CyberShield Sentinel',
  description: 'Monitor and protect your email communications from phishing threats',
}

export default async function EmailSecurityPage() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get active email connections
  const { data: connections } = await supabase
    .from('email_connections')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email Security</h1>
        <ScanButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-medium mb-2">Connected Email Accounts</h2>
            {connections?.map(connection => (
              <div
                key={connection.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-2">
                  {connection.provider === 'google' ? (
                    <Icons.google className="h-4 w-4" />
                  ) : (
                    <Icons.microsoft className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {connection.provider === 'google' ? 'Gmail' : 'Outlook'}
                  </span>
                </div>
                <Badge variant="outline">
                  Connected
                </Badge>
              </div>
            ))}
            {!connections?.length && (
              <div className="text-sm text-gray-500">
                No email accounts connected. Visit the onboarding page to connect your accounts.
              </div>
            )}
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="text-lg font-medium mb-2">Last Scan</h2>
            {connections?.length ? (
              <div className="text-sm text-gray-500">
                Last scan performed: {connections[0].last_scan_at ? 
                  new Date(connections[0].last_scan_at).toLocaleString() :
                  'Never'
                }
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                No scans performed yet
              </div>
            )}
          </div>
        </div>

        <RecentScans />
      </div>
    </div>
  )
}
