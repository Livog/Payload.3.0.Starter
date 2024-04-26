import type { Block } from 'payload/types'
import { COLLECTION_SLUG_MEDIA } from '@/payload/collections/media'

export const heroBanner: Block = {
  slug: 'HeroBanner',
  interfaceName: 'HeroBannerBlock',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: COLLECTION_SLUG_MEDIA,
      required: true
    }
  ]
}
