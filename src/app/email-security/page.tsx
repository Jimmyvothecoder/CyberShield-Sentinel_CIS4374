import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import RecentScans from '@/components/email-security/recent-scans'
import { ScanButton } from '@/components/email-security/scan-button'
import { Icons } from '@/components/ui/icons'
import { EmailConnectionForm } from '@/components/email-security/email-connection-form'

export const metadata = {
  title: 'Email Security - CyberShield Sentinel',
  description: 'Monitor and protect your email communications from phishing threats',
}

export default function EmailSecurityPage() {

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Email Security</h1>
      
      <div className="grid gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Connect Your Email Account</h2>
          <EmailConnectionForm />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Scans</h2>
          <RecentScans />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Scan Your Inbox</h2>
          <ScanButton />
        </div>
      </div>
    </div>
  )
}
