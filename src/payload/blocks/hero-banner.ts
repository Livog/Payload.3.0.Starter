import type { Block } from 'payload/types'
import { COLLECTION_SLUG_MEDIA } from '@/payload/collections/config'

const HeroBanner: Block = {
  slug: 'HeroBanner',
  interfaceName: 'HeroBannerBlock',
  fields: [
    {
      name: 'settings',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Invert Background Image in Dark Mode',
          value: 'invertBackgroundImageInDarkMode'
        }
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: 'preTitle',
          type: 'text'
        },
        {
          name: 'title',
          type: 'text',
          required: true
        },
        {
          name: 'subtitle',
          type: 'text'
        }
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: COLLECTION_SLUG_MEDIA,
          required: true
        }
      ]
    }
  ]
}

export default HeroBanner
