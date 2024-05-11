import { COLLECTION_SLUG_MEDIA } from '@/payload/collections/media'
import type { Block } from 'payload/types'

const LogoMarquee: Block = {
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

export default LogoMarquee
