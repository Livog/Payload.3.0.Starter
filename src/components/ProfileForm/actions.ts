'use server'

import { auth, signOut, unstable_update } from '@/lib/auth'
import { FIELDS_USER_IS_ALLOWED_TO_CHANGE } from '@/lib/auth/config'
import { getPayload } from '@/lib/payload'
import { revalidateUser } from '@/lib/payload/actions'
import { users } from '@/payload/collections'
import { COLLECTION_SLUG_USER } from '@/payload/collections/config'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getFieldsToSign } from 'payload/auth'
import { User } from '~/payload-types'

const sanitizeUserData = (data: Record<string, any>) => {
  const newData = structuredClone(data)

  if (newData.password?.length < 6 || newData.confirmPassword?.length < 6 || newData.password !== newData.confirmPassword) {
    delete newData.password
    delete newData.confirmPassword
  }

  Object.keys(newData).forEach((key) => {
    if (!(FIELDS_USER_IS_ALLOWED_TO_CHANGE || []).includes(key)) {
      // @ts-ignore
      delete newData[key]
    }
  })
  return newData
}

export const updateUser = async (userData: User) => {
  const session = await auth()
  if (!session || !session.user) {
    redirect('/sign-in')
  }
  const user = session.user
  const sanitizedUserData = sanitizeUserData(userData)
  const payload = await getPayload()
  const newUser = (await payload
    .update({
      collection: COLLECTION_SLUG_USER,
      id: user.id,
      data: sanitizedUserData
    })
    .then((user) => ({ ...user, collection: COLLECTION_SLUG_USER }))) as User & { collection: typeof COLLECTION_SLUG_USER }
  // No need to revalidate here, because that is handled in afterChange hook in Payload.
  const fieldsToSign = getFieldsToSign({
    user: newUser,
    email: session.user.email,
    collectionConfig: users
  })
  const newSession = await unstable_update({ user: fieldsToSign })
  return newSession
}

export const deleteUser = async () => {
  const session = await auth()
  if (!session || !session.user) {
    redirect('/sign-in')
  }
  const user = session.user
  const payload = await getPayload()
  revalidateUser(user, payload)
  await payload.delete({
    collection: COLLECTION_SLUG_USER,
    id: user.id
  })
  await signOut()
  revalidatePath('/')
  redirect('/')
}
