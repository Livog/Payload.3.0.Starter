import type { Config } from '~/payload-types'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { unstable_cache } from 'next/cache'
import { SiteSetting } from '~/payload-types'

type Global = keyof Config['globals']

export const generateGlobalCacheKey = (slug: Global): string => {
  return `global_${slug}`
}

export const getGlobal = async (slug: Global, depth = 0): Promise<SiteSetting | null> => {
  const payload = await getPayloadHMR({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth
  })

  return global || null
}

export const getCachedGlobal = async (slug: Global, depth: number = 3, revalidate: false | number | undefined = false): Promise<SiteSetting | null> => {
  const cacheKey = generateGlobalCacheKey(slug)
  return unstable_cache((slug, depth) => getGlobal(slug, depth), [cacheKey], { revalidate, tags: [cacheKey] })(slug, depth)
}

export default getCachedGlobal
