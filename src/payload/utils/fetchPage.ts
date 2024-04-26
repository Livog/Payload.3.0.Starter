import 'server-only'
import { getPayload } from '@/lib/payload'
import { COLLECTION_SLUG_PAGE } from '@/payload/collections/pages'
import { notFound } from 'next/navigation'
import { Page } from '~/payload-types'
import ensurePath from '@/utils/ensurePath'

const fetchPage = async (path: string | string[]): Promise<Page | null> => {
  if (!path) path = '/'
  if (Array.isArray(path)) path = path.join('/')
  if (path !== '/') path = ensurePath(path).replace(/\/$/, '')
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: COLLECTION_SLUG_PAGE,
    where: { path: { equals: path } },
    depth: 3
  })
  if (docs?.length === 0) {
    notFound()
  }
  const page = docs?.at(0)
  return page || null
}

export default fetchPage
