import { slugField, pathField } from '@/payload/fields'
import type { CollectionConfig } from 'payload/types'
import { blocksField } from '@/payload/fields/blocks'
import { COLLECTION_SLUG_PAGE } from './config'
import { createBreadcrumbsField } from '@payloadcms/plugin-nested-docs'
import { revalidateTag } from 'next/cache'
import { generateDocumentCacheKey } from '@/payload/utils/getDocument'
import { isAdmin, isAdminOrPublished } from '@/payload/access'

export const pages: CollectionConfig = {
  slug: COLLECTION_SLUG_PAGE,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'updatedAt', 'createdAt']
  },
  versions: {
    drafts: {
      autosave: false
    },
    maxPerDoc: 10
  },
  access: {
    read: isAdminOrPublished,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin
  },
  hooks: {
    afterChange: [
      async ({ doc, collection }) => {
        revalidateTag(generateDocumentCacheKey(collection.slug, doc.path))
      }
    ]
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              type: 'text',
              name: 'title'
            },
            blocksField()
          ]
        }
      ]
    },
    slugField(),
    pathField(),
    createBreadcrumbsField(COLLECTION_SLUG_PAGE, {
      name: 'breadcrumbs',
      admin: {
        disabled: true
      }
    })
  ]
}
