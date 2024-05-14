import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionBeforeOperationHook, CollectionConfig } from 'payload/types'
import { COLLECTION_SLUG_MEDIA } from './config'

const addContentHashToFile: CollectionBeforeOperationHook = async ({ req, operation, args, context }) => {
  if (!['create', 'update'].includes(operation) || !req.file || !req.file.data || !(req.file.data instanceof Buffer) || context?.triggerAfterChange === false)
    return

  const hash = await hashBuffer(req.file.data)
  const fileNameParts = req.file.name.split('.')

  const extension = fileNameParts.length > 1 ? fileNameParts.pop() : ''
  const nameWithoutExtension = fileNameParts.join('.')

  req.file.name = `${nameWithoutExtension}-${hash}${extension ? `.${extension}` : ''}`
  args.data.title = `${nameWithoutExtension}${extension ? `.${extension}` : ''}`
}

async function fetchSVG(url: string): Promise<string> {
  const response = await fetch(url)
  return response.text()
}

async function hashBuffer(buffer: Buffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

const handleSVGUpload: CollectionAfterChangeHook = async ({ doc, context, req }) => {
  if (context?.triggerAfterChange === false) {
    return
  }
  const { payload } = req
  doc.rawContent = null
  if (doc.mimeType.includes('image/svg') && doc.url) {
    try {
      doc.rawContent = await fetchSVG(doc.url)
    } catch (error) {
      console.error('Failed to fetch SVG content:', error)
    }
  }
  context.triggerAfterChange = false
  await payload.update({
    collection: COLLECTION_SLUG_MEDIA,
    id: doc.id,
    data: doc,
    context
  })
}

export const media: CollectionConfig = {
  slug: COLLECTION_SLUG_MEDIA,
  upload: true,
  admin: {
    useAsTitle: 'title'
  },
  hooks: {
    beforeOperation: [addContentHashToFile],
    afterChange: [handleSVGUpload]
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
