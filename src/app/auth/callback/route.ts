import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth error:', error.message)
      return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
    }

    // Get user's email provider data
    const provider = session?.user?.app_metadata?.provider
    const accessToken = session?.provider_token

    if (accessToken && (provider === 'google' || provider === 'azure')) {
      // Store email provider connection in database
      const { error: updateError } = await supabase
        .from('email_connections')
        .upsert({
          user_id: session.user.id,
          provider: provider,
          access_token: accessToken,
          connected_at: new Date().toISOString(),
          is_active: true
        })

      if (updateError) {
        console.error('Database error:', updateError.message)
      }
    }
  }

  // Redirect to onboarding for new users, dashboard for existing ones
  const supabase = createRouteHandlerClient({ cookies })
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .single()

  const redirectUrl = profile?.onboarding_completed
    ? '/dashboard'
    : '/onboarding'

  return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin))
}
