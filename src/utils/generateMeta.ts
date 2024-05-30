import type { Metadata } from 'next'
import _get from 'lodash/get'
import type { Page } from '~/payload-types'
import deepmerge from 'deepmerge'

const defaultTitle = 'Payload SaaS Starter'
const defaultDescription = 'An open-source website built with Payload and Next.js.'
const siteName = 'Payload SaaS Starter'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: defaultDescription,
  siteName,
  title: defaultTitle
}

export const generateMeta = async (args: { doc: Page }): Promise<Metadata> => {
  const { doc } = args || {}
  const metaTitle = _get(doc, 'meta.title', null)
  const title = metaTitle ?? (_get(doc, 'title', defaultTitle) as string)
  const description = _get(doc, 'meta.description', defaultDescription)
  const ogImage = _get(doc, 'meta.image.url', null)

  return {
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
    openGraph: deepmerge(defaultOpenGraph, {
      description,
      images: ogImage ? [{ url: ogImage }] : undefined
    }),
    title: { absolute: title }
  }
}
