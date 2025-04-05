'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Database } from '@/lib/database.types'

interface ScanResult {
  id: string
  scanned_at: string
  total_emails: number
  threats_found: number
  threats: Array<{
    id: string
    email_subject: string
    sender: string
    threat_score: number
    details: string
  }>
}

export default function RecentScans() {
  const [isLoading, setIsLoading] = useState(true)
  const [scans, setScans] = useState<ScanResult[]>([])
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const { data: scanData, error } = await supabase
          .from('email_scans')
          .select('*')
          .order('scanned_at', { ascending: false })
          .limit(5)

        if (error) throw error

        setScans(scanData as ScanResult[])
      } catch (error) {
        console.error('Error fetching scans:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchScans()
  }, [])

  const handleScanClick = (scan: ScanResult) => {
    router.push(`/dashboard/scans/${scan.id}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recent Scans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader className="h-5 w-5 animate-spin" />
              </div>
            ) : scans.length > 0 ? (
              scans.map((scan) => (
                <Card key={scan.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          Scan Results
                        </CardTitle>
                        <CardDescription>
                          {new Date(scan.scanned_at).toLocaleString()}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={scan.threats_found > 0 ? 'destructive' : 'secondary'}
                      >
                        {scan.threats_found > 0
                          ? `${scan.threats_found} Threats Found`
                          : 'No Threats'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Emails Scanned:</span>
                        <span className="font-medium">{scan.total_emails}</span>
                      </div>
                      {scan.threats && scan.threats.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h4 className="text-sm font-medium">Detected Threats:</h4>
                          {scan.threats.map((threat) => (
                            <div
                              key={threat.id}
                              className="border rounded-lg p-3 space-y-2"
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">
                                    {threat.email_subject}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    From: {threat.sender}
                                  </p>
                                </div>
                                <Badge variant="outline">
                                  Score: {(threat.threat_score * 100).toFixed(0)}%
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {threat.details}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => handleScanClick(scan)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent scans</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
