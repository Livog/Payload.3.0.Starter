import { getPayload } from '@/lib/payload'
import { GLOBAL_SETTINGS_SLUG } from '@/payload/globals/site-settings'
import 'server-only'
import { SiteSetting } from '~/payload-types'
import { unstable_cache } from 'next/cache'

const getSiteSettings = unstable_cache(
  async (): Promise<SiteSetting | null> => {
    const payload = await getPayload()
    const settings = await payload.findGlobal({
      slug: GLOBAL_SETTINGS_SLUG,
      depth: 1
    })
    return settings || null
  },
  ['site-settings'],
  { revalidate: 60, tags: ['site-settings'] }
)

export default getSiteSettings
