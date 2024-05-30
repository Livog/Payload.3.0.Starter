import Blocks from '@/components/Blocks'
import { COLLECTION_SLUG_PAGE } from '@/payload/collections/config'
import { getDocument } from '@/payload/utils/getDocument'
import { generateMeta } from '@/utils/generateMeta'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type PageArgs = {
  params: {
    path: string[]
  }
}

export async function generateMetadata({ params }: PageArgs): Promise<Metadata> {
  const page = await getDocument({
    collection: COLLECTION_SLUG_PAGE,
    path: params.path,
    depth: 3
  })
  if (!page) notFound()

  return generateMeta(params?.path)
}

const Page = async ({ params }: PageArgs) => {
  const page = await getDocument({
    collection: COLLECTION_SLUG_PAGE,
    path: params.path,
    depth: 3
  })
  if (!page) notFound()
  return <Blocks blocks={page?.blocks} locale="en" />
}

export default Page
