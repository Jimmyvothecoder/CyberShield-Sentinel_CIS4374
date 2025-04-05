import { User, Session, Provider } from '@supabase/supabase-js'

export type AuthUser = User

export type AuthResponse = {
  data: {
    user: AuthUser | null
    session: Session | null
  } | null
  error: Error | null
}

export type AuthContextType = {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResponse>
  signOut: () => Promise<void>
  signInWithProvider: (provider: Provider) => Promise<AuthResponse>
  signInWithGoogle: () => Promise<AuthResponse>
  signInWithMicrosoft: () => Promise<AuthResponse>
  resetPassword: (email: string) => Promise<AuthResponse>
  testConnection: () => Promise<{ success: boolean; error: Error | null }>
  updateProfile: (data: { full_name?: string; email?: string }) => Promise<any>
  getProfile: () => Promise<any>
}
