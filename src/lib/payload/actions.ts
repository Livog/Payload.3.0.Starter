'use server'

import { SESSION_STRATEGY } from '@/lib/auth/config'
import { COLLECTION_SLUG_SESSIONS } from '@/payload/collections/config'
import { revalidateTag } from 'next/cache'
import type { Payload } from 'payload'
import type { User } from '~/payload-types'

export const revalidateUser = async (user: User, payload: Payload) => {
  revalidateTag(`payload-user-${user.id}`)
  revalidateTag(`payload-user-email-${user.email}`)
  if (SESSION_STRATEGY === 'database') {
    const { docs: sessions } = await (await payload).find({ where: { user: { equals: user.id } }, collection: COLLECTION_SLUG_SESSIONS })
    sessions.forEach((session) => {
      revalidateTag(`payload-user-session-${session.sessionToken}`)
    })
  }
}
