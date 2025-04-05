import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const { data: { session } } = await supabase.auth.getSession()
    const pathname = req.nextUrl.pathname
    const isAuthPage = pathname.startsWith('/auth/')

    console.log('Middleware check:', {
      pathname,
      isAuthPage,
      hasSession: !!session
    })

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthPage && session) {
      console.log('Redirecting authenticated user from auth page to dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // If user is not authenticated and trying to access protected pages
    if (!isAuthPage && !session) {
      console.log('Redirecting unauthenticated user to login')
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    console.log('Allowing access to:', pathname)
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to login for safety
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
