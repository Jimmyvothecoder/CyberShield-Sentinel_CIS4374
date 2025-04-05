'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { useRouter } from 'next/navigation'

export function DashboardContent() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Security Dashboard</h1>
        <Button variant="outline" onClick={() => router.push('/auth/signout')}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.shield className="h-5 w-5" />
              Email Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Monitor and protect your email communications
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/email-security')}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.upload className="h-5 w-5" />
              Malware Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Scan files and downloads for malware
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/malware-scan')}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.warning className="h-5 w-5" />
              Network Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Monitor network traffic and detect threats
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/network-monitor')}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add recent activity items here */}
              <p className="text-sm text-gray-500">
                No recent activity to display
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Security</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Malware Scanner</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Network Monitor</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
