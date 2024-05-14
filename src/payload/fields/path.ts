import { COLLECTION_SLUG_PAGE } from '@/payload/collections/config'
import generateBreadcrumbsUrl from '@/payload/utils/generateBreadcrumbsUrl'
import { getParents } from '@payloadcms/plugin-nested-docs'
import deepmerge from 'deepmerge'
import { APIError } from 'payload/errors'
import type { Field, Payload, Where } from 'payload/types'
import type { Config } from '~/payload-types'
import generateRandomString from '@/utils/generateRandomString'

type Collection = keyof Config['collections']
type WillPathConflictParams = {
  payload: Payload
  path: string
  originalDoc?: { id?: string }
  collection: Collection
  uniquePathFieldCollections?: Collection[]
}

export const willPathConflict = async ({
  payload,
  path,
  originalDoc,
  collection,
  uniquePathFieldCollections = []
}: WillPathConflictParams): Promise<boolean> => {
  if (!payload || !uniquePathFieldCollections.includes(collection)) return false

  const queries = uniquePathFieldCollections.map((targetCollection) => {
    const whereCondition: Where = {
      path: { equals: path }
    }
    if (originalDoc?.id && collection === targetCollection) {
      whereCondition.id = { not_equals: originalDoc.id }
    }

    return payload.find({
      collection: targetCollection,
      where: whereCondition,
      limit: 1,
      pagination: false
    })
  })

  const results = await Promise.allSettled(queries)
  return results.some((result) => result.status === 'fulfilled' && result.value.docs.length > 0)
}
type GetNewPathParams = {
  req: any
  collection: Collection
  currentDoc: any
  operation?: string
}

export async function getNewPath({ req, collection, currentDoc, operation }: GetNewPathParams): Promise<string> {
  const isAutoSave = operation === 'create' && currentDoc?._status === 'draft'
  if (isAutoSave || currentDoc?.slug == null || !collection) return `/${currentDoc?.id || generateRandomString(20)}`
  const newPath = currentDoc?.breadcrumbs?.at(-1)?.url
  if (newPath) return newPath
  const docs = await getParents(req, { parentFieldSlug: 'parent' } as any, collection as any, currentDoc, [currentDoc])

  return generateBreadcrumbsUrl(docs, currentDoc)
}

const pathField = (overrides?: Partial<Field>): Field =>
  deepmerge<Field, Partial<Field>>(
    {
      type: 'text',
      name: 'path',
      unique: true,
      index: true,
      hooks: {
        beforeChange: [
          async ({ collection, req, siblingData, originalDoc, operation }) => {
            const currentDoc = { ...originalDoc, ...siblingData }
            const newPath = await getNewPath({ req, collection: collection?.slug as Collection, currentDoc, operation })
            const isNewPathConflicting = await willPathConflict({
              payload: req.payload,
              path: newPath,
              originalDoc,
              collection: collection ? (collection.slug as Collection) : COLLECTION_SLUG_PAGE,
              uniquePathFieldCollections: [COLLECTION_SLUG_PAGE] // Add more collections as needed
            })

            if (isNewPathConflicting) {
              const error = new APIError(
                'This will create a conflict with an existing path.',
                400,
                [{ field: 'slug', message: 'This will create a conflict with an existing path.' }],
                false
              )
              throw error
            }
            return newPath
          }
        ]
      },
      admin: {
        position: 'sidebar',
        readOnly: true
      }
    },
    overrides || {}
  )

export default pathField
