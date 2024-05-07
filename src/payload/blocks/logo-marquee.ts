import type { Block } from 'payload/types'
import { COLLECTION_SLUG_MEDIA } from '@/payload/collections/media'

export const logoMarquee: Block = {
  slug: 'LogoMarquee',
  interfaceName: 'LogoMarqueeBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'speed',
          type: 'number',
          defaultValue: 20,
          admin: {
            description: 'Higher = slower'
          }
        }
      ]
    },
    {
      name: 'logos',
      type: 'array',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: COLLECTION_SLUG_MEDIA,
          required: true
        }
      ]
    }
  ]
}
