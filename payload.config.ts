import { COLLECTION_SLUG_MEDIA, COLLECTION_SLUG_PAGE, media, pages, sessions, users } from '@/payload/collections'
import { siteSettings } from '@/payload/globals/site-settings'
import generateBreadcrumbsUrl from '@/payload/utils/generateBreadcrumbsUrl'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage as s3StoragePlugin } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload/config'
import { en } from 'payload/i18n/en'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  globals: [siteSettings],
  collections: [users, pages, media, sessions],
  admin: {
    livePreview: {
      url: ({ data, locale }) => `${process.env.NEXT_PUBLIC_SITE_URL}/preview${data.path}${locale ? `?locale=${locale.code}` : ''}`,
      collections: [COLLECTION_SLUG_PAGE]
    }
  },
  cors: [process.env.NEXT_PUBLIC_S3_PUBLIC_URL || ''],
  csrf: [process.env.NEXT_PUBLIC_S3_PUBLIC_URL || ''],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()]
  }),
  secret: process.env.AUTH_SECRET || '',
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || ''
  }),
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  email:
    process.env.RESENT_DEFAULT_EMAIL && process.env.AUTH_RESEND_KEY
      ? resendAdapter({
          defaultFromAddress: process.env.RESENT_DEFAULT_EMAIL,
          defaultFromName: 'Payload Admin',
          apiKey: process.env.AUTH_RESEND_KEY || ''
        })
      : undefined,
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
    }),
    formBuilderPlugin({
      redirectRelationships: [COLLECTION_SLUG_PAGE],
      fields: {
        state: false
      }
    })
  ],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },
  sharp
})
