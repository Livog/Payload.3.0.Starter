import type { s3Storage } from '@payloadcms/storage-s3'
export type S3StoragePlugin = Parameters<typeof s3Storage>[0]
export const S3_PLUGIN_CONFIG: S3StoragePlugin = {
  collections: {},
  bucket: process.env.S3_BUCKET!,
  acl: 'public-read',
  config: {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
    }
  }
}
