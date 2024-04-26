import { COLLECTION_SLUG_PAGE } from '@/payload/collections/pages'
import generateBreadcrumbsUrl from '@/payload/utils/generateBreadcrumbsUrl'
import { getParents } from '~/node_modules/@payloadcms/plugin-nested-docs/dist/utilities/getParents'
import deepmerge from 'deepmerge'
import { APIError } from 'payload/errors'
import type { Field, Payload } from 'payload/types'

export const willPathConflict = async ({
  payload,
  path,
  currentDocId,
  currentCollection,
  collectionsToCheck = []
}: {
  payload: Payload
  path: string
  currentDocId?: string
  currentCollection: string
  collectionsToCheck?: string[]
}) => {
  if (!payload || collectionsToCheck.length === 0) return false

  const queries = collectionsToCheck.map((collection) => {
    const whereCondition: any = {
      path: {
        equals: path
      }
    }
    if (currentDocId && currentCollection === collection) {
      whereCondition.id = { not_equals: currentDocId }
    }

    return payload.find({
      // @ts-ignore
      collection,
      where: whereCondition,
      limit: 1
    })
  })

  const results = await Promise.allSettled(queries)
  return results.some((result) => result.status === 'fulfilled' && result.value.docs.length > 0)
}

const pathField = (overrides?: Partial<Field>): Field =>
  deepmerge<Field, Partial<Field>>(
    {
      type: 'text',
      name: 'path',
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [
          async ({ collection, req, value, siblingData, originalDoc, operation }) => {
            const { payload } = req
            if (!payload) return value // If not serverside exist
            const currentDoc = { ...originalDoc, ...siblingData }
            const docs = await getParents(
              req,
              // @ts-ignore
              { parentFieldSlug: 'parent' },
              collection,
              currentDoc,
              [currentDoc]
            )

            const updatedPath = generateBreadcrumbsUrl(docs, currentDoc)
            const isNewPathConflicting = await willPathConflict({
              payload,
              path: updatedPath,
              currentDocId: currentDoc.id,
              currentCollection: collection ? collection.slug : COLLECTION_SLUG_PAGE,
              collectionsToCheck: [COLLECTION_SLUG_PAGE] // Add more collections as needed
            })

            if (isNewPathConflicting) {
              const error = new APIError(
                'This will create a conflict with an existing path.',
                400,
                [
                  {
                    field: 'slug',
                    message: 'This will create a conflict with an existing path.'
                  }
                ],
                false
              )
              throw error
            }
            return updatedPath
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
