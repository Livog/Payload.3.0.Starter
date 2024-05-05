import type { Field, FieldHook } from 'payload/types'
import deepMerge from 'deepmerge'

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

const formatSlug =
  (fallback: string): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    if (typeof value === 'string' && value.length > 0) {
      return format(value)
    }

    if (operation === 'create') {
      const fallbackData = (data && data[fallback]) || (originalDoc && originalDoc[fallback])

      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    return value
  }

type Slug = (fieldToUse?: string, overrides?: Partial<Field>) => Field

const slugField: Slug = (fieldToUse = 'title', overrides = {}) => {
  return deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      required: false, // Need to be false so that we can use beforeValidate hook to set slug.
      admin: {
        position: 'sidebar'
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)]
      }
    },
    overrides
  )
}

export default slugField
