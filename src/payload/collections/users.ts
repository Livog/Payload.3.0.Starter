import { PayloadAdapter, getUserByEmail } from '@/lib/auth/adapter'
import authConfig, { ADMIN_ACCESS_ROLES } from '@/lib/auth/config'
import { getAuthJsCookieName, mockRequestAndResponseFromHeadersForNextAuth } from '@/lib/auth/edge'
import { isAdmin, isAdminOrCurrentUser } from '@/payload/access'
import parseCookieString from '@/utils/parseCookieString'
import NextAuth from 'next-auth'
import { isWithinExpirationDate } from 'oslo'
import type { CollectionConfig } from 'payload/types'

const ADMIN_AUTH_GROUP = 'Auth'

export const COLLECTION_SLUG_USER = 'users' as const
export const COLLECTION_SLUG_SESSIONS = 'sessions' as const

export const users: CollectionConfig = {
  slug: COLLECTION_SLUG_USER,
  admin: {
    group: ADMIN_AUTH_GROUP,
    useAsTitle: 'email'
  },
  endpoints: [
    {
      path: '/refresh-token',
      method: 'post',
      async handler(request) {
        if (!request?.url) return new Response('No request URL provided', { status: 400 })

        const requestUrl = new URL(request.url)
        requestUrl.pathname = '/api/auth/session'

        const newRequest = new Request(requestUrl.toString(), {
          method: 'GET',
          headers: new Headers(request.headers)
        })

        try {
          const response = await fetch(newRequest)
          const data = await response.json()

          if (!response.ok) {
            throw new Error('Failed to refresh token')
          }

          const responseCookies = parseCookieString(String(response.headers.get('Set-Cookie') || ''))
          const authCooke = responseCookies?.[getAuthJsCookieName()] ?? null

          const responseBody = JSON.stringify({
            message: 'Token refresh successful',
            refreshToken: authCooke?.value,
            exp: authCooke && authCooke?.expires ? Math.floor(authCooke.expires.getTime() / 1000) : null,
            user: data.user
          })

          return new Response(responseBody, {
            status: response.status,
            headers: response.headers
          })
        } catch (error) {
          console.log(error)
          return new Response(JSON.stringify({ message: 'Token refresh failed' }), { status: 401 })
        }
      }
    }
  ],
  auth: {
    strategies: [
      {
        name: 'next-auth',
        /** @ts-ignore */
        authenticate: async ({ headers, payload }) => {
          const { auth } = NextAuth({
            ...authConfig,
            adapter: PayloadAdapter(payload)
          })
          const { request, response } = mockRequestAndResponseFromHeadersForNextAuth({ headers })
          const session = await auth(request, response)
          const user = session?.user
          if (!user || typeof user.email !== 'string' || (session?.expires && !isWithinExpirationDate(new Date(session.expires)))) return null

          const dbUser = await getUserByEmail({ payload, email: user.email, collection: COLLECTION_SLUG_USER })
          if (!dbUser || (typeof dbUser.role === 'string' && !ADMIN_ACCESS_ROLES.includes(dbUser?.role))) return null
          return {
            ...dbUser,
            collection: COLLECTION_SLUG_USER
          }
        }
      }
    ]
  },
  access: {
    read: isAdminOrCurrentUser,
    create: isAdmin,
    update: isAdmin,
    delete: isAdminOrCurrentUser
  },
  fields: [
    { name: 'name', type: 'text', saveToJWT: true },
    { name: 'imageUrl', type: 'text', saveToJWT: true },
    { name: 'role', type: 'select', options: ['admin', 'user'], saveToJWT: true },
    { name: 'emailVerified', type: 'date' },
    {
      name: 'accounts',
      type: 'array',
      saveToJWT: false,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'provider', type: 'text', admin: { readOnly: true } },
            { name: 'providerAccountId', type: 'text', admin: { readOnly: true } }
          ]
        }
      ]
    },
    {
      name: 'verificationTokens',
      type: 'array',
      saveToJWT: false,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'identifier', type: 'text', admin: { readOnly: true } },
            { name: 'token', type: 'text', admin: { readOnly: true } },
            { name: 'expires', type: 'date', admin: { readOnly: true } }
          ]
        }
      ]
    }
  ]
} as const

export const sessions: CollectionConfig = {
  slug: COLLECTION_SLUG_SESSIONS,
  admin: {
    group: ADMIN_AUTH_GROUP
  },
  access: {
    read: isAdminOrCurrentUser,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: COLLECTION_SLUG_USER, required: true, admin: { readOnly: false } },
    { name: 'sessionToken', type: 'text', required: true, index: true, admin: { readOnly: false } },
    { name: 'expires', type: 'date', admin: { readOnly: false, date: { pickerAppearance: 'dayAndTime' } }, required: false }
  ]
} as const
