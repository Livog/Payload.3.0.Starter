/** Edge friendly functions only in here */

import { getToken } from '@auth/core/jwt'
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { SESSION_STRATEGY } from './config'
import { unstable_cache } from 'next/cache'
import { COLLECTION_SLUG_SESSIONS, COLLECTION_SLUG_USER } from '@/payload/collections'
import type { User } from '~/payload-types'
import type { Payload } from 'payload'

export const getAuthJsCookieName = () => (process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token')

export const getAuthJsToken = async (headers: Headers) => {
  const cookieName = getAuthJsCookieName()
  const request = {
    headers,
    cookies: parseCookie(headers.get('Cookie') || '')
  }
  const cookieValue = request.cookies.get(cookieName)
  if (!cookieValue) return null
  const token = await getToken({
    req: request,
    salt: cookieName,
    secret: process.env.AUTH_SECRET!,
    secureCookie: process.env.NODE_ENV === 'production'
  })
  return token
}

export const getUserIdOrSessionToken = async (headers: Headers): Promise<string | null> => {
  let userIdOrSessionToken = null
  if (SESSION_STRATEGY === 'jwt') {
    const parsedJwt = await getAuthJsToken(headers)
    if (!parsedJwt) return null
    userIdOrSessionToken = parsedJwt?.id || null
  } else if (SESSION_STRATEGY === 'database') {
    const cookies = parseCookie(headers.get('Cookie') || '')
    userIdOrSessionToken = cookies.get(getAuthJsCookieName()) || null
  }
  return userIdOrSessionToken
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

type BaseParams = {
  payload: Payload
  cache?: boolean
}

async function executeWithCacheControl(fetchFunction: () => Promise<User | null>, cacheKey: string, cache: boolean = false) {
  if (!cache) {
    return fetchFunction()
  }
  return unstable_cache(fetchFunction, [cacheKey], { revalidate: false, tags: [cacheKey] })()
}

export const getCurrentUser = async ({ headers, payload, cache = false }: { headers: Headers } & BaseParams): Promise<User | null> => {
  const userIdOrSessionToken = await getUserIdOrSessionToken(headers)
  if (!userIdOrSessionToken) return null
  const cacheKey = SESSION_STRATEGY === 'database' ? `payload-user-session-${userIdOrSessionToken}` : `payload-user-${userIdOrSessionToken}`

  return executeWithCacheControl(
    async () => {
      if (SESSION_STRATEGY === 'database') {
        const { docs: sessions } = await payload.find({
          where: { sessionToken: { equals: userIdOrSessionToken } },
          collection: COLLECTION_SLUG_SESSIONS,
          depth: 1
        })
        if (sessions.length === 0) return null
        const user = sessions.at(0)?.user || null
        return typeof user === 'object' ? user : null
      }
      return await payload.findByID({ id: userIdOrSessionToken, collection: COLLECTION_SLUG_USER })
    },
    cacheKey,
    cache
  )
}

export const getUserById = async ({ id, payload, cache = false }: { id: string } & BaseParams): Promise<User | null> => {
  const cacheKey = `get-user-by-id-${id}`
  return executeWithCacheControl(
    async () => {
      return await payload.findByID({ id, collection: COLLECTION_SLUG_USER })
    },
    cacheKey,
    cache
  )
}

export const getUserByEmail = async ({ email, payload, cache = false }: { email: string } & BaseParams): Promise<User | null> => {
  const cacheKey = `get-user-by-email-${email}`
  return executeWithCacheControl(
    async () => {
      const { docs } = await payload.find({ where: { email: { equals: email } }, collection: COLLECTION_SLUG_USER })
      return docs.at(0) || null
    },
    cacheKey,
    cache
  )
}
