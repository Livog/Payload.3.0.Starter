import { NextResponse, type NextRequest } from 'next/server'
import { getAuthJsCookieName, getAuthJsToken } from '@/lib/auth/edge'
import { SESSION_STRATEGY } from '@/lib/auth/config'
import { isWithinExpirationDate } from 'oslo'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

const mutatResponseToRemoveAuthJsCookie = (response: NextResponse): NextResponse => {
  const cookieName = getAuthJsCookieName()
  response.cookies.set(cookieName, '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  })
  return response
}

const handleLogoutResponse = async (request: NextRequest): Promise<NextResponse | true> => {
  if (request.nextUrl.pathname !== '/admin/logout') return true
  const response = NextResponse.redirect(new URL('/', request.url))
  mutatResponseToRemoveAuthJsCookie(response)
  return response
}

const validateJwtTokenAndLogoutOnFailure = async (request: NextRequest): Promise<NextResponse | true> => {
  const cookieName = getAuthJsCookieName()
  const token = await getAuthJsToken(request)

  if ((token == null && request.cookies.has(cookieName)) || (token?.exp != null && !isWithinExpirationDate(new Date(token.exp * 1000)))) {
    const response = NextResponse.redirect(request.url)
    response.cookies.delete(cookieName)
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
