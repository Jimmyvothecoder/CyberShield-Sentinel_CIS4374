import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For demonstration, create a mock scan
    const mockScan = {
      id: crypto.randomUUID(),
      user_id: session.user.id,
      scan_status: 'completed',
      scanned_at: new Date().toISOString(),
      total_emails: 10,
      threats_found: 2
    }

    // Insert the mock scan result
    const { error: scanError } = await supabase
      .from('email_scans')
      .insert(mockScan)

    if (scanError) {
      console.error('Error saving scan:', scanError)
      return NextResponse.json(
        { error: 'Failed to save scan results' },
        { status: 500 }
      )
    }

    // Create mock threats
    const mockThreats = [
      {
        id: crypto.randomUUID(),
        scan_id: mockScan.id,
        email_subject: 'Urgent: Update Your Account Information',
        sender: 'security@fakebank.com',
        received_at: new Date().toISOString(),
        threat_type: 'phishing',
        threat_score: 0.85,
        details: 'Suspicious sender domain and urgent call to action'
      },
      {
        id: crypto.randomUUID(),
        scan_id: mockScan.id,
        email_subject: 'Your Package Delivery',
        sender: 'delivery@shipping-notification.net',
        received_at: new Date().toISOString(),
        threat_type: 'phishing',
        threat_score: 0.75,
        details: 'Suspicious link and attachment detected'
      }
    ]

    // Insert mock threats
    const { error: threatsError } = await supabase
      .from('email_threats')
      .insert(mockThreats)

    if (threatsError) {
      console.error('Error saving threats:', threatsError)
      return NextResponse.json(
        { error: 'Failed to save threat details' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      scan: {
        ...mockScan,
        threats: mockThreats
      }
    })
  } catch (error) {
    console.error('Error in email scan:', error)
    return NextResponse.json(
      { error: 'Failed to complete email scan' },
      { status: 500 }
    )
  }
}
