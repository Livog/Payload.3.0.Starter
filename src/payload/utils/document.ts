import type { Config } from '~/payload-types'

import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { unstable_cache } from 'next/cache'
import normalizePath from '@/utils/normalizePath'

type Collection = keyof Config['collections'] | string
type Path = string | string[]

export const generateDocumentCacheKey = (collection: Collection, path?: Path): string => {
  return `${collection}_path_${normalizePath(path, false)}`
}

export const generateDocumentCacheParams = (collection: Collection, path?: Path): string[] => {
  return [collection, normalizePath(path)]
}

export const getDocument = async <K extends keyof Config['collections']>(collection: K, path?: Path, depth = 0): Promise<Config['collections'][K] | null> => {
  const payload = await getPayloadHMR({ config: configPromise })

  const normalizedPath = normalizePath(path, false)
  const where = { path: { equals: normalizedPath } }

  const page = await payload.find({
    collection,
    depth,
    where
  })

  return page.docs.at(0) as Config['collections'][K] | null
}

export const getCachedDocument = async <K extends keyof Config['collections']>(
  collection: K,
  path: Path,
  depth: number,
  revalidate: false | number | undefined = false
): Promise<Config['collections'][K] | null> => {
  const cacheKey = generateDocumentCacheKey(collection, path)
  return unstable_cache((collection, path, depth) => getDocument(collection, path, depth), [cacheKey], { revalidate, tags: [cacheKey] })(
    collection,
    path,
    depth
  )
}
