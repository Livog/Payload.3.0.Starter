import { MetadataRoute } from 'next'

// @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/'
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`
  }
}
