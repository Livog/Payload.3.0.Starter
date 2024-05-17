import { S3_PLUGIN_CONFIG } from '@/payload/plugins/s3'
import { CopyObjectCommand, CopyObjectCommandInput, HeadObjectCommand, S3Client, HeadObjectCommandOutput } from '@aws-sdk/client-s3'
import { CollectionAfterChangeHook } from 'payload/types'

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

const waitForObject = async (s3: S3Client, params: { Bucket: string; Key: string }, retries = MAX_RETRIES): Promise<HeadObjectCommandOutput> => {
  for (let i = 0; i < retries; i++) {
    try {
      const headCommand = new HeadObjectCommand(params)
      const headResult = await s3.send(headCommand)
      return headResult
    } catch (error: any) {
      if (error?.Code !== 'NoSuchKey') {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
    }
  }
  throw new Error(`Object ${params.Key} not found after ${MAX_RETRIES} retries`)
}

export const updateCacheControl: CollectionAfterChangeHook = async ({ doc, context }) => {
  if (context?.triggerAfterChange === false) return

  const s3 = new S3Client(S3_PLUGIN_CONFIG.config)

  const cacheControl = context.filenameHasContentHash ? 'public, max-age=31536000, immutable' : 'public, max-age=86400'

  const key = doc.prefix ? `${doc?.prefix}/${doc.filename}` : doc.filename

  console.log('addContentHashToFile', doc, key, `${S3_PLUGIN_CONFIG.bucket}/${key}`)

  const headParams = {
    Bucket: S3_PLUGIN_CONFIG.bucket,
    Key: key
  }

  try {
    const headResult = await waitForObject(s3, headParams)

    const optionalParams = ['ContentType', 'ContentLanguage', 'ContentEncoding', 'ContentDisposition'] as const

    const copyParams: CopyObjectCommandInput = optionalParams.reduce(
      (params, param) => {
        if (headResult[param] != null) {
          params[param] = headResult[param] as string
        }
        return params
      },
      {
        Bucket: S3_PLUGIN_CONFIG.bucket,
        CopySource: key,
        Key: key,
        MetadataDirective: 'REPLACE',
        CacheControl: cacheControl,
        Metadata: headResult.Metadata || {}
      } as CopyObjectCommandInput
    )

    const copyCommand = new CopyObjectCommand(copyParams)
    await s3.send(copyCommand)
  } catch (error: any) {
    if (error?.Code === 'NoSuchKey') {
      console.error('Error: The specified key does not exist:', key)
    } else {
      console.error('Error fetching object metadata or copying object:', error)
    }
  }
}
