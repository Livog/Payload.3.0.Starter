import type { Field, GlobalConfig } from 'payload/types'
import { isAdmin } from '@/payload/access'
import { COLLECTION_SLUG_PAGE } from '@/payload/collections/config'
import { revalidateTag } from 'next/cache'
import iconField from '@/payload/fields/icon'

export const GLOBAL_SETTINGS_SLUG = 'site-settings'

const menuItemsField = (name: 'subMenuItems' | 'menuItems', depth: number = 2): Field => {
  const label = name === 'menuItems' ? 'Menu Items' : 'Sub Menu Items'
  const fields: Field[] = [
    {
      type: 'row',
      fields: [{ type: 'relationship', name: 'page', relationTo: [COLLECTION_SLUG_PAGE] }, iconField(), { type: 'text', name: 'description' }]
    }
  ]

  if (depth > 0) {
    fields.push(menuItemsField('subMenuItems', depth - 1))
  }

  return {
    type: 'array',
    name,
    label,
    fields
  }
}

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
          fields: [
            { type: 'text', name: 'appName' },
            { type: 'text', name: 'appDescription' }
          ]
        },
        {
          name: 'header',
          fields: [{ type: 'text', name: 'logo' }, menuItemsField('menuItems')]
        },
        {
          name: 'footer',
          fields: [{ type: 'text', name: 'copyright' }, menuItemsField('menuItems', 0)]
        }
      ]
    }
  ]
}
