/** Edge friendly functions only in here */

import { getToken } from '@auth/core/jwt'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import type { NextRequest } from 'next/server'

export const getAuthJsCookieName = () => (process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token')

export const getAuthJsToken = async (request: NextRequest) => {
  const cookieName = getAuthJsCookieName()
  const cookieValue = request.cookies.get(cookieName)?.value
  if (!cookieValue) return null
  const token = await getToken({
    req: request,
    salt: cookieName,
    secret: process.env.AUTH_SECRET!,
    secureCookie: process.env.NODE_ENV === 'production'
  })
  return token
}

export const mockRequestAndResponseFromHeadersForNextAuth = ({ headers, cookies }: { headers?: Headers; cookies?: ReadonlyRequestCookies }) => {
  const request = {
    headers,
    cookies
  } as any

  const response = {
    getHeader() {},
    setCookie() {},
    setHeader() {},
    appendHeader() {}
  } as any

  return { request, response }
}
