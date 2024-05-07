import { COLLECTION_SLUG_MEDIA, COLLECTION_SLUG_PAGE, media, pages, sessions, users } from '@/payload/collections'
import { siteSettings } from '@/payload/globals/site-settings'
import generateBreadcrumbsUrl from '@/payload/utils/generateBreadcrumbsUrl'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage as s3StoragePlugin } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload/config'
import { en } from 'payload/i18n/en'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  editor: lexicalEditor(),
  globals: [siteSettings],
  collections: [users, pages, media, sessions],
  secret: process.env.AUTH_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || ''
  }),
  email: resendAdapter({
    defaultFromAddress: 'payload@livog.se',
    defaultFromName: 'Payload Admin',
    apiKey: process.env.AUTH_RESEND_KEY || ''
  }),
  i18n: {
    supportedLanguages: { en }
  },
  plugins: [
    nestedDocsPlugin({
      collections: [COLLECTION_SLUG_PAGE],
      generateURL: generateBreadcrumbsUrl
    }),
    s3StoragePlugin({
      collections: {
        [COLLECTION_SLUG_MEDIA]: {
          disableLocalStorage: true,
          generateFileURL: (args: any) => {
            return `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${process.env.NEXT_PUBLIC_S3_BUCKET}/${args.prefix}/${args.filename}`
          },
          prefix: 'media'
        }
      },
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET as string,
      acl: 'public-read',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
        }
      }
    })
  ],
  sharp
})
