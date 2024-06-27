import authConfig, { SESSION_STRATEGY } from '@/lib/auth/config'
import { AUTHJS_COOKIE_NAME, SECURE_AUTHJS_COOKIE_NAME, findAuthJsCookie, getAuthJsToken } from '@/lib/auth/edge'
import { isWithinExpirationDate } from '@/utils/isWithinExperationDate'
import type { JWT } from '@auth/core/jwt'
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { NextResponse, type NextRequest } from 'next/server'
import { match } from 'path-to-regexp'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
const protectedRoutes = ['/profile(.*)']

const parseAuthCookieFromHeaders = async (headers: Headers): Promise<{ secure: boolean; value: JWT | null; name: string } | null> => {
  if (!headers) return null

  const cookieString = headers.get('Cookie') || ''
  const authJsCookie = findAuthJsCookie(parseCookie(cookieString))
  const token = await getAuthJsToken(headers)

  if (!authJsCookie) return null

  return {
    ...authJsCookie,
    value: token || null
  }
}

const mutatResponseToExpireAuthJsCookie = (response: NextResponse): NextResponse => {
  response.cookies.set(SECURE_AUTHJS_COOKIE_NAME, "", { expires: new Date(0) });
  response.cookies.set(AUTHJS_COOKIE_NAME, "", { expires: new Date(0) });
  response.cookies.set("payload-token", "", { expires: new Date(0) });
  return response
}

const handleLogoutResponse = async (request: NextRequest): Promise<NextResponse | true> => {
  if (request.nextUrl.pathname !== '/admin/logout') return true
  const response = NextResponse.redirect(new URL('/', request.url))
  mutatResponseToExpireAuthJsCookie(response)
  return response
}

const validateJwtTokenAndLogoutOnFailure = async (request: NextRequest): Promise<NextResponse | true> => {
  const authCookie = await parseAuthCookieFromHeaders(request.headers)

  if (
    (authCookie?.value == null && request.cookies.has(authCookie?.name || '')) ||
    (authCookie?.value?.exp != null && !isWithinExpirationDate(new Date(authCookie?.value.exp * 1000)))
  ) {
    const response = NextResponse.redirect(request.url)
    mutatResponseToExpireAuthJsCookie(response)
    return response
  }
  return true
}

const validateAuthRoutes = async (request: NextRequest): Promise<NextResponse | true> => {
  const authCookie = await parseAuthCookieFromHeaders(request.headers)

  if (!protectedRoutes.some((route) => match(route, { decode: decodeURIComponent })(request.nextUrl.pathname))) return true

  if (!authCookie || authCookie?.value == null) {
    const signInUrl = new URL(authConfig?.pages?.signIn || '/sign-in', request.url)
    const response = NextResponse.redirect(signInUrl)
    return response
  }
  return true
}

export default async function middleware(request: NextRequest) {
  const sequentialMiddlewares = [handleLogoutResponse]
  if (SESSION_STRATEGY === 'jwt') {
    sequentialMiddlewares.push(validateJwtTokenAndLogoutOnFailure)
    sequentialMiddlewares.push(validateAuthRoutes)
  }

  for (const check of sequentialMiddlewares) {
    const result = await check(request)
    if (result !== true) {
      return result
    }
  }

  return NextResponse.next()
}
