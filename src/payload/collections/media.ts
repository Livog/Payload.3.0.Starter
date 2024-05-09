import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload/types'

export const COLLECTION_SLUG_MEDIA = 'media'

async function fetchSVG(url: string): Promise<string> {
  const response = await fetch(url)
  return response.text()
}

const handleSVGUpload: CollectionBeforeChangeHook = async ({ data, operation }) => {
  if (operation === 'create' || operation === 'update') {
    if (data.mimeType.includes('image/svg') && data.url) {
      try {
        data.rawContent = await fetchSVG(data.url)
      } catch (error) {
        console.error('Failed to fetch SVG content:', error)
        data.rawContent = null
      }
    } else {
      data.rawContent = null
    }
  }

  return data
}

export const media: CollectionConfig = {
  slug: COLLECTION_SLUG_MEDIA,
  upload: true,
  hooks: {
    beforeChange: [handleSVGUpload]
  },
  fields: [
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
