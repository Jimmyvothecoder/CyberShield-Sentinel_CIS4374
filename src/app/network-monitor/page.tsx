'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { NetworkActivity } from '@/components/network-monitor/network-activity'

export default function NetworkMonitorPage() {
  const router = useRouter()
  const [monitoring, setMonitoring] = useState(false)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Network Monitor</h1>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.warning className="h-5 w-5" />
              Network Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Monitoring Status</p>
                  <Badge variant={monitoring ? 'secondary' : 'outline'}>
                    {monitoring ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Button
                  variant={monitoring ? 'destructive' : 'default'}
                  onClick={() => setMonitoring(!monitoring)}
                >
                  {monitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.network className="h-5 w-5" />
              Network Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Bandwidth</Badge>
                  <span className="text-sm text-muted-foreground">1.2 Gbps</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Latency</Badge>
                  <span className="text-sm text-muted-foreground">25ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Packet Loss</Badge>
                  <span className="text-sm text-muted-foreground">0.1%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <NetworkActivity />
      </div>
    </div>
  )
}
