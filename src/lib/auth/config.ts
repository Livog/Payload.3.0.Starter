import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'

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
    })
  ]
} satisfies NextAuthConfig
