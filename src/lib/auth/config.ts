import { CredentialsSignin, type NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Credentials from '@auth/core/providers/credentials'
import { COLLECTION_SLUG_USER } from '@/payload/collections'

export const SESSION_STRATEGY = 'jwt' as 'jwt' | 'database'
export const SESSION_MAX_AGE = 86400 as const
export const DEFAULT_USER_ROLE = 'user' as const
export const DEFAULT_FIELDS_USER_IS_NOT_ALLOWED_TO_CHANGE = ['id', 'email', 'emailVerified', 'role']
export const ADMIN_ACCESS_ROLES = ['admin']

export default {
  jwt: {
    maxAge: SESSION_MAX_AGE
  },
  session: { strategy: SESSION_STRATEGY, maxAge: SESSION_MAX_AGE },
  providers: [
    GitHub({
      allowDangerousEmailAccountLinking: true
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'text', placeholder: 'john.doe@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, request) {
        try {
          const response = await fetch(`${process.env.AUTH_URL!}/api/${COLLECTION_SLUG_USER}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            })
          })
          const data = await response.json()
          if (data?.errors) {
            throw new CredentialsSignin('Invalid credentials', {
              err: new Error(data.errors[0].message)
            })
          }
          if (!data?.user) {
            throw new CredentialsSignin('Invalid credentials')
          }
          return data?.user
        } catch (error) {
          throw new CredentialsSignin('Invalid credentials')
        }
      }
    })
  ]
} satisfies NextAuthConfig
