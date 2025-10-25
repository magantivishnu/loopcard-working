// C:\Users\magan\files\middleware.ts (The Corrected Code)
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Initialize a mutable response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Set up the Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        // IMPORTANT: The set/remove methods now update the response object
        // *and* the headers on the next request, which is required for
        // the session to be available immediately after the redirect.
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. Refresh the session (must run before any redirects)
  // This updates the session cookies if they are due for refresh.
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 4. Handle protected routes (e.g., /dashboard)
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      // User is trying to access a protected route without a session
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // 5. Handle auth routes (e.g., /auth/signin, /auth/signup)
  if (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup')) {
    if (user) {
      // User is already logged in, redirect them to the dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 6. Allow the request to proceed (with updated cookies in the response)
  return response
}

export const config = {
  // Match all protected routes and auth pages, excluding static files/api routes.
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}