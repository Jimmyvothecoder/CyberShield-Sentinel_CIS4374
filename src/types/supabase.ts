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
      scan_results: {
        Row: {
          id: string
          created_at: string
          user_id: string
          file_name: string
          file_type: string
          file_size: number
          scan_status: 'pending' | 'scanning' | 'completed' | 'failed'
          threats_found: string[]
          scan_time: number
          is_clean: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          file_name: string
          file_type: string
          file_size: number
          scan_status?: 'pending' | 'scanning' | 'completed' | 'failed'
          threats_found?: string[]
          scan_time?: number
          is_clean?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          file_name?: string
          file_type?: string
          file_size?: number
          scan_status?: 'pending' | 'scanning' | 'completed' | 'failed'
          threats_found?: string[]
          scan_time?: number
          is_clean?: boolean
        }
      }
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          full_name: string | null
          company_name: string | null
          phone_number: string | null
          notification_preferences: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          full_name?: string | null
          company_name?: string | null
          phone_number?: string | null
          notification_preferences?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          full_name?: string | null
          company_name?: string | null
          phone_number?: string | null
          notification_preferences?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
