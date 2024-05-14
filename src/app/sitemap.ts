import type { MetadataRoute } from 'next'
import { getPayload } from '@/lib/payload'
import { COLLECTION_SLUG_PAGE } from '@/payload/collections/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload()
  const { docs: pages } = await payload.find({
    collection: COLLECTION_SLUG_PAGE,
    depth: 0
  })
  const sitemapObject: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}${page.path}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: 'daily',
    priority: 0.8
  }))
  return sitemapObject
}
