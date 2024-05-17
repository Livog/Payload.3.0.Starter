import { AUTHJS_COOKIE_NAME, SECURE_AUTHJS_COOKIE_NAME, findAuthJsCookie, getAuthJsCookieName, getAuthJsToken } from '@/lib/auth/edge'
import { isWithinExpirationDate } from '@/utils/isWithinExperationDate'
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_STRATEGY } from '@/lib/auth/config'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

const mutatResponseToRemoveAuthJsCookie = (response: NextResponse): NextResponse => {
  response.cookies.has(SECURE_AUTHJS_COOKIE_NAME) && response.cookies.delete(SECURE_AUTHJS_COOKIE_NAME)
  response.cookies.has(AUTHJS_COOKIE_NAME) && response.cookies.delete(AUTHJS_COOKIE_NAME)
  response.cookies.has('payload-token') && response.cookies.delete('payload-token')
  return response
}

const handleLogoutResponse = async (request: NextRequest): Promise<NextResponse | true> => {
  if (request.nextUrl.pathname !== '/admin/logout') return true
  const response = NextResponse.redirect(new URL('/', request.url))
  mutatResponseToRemoveAuthJsCookie(response)
  return response
}

const validateJwtTokenAndLogoutOnFailure = async (request: NextRequest): Promise<NextResponse | true> => {
  const headers = request.headers
  const cookieString = headers ? headers.get('Cookie') || '' : ''
  const authJsCookie = findAuthJsCookie(parseCookie(cookieString))
  const token = await getAuthJsToken(headers)

  if ((token == null && request.cookies.has(authJsCookie?.name || '')) || (token?.exp != null && !isWithinExpirationDate(new Date(token.exp * 1000)))) {
    const response = NextResponse.redirect(request.url)
    authJsCookie && request.cookies.has(authJsCookie.name) && response.cookies.delete(authJsCookie.name)
    return response
  }
  return true
}

export default async function middleware(request: NextRequest) {
  const sequentialMiddlewares = [handleLogoutResponse]
  if (SESSION_STRATEGY === 'jwt') sequentialMiddlewares.push(validateJwtTokenAndLogoutOnFailure)

  for (const check of sequentialMiddlewares) {
    const result = await check(request)
    if (result !== true) {
      return result
    }
  }

  return NextResponse.next()
}
