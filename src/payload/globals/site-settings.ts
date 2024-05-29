import type { ArrayField, Field, GlobalConfig } from 'payload/types'
import { isAdmin } from '@/payload/access'
import { COLLECTION_SLUG_PAGE } from '@/payload/collections/config'
import { revalidateTag } from 'next/cache'
import iconField from '@/payload/fields/icon'
import { generateGlobalCacheKey } from '@/payload/utils/getGlobal'
import { GLOBAL_SETTINGS_SLUG } from './config'

const menuItemsField = (name: 'subMenuItems' | 'menuItems', depth: number = 2, options: Partial<ArrayField> = {}): Field => {
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
    ...options,
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
    afterChange: [async () => revalidateTag(generateGlobalCacheKey(GLOBAL_SETTINGS_SLUG))]
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
          fields: [{ type: 'text', name: 'logo' }, menuItemsField('menuItems', 2, { interfaceName: 'HeaderMenu' })]
        },
        {
          name: 'footer',
          fields: [{ type: 'text', name: 'copyright' }, menuItemsField('menuItems', 0, { interfaceName: 'FooterMenu' })]
        }
      ]
    }
  ]
}
