import { S3_PLUGIN_CONFIG } from '@/payload/plugins/s3'
import { CopyObjectCommand, CopyObjectCommandInput, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { CollectionAfterChangeHook } from 'payload/types'

export const updateCacheControl: CollectionAfterChangeHook = async ({ doc, context }) => {
  if (context?.triggerAfterChange === false) return

  const s3 = new S3Client(S3_PLUGIN_CONFIG.config)

  const cacheControl = context.filenameHasContentHash ? 'public, max-age=31536000, immutable' : 'public, max-age=86400'

  const key = doc.prefix ? `${doc?.prefix}/${doc.filename}` : doc.filename

  const headParams = {
    Bucket: S3_PLUGIN_CONFIG.bucket,
    Key: key
  }

  const headCommand = new HeadObjectCommand(headParams)

  try {
    const { ContentType, Metadata } = await s3.send(headCommand)

    const copyParams: CopyObjectCommandInput = {
      Bucket: S3_PLUGIN_CONFIG.bucket,
      CopySource: `${S3_PLUGIN_CONFIG.bucket}/${key}`,
      Key: key,
      Metadata,
      MetadataDirective: 'REPLACE',
      CacheControl: cacheControl,
      ContentType
    }

    const copyCommand = new CopyObjectCommand(copyParams)
    await s3.send(copyCommand)
  } catch (error) {
    console.error('Error fetching object metadata or copying object:', error)
  }
}
