import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload as getPayloadInstance } from 'payload'
import { User } from '~/payload-types'

export async function getPayload(): ReturnType<typeof getPayloadInstance> {
  return getPayloadInstance({ config: await configPromise })
}

export async function getCurrentUser(): Promise<ReturnType<typeof payload.auth> | null> {
  const h = headers()
  const payload = await getPayload()
  if (!payload) return null
  return await payload.auth({ headers: h })
}
