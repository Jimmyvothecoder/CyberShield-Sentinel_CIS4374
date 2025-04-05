export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      email_scans: {
        Row: {
          id: string
          user_id: string
          scanned_at: string
          total_emails: number
          threats_found: number
        }
        Insert: {
          id?: string
          user_id: string
          scanned_at?: string
          total_emails: number
          threats_found: number
        }
        Update: {
          id?: string
          user_id?: string
          scanned_at?: string
          total_emails?: number
          threats_found?: number
        }
      }
      email_threats: {
        Row: {
          id: string
          scan_id: string
          email_subject: string
          sender: string
          threat_score: number
          details: string
        }
        Insert: {
          id?: string
          scan_id: string
          email_subject: string
          sender: string
          threat_score: number
          details: string
        }
        Update: {
          id?: string
          scan_id?: string
          email_subject?: string
          sender?: string
          threat_score?: number
          details?: string
        }
      }
    }
  }
}
