import { useState } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { Database } from '@/types/supabase'

interface EmailScan {
  id: string
  subject: string
  sender: string
  received_at: string
  is_phishing: boolean
  threat_score: number
  threat_indicators: {
    type: string
    description: string
    score: number
  }[]
}

export function EmailThreadViewer() {
  const [scan, setScan] = useState<EmailScan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const supabase = createClientComponentClient<Database>()

  // Fetch email scan details when component mounts
  useState(() => {
    const fetchScan = async () => {
      if (!params.id) return

      try {
        const { data, error } = await supabase
          .from('email_scans')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        setScan(data)
      } catch (error) {
        console.error('Error fetching scan:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchScan()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!scan) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load email scan details.</AlertDescription>
      </Alert>
    )
  }

  const threatLevel = scan.threat_score >= 0.7 ? 'high' :
    scan.threat_score >= 0.4 ? 'medium' : 'low'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{scan.subject}</CardTitle>
          <Badge
            variant={threatLevel === 'high' ? 'destructive' : 
              threatLevel === 'medium' ? 'warning' : 'secondary'}
          >
            {threatLevel.toUpperCase()} RISK
          </Badge>
        </div>
        <div className="text-sm text-gray-500">
          From: {scan.sender}
          <br />
          Received: {new Date(scan.received_at).toLocaleString()}
        </div>
      </CardHeader>
      <CardContent>
        {scan.is_phishing && (
          <Alert className="mb-4">
            <Icons.alert className="h-4 w-4" />
            <AlertTitle>Phishing Warning</AlertTitle>
            <AlertDescription>
              This email has been identified as a potential phishing attempt.
              Threat score: {Math.round(scan.threat_score * 100)}%
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <h3 className="font-medium">Threat Indicators</h3>
          <div className="space-y-2">
            {scan.threat_indicators.map((indicator, index) => (
              <div
                key={index}
                className="rounded-lg border p-4 text-sm"
              >
                <div className="font-medium">{indicator.type}</div>
                <div className="text-gray-500">{indicator.description}</div>
                <div className="mt-2">
                  <Badge variant="outline">
                    Score: {Math.round(indicator.score * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
