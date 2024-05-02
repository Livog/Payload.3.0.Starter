import NextAuth, { DefaultSession, User } from 'next-auth'
import { User as PayloadUser } from '~/payload-types'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: PayloadUser & DefaultSession['user']
  }
  interface User extends PayloadUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    name?: string
    imageUrl?: string
    role?: string
    emailVerified?: string
  }
}
