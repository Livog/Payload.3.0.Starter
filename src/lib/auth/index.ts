import 'server-only'
import { getPayload } from '@/lib/payload'
import { COLLECTION_SLUG_USER, users } from '@/payload/collections'
import NextAuth from 'next-auth'
import { getFieldsToSign as getFieldsToSignPayload } from 'payload/auth'
import { PayloadAdapter } from './adapter'
import authConfig from './config'

export const { auth, handlers, signIn, signOut } = NextAuth(() => {
  const payload = getPayload()
  return {
    adapter: PayloadAdapter(payload),
    callbacks: {
      async jwt({ token, user }) {
        const userId = (token?.id || token?.sub || user?.id) as string | number
        const dbUser = await (
          await payload
        ).findByID({
          collection: COLLECTION_SLUG_USER,
          id: userId,
        })
        const fieldsToSign = getFieldsToSignPayload({
          // @ts-ignore
          user: dbUser,
          email: dbUser.email,
          collectionConfig: users,
        })
        token = {
          ...token,
          ...(fieldsToSign || {}),
        }
        return token
      },
      async session({ session, token }) {
        session.user = session.user || {}
        if (!token) return session
        const fieldsToSign = getFieldsToSignPayload({
          // @ts-ignore
          user: token,
          email: session.user.email,
          collectionConfig: users,
        })

        session.user = {
          ...fieldsToSign,
          ...session.user,
          // @ts-ignore
          collection: COLLECTION_SLUG_USER,
        }

        return session
      },
    },
    ...authConfig,
  }
})
