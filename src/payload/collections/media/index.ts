import { COLLECTION_SLUG_MEDIA } from '@/payload/collections/config'
import type { CollectionConfig } from 'payload/types'
import { addContentHashToFile } from './hooks/addContentHashToFile'
import { handleSvgUpload } from './hooks/handleSvgUpload'
import { updateCacheControl } from './hooks/updateCacheControl'

export const media: CollectionConfig = {
  slug: COLLECTION_SLUG_MEDIA,
  upload: true,
  admin: {
    useAsTitle: 'title'
  },
  hooks: {
    beforeOperation: [addContentHashToFile],
    afterChange: [updateCacheControl, handleSvgUpload]
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        style: { display: 'none' },
        readOnly: true
      }
    },
    {
      name: 'rawContent',
      type: 'textarea',
      admin: {
        disabled: true,
        readOnly: true
      }
    }
  ]
}
