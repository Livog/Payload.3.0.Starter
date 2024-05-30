import { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import { notFound } from 'next/navigation'
import { getDocument } from '@/payload/utils/getDocument'
import { COLLECTION_SLUG_PAGE } from '@/payload/collections/config'
import _get from 'lodash/get'

type Params = {
  path: string[]
}

export const dynamic = 'force-dynamic'

const defaultTitle = 'Payload SaaS Starter'
const defaultDescription = 'An open-source website built with Payload and Next.js.'

const weights = {
  100: 'Inter-Thin.ttf',
  200: 'Inter-ExtraLight.ttf',
  300: 'Inter-Light.ttf',
  400: 'Inter-Regular.ttf',
  500: 'Inter-Medium.ttf',
  600: 'Inter-SemiBold.ttf',
  700: 'Inter-Bold.ttf',
  800: 'Inter-ExtraBold.ttf',
  900: 'Inter-Black.ttf'
} as const

const size = {
  width: 1200,
  height: 630
}

const getInterWeight = async (weight: keyof typeof weights) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/fonts/inter/${weights[weight]}`)
    const interSemiBold = await response.arrayBuffer()

    return interSemiBold
  } catch (error) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/fonts/inter/${weights[400]}`)
    const interSemiBold = await response.arrayBuffer()
    return interSemiBold
  }
}

export const GET = async (request: NextRequest, { params: { path } }: { params: Params }) => {
  if (path.at(-1) !== 'image.jpg') notFound()
  const docPath = path.slice(0, -1)
  const page = await getDocument({
    collection: COLLECTION_SLUG_PAGE,
    path: docPath,
    depth: 1
  })

  const metaTitle = _get(page, 'meta.title', null)
  const pageTitle = _get(page, 'title', null)
  const title = metaTitle || pageTitle || defaultTitle
  return new ImageResponse(
    (
      <div
        style={{
          color: '#fff',
          backgroundColor: '#161616',
          backgroundImage: `url(${process.env.NEXT_PUBLIC_SITE_URL}/images/bg-pattern.svg)`,
          width: '100%',
          height: '100%',
          padding: 32,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          flexDirection: 'column'
        }}>
        <h1 style={{ fontSize: 82, lineHeight: 0.8, marginBottom: 10 }}>{title}</h1>
        <p style={{ fontSize: 32, maxWidth: '50%' }}>{_get(page, 'meta.description', defaultDescription)}</p>
      </div>
    ),
    {
      ...size,
      headers: {
        'Content-Type': 'image/jpeg'
      },
      fonts: [
        {
          name: 'Inter',
          data: await getInterWeight(400),
          style: 'normal',
          weight: 400
        },
        {
          name: 'Inter',
          data: await getInterWeight(700),
          style: 'normal',
          weight: 700
        }
      ]
    }
  )
}
