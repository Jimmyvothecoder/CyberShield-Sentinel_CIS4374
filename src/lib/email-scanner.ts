import { google } from 'googleapis'
import { Client } from '@microsoft/microsoft-graph-client'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

interface EmailData {
  messageId: string
  subject: string
  sender: string
  receivedAt: Date
  content: string
  headers: Record<string, string>
}

interface ScanResult {
  isPhishing: boolean
  threatScore: number
  threatIndicators: {
    type: string
    description: string
    score: number
  }[]
}

export class EmailScanner {
  private supabase = createRouteHandlerClient<Database>({ cookies })

  async scanGmailEmails(userId: string, connectionId: string, accessToken: string): Promise<void> {
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })
    const gmail = google.gmail({ version: 'v1', auth })

    try {
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10,
        q: 'newer_than:1d'
      })

      if (!response.data.messages) return

      for (const message of response.data.messages) {
        const emailData = await this.fetchGmailMessage(gmail, message.id!)
        await this.scanAndStoreEmail(userId, connectionId, emailData)
      }

      // Update last scan time
      await this.supabase
        .from('email_connections')
        .update({ last_scan_at: new Date().toISOString() })
        .eq('id', connectionId)
    } catch (error) {
      console.error('Gmail scan error:', error)
      throw error
    }
  }

  async scanOutlookEmails(userId: string, connectionId: string, accessToken: string): Promise<void> {
    const client = Client.init({
      authProvider: (done) => done(null, accessToken)
    })

    try {
      const response = await client
        .api('/me/messages')
        .select('id,subject,from,receivedDateTime,body,internetMessageHeaders')
        .top(10)
        .filter("receivedDateTime gt dateadd(day, -1, now())")
        .get()

      for (const message of response.value) {
        const emailData: EmailData = {
          messageId: message.id,
          subject: message.subject,
          sender: message.from.emailAddress.address,
          receivedAt: new Date(message.receivedDateTime),
          content: message.body.content,
          headers: this.parseOutlookHeaders(message.internetMessageHeaders)
        }
        await this.scanAndStoreEmail(userId, connectionId, emailData)
      }

      // Update last scan time
      await this.supabase
        .from('email_connections')
        .update({ last_scan_at: new Date().toISOString() })
        .eq('id', connectionId)
    } catch (error) {
      console.error('Outlook scan error:', error)
      throw error
    }
  }

  private async fetchGmailMessage(gmail: any, messageId: string): Promise<EmailData> {
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full'
    })

    const message = response.data
    const headers = message.payload.headers.reduce((acc: Record<string, string>, header: any) => {
      acc[header.name.toLowerCase()] = header.value
      return acc
    }, {})

    return {
      messageId: message.id,
      subject: headers['subject'] || '',
      sender: headers['from'] || '',
      receivedAt: new Date(parseInt(message.internalDate)),
      content: this.extractGmailContent(message),
      headers
    }
  }

  private extractGmailContent(message: any): string {
    let content = ''
    const extractParts = (parts: any[]) => {
      for (const part of parts) {
        if (part.mimeType === 'text/plain' && part.body.data) {
          content += Buffer.from(part.body.data, 'base64').toString()
        }
        if (part.parts) {
          extractParts(part.parts)
        }
      }
    }

    if (message.payload.parts) {
      extractParts(message.payload.parts)
    } else if (message.payload.body.data) {
      content = Buffer.from(message.payload.body.data, 'base64').toString()
    }

    return content
  }

  private parseOutlookHeaders(headers: any[]): Record<string, string> {
    return headers.reduce((acc: Record<string, string>, header: any) => {
      acc[header.name.toLowerCase()] = header.value
      return acc
    }, {})
  }

  private async scanAndStoreEmail(
    userId: string,
    connectionId: string,
    emailData: EmailData
  ): Promise<void> {
    // Create initial scan record
    const { data: scanRecord, error: insertError } = await this.supabase
      .from('email_scans')
      .insert({
        user_id: userId,
        connection_id: connectionId,
        message_id: emailData.messageId,
        subject: emailData.subject,
        sender: emailData.sender,
        received_at: emailData.receivedAt.toISOString(),
        scan_status: 'scanning'
      })
      .select()
      .single()

    if (insertError || !scanRecord) {
      console.error('Error creating scan record:', insertError)
      return
    }

    try {
      // Perform phishing detection
      const scanResult = await this.detectPhishing(emailData)

      // Update scan record with results
      await this.supabase
        .from('email_scans')
        .update({
          scan_status: 'completed',
          is_phishing: scanResult.isPhishing,
          threat_score: scanResult.threatScore,
          threat_indicators: scanResult.threatIndicators,
          scan_completed_at: new Date().toISOString()
        })
        .eq('id', scanRecord.id)

      // If high threat score, create real-time notification
      if (scanResult.threatScore >= 0.7) {
        await this.createThreatNotification(userId, scanRecord.id, emailData, scanResult)
      }
    } catch (error) {
      console.error('Scan error:', error)
      await this.supabase
        .from('email_scans')
        .update({
          scan_status: 'failed',
          scan_completed_at: new Date().toISOString()
        })
        .eq('id', scanRecord.id)
    }
  }

  private async detectPhishing(emailData: EmailData): Promise<ScanResult> {
    const threatIndicators = []
    let totalScore = 0

    // Check sender domain mismatch
    const senderDomain = emailData.sender.split('@')[1]
    const replyToDomain = emailData.headers['reply-to']?.split('@')[1]
    if (replyToDomain && senderDomain !== replyToDomain) {
      threatIndicators.push({
        type: 'sender_mismatch',
        description: 'Reply-To domain does not match sender domain',
        score: 0.8
      })
      totalScore += 0.8
    }

    // Check for suspicious links
    const suspiciousLinkPatterns = [
      /tiny\.cc/i,
      /bit\.ly/i,
      /goo\.gl/i,
      /\.(ru|cn|tk|xyz|top)\//i
    ]
    const hasPhishingLinks = suspiciousLinkPatterns.some(pattern => 
      pattern.test(emailData.content)
    )
    if (hasPhishingLinks) {
      threatIndicators.push({
        type: 'suspicious_links',
        description: 'Email contains suspicious shortened or uncommon domain links',
        score: 0.6
      })
      totalScore += 0.6
    }

    // Check for urgent language
    const urgentPhrases = [
      /urgent/i,
      /immediate action/i,
      /account.*suspend/i,
      /verify.*account/i,
      /security.*breach/i
    ]
    const hasUrgentLanguage = urgentPhrases.some(phrase => 
      phrase.test(emailData.subject) || phrase.test(emailData.content)
    )
    if (hasUrgentLanguage) {
      threatIndicators.push({
        type: 'urgent_language',
        description: 'Email uses urgent or threatening language',
        score: 0.4
      })
      totalScore += 0.4
    }

    // Normalize total score
    const normalizedScore = Math.min(totalScore / threatIndicators.length, 1)

    return {
      isPhishing: normalizedScore >= 0.5,
      threatScore: normalizedScore,
      threatIndicators
    }
  }

  private async createThreatNotification(
    userId: string,
    scanId: string,
    emailData: EmailData,
    scanResult: ScanResult
  ): Promise<void> {
    await this.supabase.from('notifications').insert({
      user_id: userId,
      type: 'phishing_threat',
      title: 'Potential Phishing Email Detected',
      description: `Suspicious email from ${emailData.sender} with threat score ${Math.round(scanResult.threatScore * 100)}%`,
      metadata: {
        scan_id: scanId,
        email_subject: emailData.subject,
        threat_score: scanResult.threatScore,
        threat_indicators: scanResult.threatIndicators
      },
      status: 'unread'
    })
  }
}
