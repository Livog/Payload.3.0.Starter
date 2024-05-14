import { COLLECTION_SLUG_SESSIONS, COLLECTION_SLUG_USER } from '@/payload/collections/config'
import generateRandomString from '@/utils/generateRandomString'
import { isWithinExpirationDate } from '@/utils/isWithinExperationDate'
import type { AdapterUser } from '@auth/core/adapters'
import type { Adapter, AdapterUser as BaseAdapterUser } from 'next-auth/adapters'
import type { BasePayload, GeneratedTypes } from 'payload'
import type { User } from '~/payload-types'
import { PAYLOAD_ADAPTER_CONFIG } from './config'

declare module '@auth/core/adapters' {
  // @ts-ignore
  interface AdapterUser extends BaseAdapterUser, User {}
}

type CollectionTypeMap = {
  users: typeof COLLECTION_SLUG_USER
  sessions: typeof COLLECTION_SLUG_SESSIONS
}

export const getUserByEmail = async ({ payload, email }: { payload: Payload; email: string }): Promise<User | null> => {
  const { docs } = await (
    await payload
  ).find({
    collection: COLLECTION_SLUG_USER,
    where: { email: { equals: email } }
  })
  return docs.at(0) ?? null
}

export const getUserByAccount = async ({
  payload,
  providerAccountId,
  provider
}: {
  payload: Payload
  providerAccountId: string
  provider: string
}): Promise<User | null> => {
  const { docs } = await (
    await payload
  ).find({
    collection: COLLECTION_SLUG_USER,
    where: {
      'accounts.provider': { equals: provider },
      'accounts.providerAccountId': { equals: providerAccountId }
    }
  })
  return docs.at(0) ?? null
}

type Payload = BasePayload<GeneratedTypes> | Promise<BasePayload<GeneratedTypes>>

type PayloadAdapterOptions = {
  collectionNames?: Partial<CollectionTypeMap>
  defaultUserRole?: string
  fieldsUserIsAllowedToChange?: string[]
  defaultMaxAge?: number
}

