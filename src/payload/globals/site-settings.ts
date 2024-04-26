import type { GlobalConfig } from 'payload/types'
import { isAdmin } from '@/payload/access'
import { COLLECTION_SLUG_PAGE } from '@/payload/collections'
import { revalidateTag } from 'next/cache'

export const GLOBAL_SETTINGS_SLUG = 'site-settings'

export const siteSettings: GlobalConfig = {
  slug: GLOBAL_SETTINGS_SLUG,
  access: {
    read: isAdmin,
    update: isAdmin
  },
  hooks: {
    afterChange: [async () => revalidateTag('site-settings')]
  },
  fields: [
    {
      type: 'tabs',
      label: 'Settings',
      tabs: [
        {
          label: 'General',
          fields: [{ type: 'text', name: 'title' }]
        },
        {
          label: 'Header',
          fields: [
            { type: 'text', name: 'logo' },
            {
              type: 'array',
              name: 'menuItems',
              label: 'Menu Items',
              fields: [{ type: 'relationship', name: 'page', relationTo: [COLLECTION_SLUG_PAGE] }]
            }
          ]
        }
      ]
    }
  ]
}
