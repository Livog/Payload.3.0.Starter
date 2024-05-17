import { CollectionAfterChangeHook } from 'payload/types'
import { COLLECTION_SLUG_MEDIA } from '@/payload/collections/config'

const fetchSVG = async (url: string): Promise<string> => {
  const response = await fetch(url)
  return response.text()
}

export const handleSvgUpload: CollectionAfterChangeHook = async ({ doc, context, req }) => {
  if (context?.triggerAfterChange === false || !doc.mimeType.includes('image/svg') || !doc.url) return
  const { payload } = req
  doc.rawContent = null
  try {
    doc.rawContent = await fetchSVG(doc.url)
  } catch (error) {
    console.error('Failed to fetch SVG content:', error)
  }
  context.triggerAfterChange = false
  await payload.update({
    collection: COLLECTION_SLUG_MEDIA,
    id: doc.id,
    data: doc,
    context
  })
}