export function PayloadAdapter(payload: Payload, options: PayloadAdapterOptions = {}): Adapter {
  options = {
    ...PAYLOAD_ADAPTER_CONFIG,
    ...options,
    collectionNames: {
      ...PAYLOAD_ADAPTER_CONFIG.collectionNames,
      ...options.collectionNames
    }
  } as const

  const userCollectionName = options.collectionNames?.users || PAYLOAD_ADAPTER_CONFIG.collectionNames.users
  const sessionCollectionName = options.collectionNames!.sessions || PAYLOAD_ADAPTER_CONFIG.collectionNames.sessions

  const ensureAdapterUser = (user: User): AdapterUser => {
    return {
      ...user,
      email: user.email,
      id: user.id,
      name: user.name,
      image: user.imageUrl,
      role: user.role,
      emailVerified: user?.emailVerified ? new Date(user.emailVerified) : null
    }
  }

  return {
    async createUser(data) {
      const userData = {
        ...data,
        password: generateRandomString(32),
        imageUrl: data.image,
        role: options.defaultUserRole
      }

      if (process.env.AUTH_VERPOSE) {
        console.log('createUser', data)
      }
      const user = await (
        await payload
      ).create({
        collection: userCollectionName,
        // @ts-ignore
        data: userData
      })
      return ensureAdapterUser(user) || null
    },

    async getUser(id) {
      const user = await (
        await payload
      ).findByID({
        collection: userCollectionName,
        id
      })
      if (process.env.AUTH_VERPOSE) {
        console.log('getUser', user, 'id', id)
      }
      return ensureAdapterUser(user) || null
    },

    async getUserByEmail(email) {
      const user = await getUserByEmail({ payload, email })
      if (process.env.AUTH_VERPOSE) {
        console.log('getUserByEmail', user, 'email', email)
      }
      return user ? ensureAdapterUser(user) : null
    },

    async updateUser(data) {
      const userId = data.id
      Object.keys(data).forEach((key) => {
        if (!(options.fieldsUserIsAllowedToChange || []).includes(key) && key in data) {
          // @ts-ignore
          delete data[key]
        }
      })
      if (process.env.AUTH_VERPOSE) {
        console.log('updateUser', data)
      }
      const { docs } = await (
        await payload
      ).update({
        collection: userCollectionName,
        id: userId,
        // @ts-ignore
        data
      })
      const user = docs.at(0)
      if (!user) {
        throw new Error('PayloadAdapter: updateUser: no user found')
      }
      return ensureAdapterUser(user)
    },

    async deleteUser(id) {
      if (process.env.AUTH_VERPOSE) {
        console.log('deleteUser', id)
      }
      await (
        await payload
      ).delete({
        collection: userCollectionName,
        id
      })
    },

    async linkAccount(data) {
      const user = await (
        await payload
      ).findByID({
        collection: userCollectionName,
        id: data.userId
      })
      if (process.env.AUTH_VERPOSE) {
        console.log('linkAccount', user, 'data', data)
      }
      if (!user) return null
      const updatedUser = await (
        await payload
      ).update({
        collection: userCollectionName,
        id: data.userId,
        data: {
          accounts: [...(user?.accounts || []), data]
        }
      })
      if (process.env.AUTH_VERPOSE) {
        console.log('linkAccount -> updatedUser', updatedUser)
      }
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const user = await getUserByAccount({ payload, provider, providerAccountId })
      if (!user || !Array.isArray(user?.accounts)) return
      const updatedAccounts = user.accounts.filter((account) => account.provider !== provider || account.providerAccountId !== providerAccountId)
      await (
        await payload
      ).update({
        collection: userCollectionName,
        id: user.id,
        data: {
          accounts: updatedAccounts
        }
      })
    },

    async createVerificationToken({ identifier, token, expires }) {
      const { docs } = await (
        await payload
      ).find({
        collection: userCollectionName,
        where: { email: { equals: identifier } }
      })
      const user = docs.at(0)
      if (process.env.AUTH_VERPOSE) {
        console.log('createVerificationToken', 'identifier', identifier, 'user', user, 'token', token, 'expires', expires)
      }
      if (!user) return null
      await (
        await payload
      ).update({
        collection: userCollectionName,
        id: user.id,
        data: {
          verificationTokens: [...(user?.verificationTokens || []), { identifier, token, expires: expires.toISOString() }]
        }
      })
      return {
        token,
        expires,
        identifier
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const user = await getUserByAccount({ payload, provider, providerAccountId })
      if (process.env.AUTH_VERPOSE) {
        console.log('getUserByAccount', user, 'providerAccountId', providerAccountId, 'provider', provider)
      }
      return user ? ensureAdapterUser(user) : null
    },

    async createSession({ sessionToken, userId, expires }) {
      if (process.env.AUTH_VERPOSE) {
        console.log('createSession', sessionToken, userId, expires)
      }
      const session = await (
        await payload
      ).create({
        collection: COLLECTION_SLUG_SESSIONS,
        data: { sessionToken, user: userId, expires: expires.toISOString() }
      })
      const sessionUserId = typeof session?.user === 'string' ? session?.user : session?.user?.id
      const sessionExpires = session?.expires ? new Date(session.expires) : new Date(Date.now() + options.defaultMaxAge!)
      return {
        sessionToken: session?.sessionToken,
        userId: sessionUserId,
        expires: sessionExpires
      }
    },

    async getSessionAndUser(sessionToken) {
      const { docs: sessions } = await (
        await payload
      ).find({
        collection: COLLECTION_SLUG_SESSIONS,
        depth: 1, // So that we get user object aswell.
        where: { sessionToken: { equals: sessionToken } }
      })
      const session = sessions.at(0)

      if (!session || !session.user || typeof session.user !== 'object') return null

      const sessionExpires = new Date(session?.expires || 0)

      if (!isWithinExpirationDate(sessionExpires)) {
        await (
          await payload
        ).delete({
          collection: COLLECTION_SLUG_SESSIONS,
          where: { sessionToken: { equals: sessionToken } }
        })
        if (process.env.AUTH_VERPOSE) {
          console.log('Deleted expired session', sessionToken)
        }
        return null
      }

      return {
        session: {
          sessionToken: session?.sessionToken,
          userId: typeof session?.user === 'string' ? session?.user : session?.user?.id,
          expires: new Date(session?.expires || 0)
        },
        user: ensureAdapterUser(session?.user)
      }
    },

    async updateSession({ sessionToken, expires }) {
      const { docs } = await (
        await payload
      ).find({
        collection: sessionCollectionName,
        where: { sessionToken: { equals: sessionToken } }
      })
      if (process.env.AUTH_VERPOSE) {
        console.log('updateSession', sessionToken, expires)
      }
      const session = docs.at(0)
      if (!session || !expires) return null

      const updatedSession = await (
        await payload
      ).update({
        collection: sessionCollectionName,
        id: session.id,
        data: { expires: expires.toISOString() }
      })
      const sessionUserId = typeof updatedSession?.user === 'string' ? updatedSession?.user : updatedSession?.user?.id
      return {
        sessionToken: updatedSession?.sessionToken,
        userId: sessionUserId,
        expires: new Date(updatedSession?.expires || 0)
      }
    },

    async deleteSession(sessionToken) {
      await (
        await payload
      ).delete({
        collection: sessionCollectionName,
        where: { sessionToken: { equals: sessionToken } }
      })
    }
  }
}
