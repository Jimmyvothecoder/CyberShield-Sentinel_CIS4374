"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface NetworkActivity {
  id: string
  timestamp: string
  type: 'inbound' | 'outbound' | 'internal'
  protocol: 'TCP' | 'UDP' | 'ICMP'
  source: string
  destination: string
  port: number
  size: number
  status: 'normal' | 'suspicious' | 'blocked'
  details: string
}

const mockNetworkActivity: NetworkActivity[] = [
  {
    id: '1',
    timestamp: '2025-04-06T18:21:05',
    type: 'inbound',
    protocol: 'TCP',
    source: '192.168.1.102',
    destination: '192.168.1.1',
    port: 8080,
    size: 1245,
    status: 'normal',
    details: 'Regular HTTP request from local device'
  },
  {
    id: '2',
    timestamp: '2025-04-06T18:20:55',
    type: 'outbound',
    protocol: 'UDP',
    source: '192.168.1.1',
    destination: '8.8.8.8',
    port: 53,
    size: 64,
    status: 'normal',
    details: 'DNS query to Google DNS'
  },
  {
    id: '3',
    timestamp: '2025-04-06T18:20:45',
    type: 'internal',
    protocol: 'TCP',
    source: '192.168.1.101',
    destination: '192.168.1.102',
    port: 22,
    size: 1456,
    status: 'normal',
    details: 'SSH connection between local devices'
  },
  {
    id: '4',
    timestamp: '2025-04-06T18:20:35',
    type: 'inbound',
    protocol: 'TCP',
    source: '104.244.42.1',
    destination: '192.168.1.1',
    port: 443,
    size: 2567,
    status: 'suspicious',
    details: 'Multiple failed HTTPS connection attempts'
  },
  {
    id: '5',
    timestamp: '2025-04-06T18:20:25',
    type: 'outbound',
    protocol: 'ICMP',
    source: '192.168.1.1',
    destination: '8.8.4.4',
    port: 0,
    size: 64,
    status: 'normal',
    details: 'ICMP echo request to secondary DNS'
  },
  {
    id: '6',
    timestamp: '2025-04-06T18:20:15',
    type: 'inbound',
    protocol: 'UDP',
    source: '192.168.1.103',
    destination: '192.168.1.1',
    port: 1900,
    size: 128,
    status: 'normal',
    details: 'UPnP discovery broadcast'
  }
]

export function NetworkActivity() {
  const [activity, setActivity] = useState(mockNetworkActivity)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate network activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true)
      setTimeout(() => {
        const protocols = ['TCP', 'UDP', 'ICMP'] as const
        const statuses = ['normal', 'suspicious', 'blocked'] as const
        const newActivity: NetworkActivity = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          type: Math.random() > 0.5 ? 'inbound' : 'outbound',
          protocol: protocols[Math.floor(Math.random() * protocols.length)],
          source: `192.168.1.${Math.floor(Math.random() * 100) + 1}`,
          destination: `192.168.1.${Math.floor(Math.random() * 100) + 1}`,
          port: Math.floor(Math.random() * 65535),
          size: Math.floor(Math.random() * 10000),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          details: 'Simulated network activity'
        }
        setActivity(prev => [newActivity, ...prev])
        setIsLoading(false)
      }, 1000)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icons.network className="h-5 w-5" />
            Network Activity
          </CardTitle>
          <Badge variant="outline">
            Real-time Monitoring
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Inbound</Badge>
            <span className="text-sm text-muted-foreground">1245 packets</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Outbound</Badge>
            <span className="text-sm text-muted-foreground">873 packets</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">Blocked</Badge>
            <span className="text-sm text-muted-foreground">12 packets</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Time</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Protocol</th>
                <th className="text-left py-2">Source</th>
                <th className="text-left py-2">Destination</th>
                <th className="text-left py-2">Port</th>
                <th className="text-left py-2">Size</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr className="animate-pulse">
                  <td className="py-2">-</td>
                  <td className="py-2">-</td>
                  <td className="py-2">-</td>
                  <td className="py-2">-</td>
                  <td className="py-2">-</td>
                  <td className="py-2">-</td>
                  <td className="py-2">-</td>
                  <td className="py-2">-</td>
                </tr>
              )}
              {activity.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50">
                  <td className="py-2 text-sm">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 text-sm">
                    <Badge variant={item.type === 'inbound' ? 'secondary' : item.type === 'outbound' ? 'outline' : 'default'}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-2 text-sm">{item.protocol}</td>
                  <td className="py-2 text-sm">{item.source}</td>
                  <td className="py-2 text-sm">{item.destination}</td>
                  <td className="py-2 text-sm">{item.port}</td>
                  <td className="py-2 text-sm">{item.size} bytes</td>
                  <td className="py-2 text-sm">
                    <Badge variant={item.status === 'normal' ? 'secondary' : item.status === 'suspicious' ? 'destructive' : 'default'}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Latest Suspicious Activity</h3>
          <div className="space-y-2">
            {activity
              .filter(item => item.status === 'suspicious')
              .slice(0, 3)
              .map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                  <Icons.alert className="h-4 w-4 text-destructive" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.details}</p>
                    <p className="text-xs text-muted-foreground">
                      Detected at {new Date(item.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    Suspicious
                  </Badge>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
