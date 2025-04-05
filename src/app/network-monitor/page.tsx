'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'

interface NetworkActivity {
  id: string
  timestamp: string
  type: 'inbound' | 'outbound'
  protocol: string
  source: string
  destination: string
  status: 'normal' | 'suspicious' | 'blocked'
}

const mockActivities: NetworkActivity[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    type: 'inbound',
    protocol: 'TCP',
    source: '192.168.1.100',
    destination: '10.0.0.5',
    status: 'normal',
  },
  {
    id: '2',
    timestamp: new Date().toISOString(),
    type: 'outbound',
    protocol: 'UDP',
    source: '10.0.0.5',
    destination: '8.8.8.8',
    status: 'normal',
  },
  {
    id: '3',
    timestamp: new Date().toISOString(),
    type: 'inbound',
    protocol: 'TCP',
    source: '203.0.113.0',
    destination: '10.0.0.5',
    status: 'suspicious',
  },
]

export default function NetworkMonitorPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<NetworkActivity[]>([])
  const [monitoring, setMonitoring] = useState(false)

  useEffect(() => {
    if (monitoring) {
      setActivities(mockActivities)
    } else {
      setActivities([])
    }
  }, [monitoring])

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
            <CardTitle>Network Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {activity.type === 'inbound' ? 'Inbound' : 'Outbound'}{' '}
                        {activity.protocol}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.source} → {activity.destination}
                      </p>
                    </div>
                    <Badge
                      variant={
                        activity.status === 'suspicious'
                          ? 'destructive'
                          : activity.status === 'blocked'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {monitoring
                  ? 'No network activity detected'
                  : 'Start monitoring to see network activity'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
