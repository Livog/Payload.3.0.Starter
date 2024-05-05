import { pathField, slugField } from '@/payload/fields'
import type { CollectionConfig } from 'payload/types'
import { blocksField } from '../fields/blocks'

export const COLLECTION_SLUG_PAGE = 'pages'

export const pages: CollectionConfig = {
  slug: COLLECTION_SLUG_PAGE,
  admin: {
    useAsTitle: 'title'
  },
  fields: [
    {
      name: 'title',
      type: 'text'
    },
    blocksField(),
    slugField(),
    pathField()
  ]
}
