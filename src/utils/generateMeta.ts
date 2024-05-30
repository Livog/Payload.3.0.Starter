import type { Metadata } from 'next'
import _get from 'lodash/get'
import deepmerge from 'deepmerge'
import { getDocument } from '@/payload/utils/getDocument'
import normalizePath from './normalizePath'

const defaultTitle = 'Payload SaaS Starter'
const defaultDescription = 'An open-source website built with Payload and Next.js.'
const siteName = 'Payload SaaS Starter'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: defaultDescription,
  siteName,
  title: defaultTitle
}

export const generateMeta = async (path: string | string[]): Promise<Metadata> => {
  const doc = await getDocument({
    collection: 'pages',
    path,
    depth: 1
  })
  const metaTitle = _get(doc, 'meta.title', null)
  const title = metaTitle ?? (_get(doc, 'title', defaultTitle) as string)
  const description = _get(doc, 'meta.description', defaultDescription)
  const ogImage = _get(doc, 'meta.image.url', `/api/og${normalizePath(path, true)}image.jpg`)

  return {
    description,
    openGraph: deepmerge(defaultOpenGraph, {
      description,
      images: ogImage ? [{ url: ogImage }] : undefined
    }),
    title: { absolute: title }
  }
}
