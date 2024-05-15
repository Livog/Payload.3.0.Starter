import { media, pages, sessions, users } from '@/payload/collections'
import { COLLECTION_SLUG_MEDIA, COLLECTION_SLUG_PAGE } from '@/payload/collections/config'
import { siteSettings } from '@/payload/globals/site-settings'
import generateBreadcrumbsUrl from '@/payload/utils/generateBreadcrumbsUrl'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage as s3StoragePlugin } from '@payloadcms/storage-s3'
import { S3_PLUGIN_CONFIG } from '@/payload/plugins/s3'
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
  cors: [`${process.env.NEXT_PUBLIC_SITE_URL}` || ''],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || ''],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()]
  }),
  secret: process.env.AUTH_SECRET || '',
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || ''
  }),
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  email:
    process.env.RESEND_DEFAULT_EMAIL && process.env.AUTH_RESEND_KEY
      ? resendAdapter({
          defaultFromAddress: process.env.RESEND_DEFAULT_EMAIL,
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
      ...S3_PLUGIN_CONFIG,
      collections: {
        [COLLECTION_SLUG_MEDIA]: {
          disableLocalStorage: true,
          generateFileURL: (args: any) => {
            return `https://${process.env.NEXT_PUBLIC_S3_HOSTNAME}/${args.prefix}/${args.filename}`
          },
          prefix: process.env.NEXT_PUBLIC_UPLOAD_PREFIX || 'media'
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
