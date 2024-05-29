import 'server-only'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { GLOBAL_SETTINGS_SLUG } from '@/payload/globals/site-settings'
import { SiteSetting } from '~/payload-types'

export const generateSiteSettingsCacheKey = (): string => {
  return 'site-settings'
}

export const getSiteSettings = async (): Promise<SiteSetting | null> => {
  const payload = await getPayloadHMR({ config: configPromise })
  const settings = await payload.findGlobal({
    slug: GLOBAL_SETTINGS_SLUG,
    depth: 1
  })
  return settings || null
}

export const getCachedSiteSettings = async (revalidate: false | number | undefined = 60): Promise<SiteSetting | null> => {
  const cacheKey = generateSiteSettingsCacheKey()
  return unstable_cache(() => getSiteSettings(), [cacheKey], { revalidate, tags: [cacheKey] })()
}

export default getCachedSiteSettings
