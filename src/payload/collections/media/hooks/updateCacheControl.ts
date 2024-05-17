import { purgeCache } from '@/lib/cloudflare'
import { S3_PLUGIN_CONFIG } from '@/payload/plugins/s3'
import { CopyObjectCommand, CopyObjectCommandInput, HeadObjectCommand, HeadObjectCommandOutput, S3Client } from '@aws-sdk/client-s3'
import { CollectionAfterChangeHook } from 'payload/types'

const fetchObjectMetadata = async (s3: S3Client, key: string): Promise<HeadObjectCommandOutput | null> => {
  const headParams = {
    Bucket: S3_PLUGIN_CONFIG.bucket,
    Key: key
  }

  try {
    return await s3.send(new HeadObjectCommand(headParams))
  } catch (error) {
    console.error('Error fetching object metadata:', error)
    return null
  }
}

const updateCacheControlForKey = async (key: string, cacheControl: string) => {
  const s3 = new S3Client(S3_PLUGIN_CONFIG.config)
  try {
    const headResult = await fetchObjectMetadata(s3, key)
    if (!headResult) return

    const copyParams: CopyObjectCommandInput = {
      Bucket: S3_PLUGIN_CONFIG.bucket,
      CopySource: `${S3_PLUGIN_CONFIG.bucket}/${key}`,
      Key: key,
      MetadataDirective: 'REPLACE',
      ContentType: headResult.ContentType,
      Metadata: headResult.Metadata,
      CacheControl: cacheControl
    }

    const copyCommand = new CopyObjectCommand(copyParams)
    const copyResult = await s3.send(copyCommand)
    return copyResult
  } catch (error: any) {
    console.error('Error updating object metadata:', error)
    return null
  } finally {
    s3.destroy()
  }
}

export const updateCacheControl: CollectionAfterChangeHook = async ({ doc, context, req }) => {
  if (context?.triggerAfterChange === false) return

  const cacheControl = context.filenameHasContentHash ? 'public, max-age=31536000, immutable' : 'public, max-age=86400'
  const urlsToPurge = []
  const mainKey = doc.prefix ? `${doc.prefix}/${doc.filename}` : doc.filename
  await updateCacheControlForKey(mainKey, cacheControl)
  urlsToPurge.push(doc.url)

  // Sizes
  if (doc.sizes) {
    for (const sizeKey in doc.sizes) {
      if (doc.sizes.hasOwnProperty(sizeKey)) {
        const size = doc.sizes[sizeKey]
        const sizeFilename = size.filename
        const sizeKeyPath = doc.prefix ? `${doc.prefix}/${sizeFilename}` : sizeFilename
        await updateCacheControlForKey(sizeKeyPath, cacheControl)
        urlsToPurge.push(size.url)
      }
    }
  }
  await purgeCache(urlsToPurge)
}
