import Blocks from '@/components/Blocks'
import { COLLECTION_SLUG_PAGE } from '@/payload/collections/config'
import { getCachedDocument } from '@/payload/utils/document'
import { notFound } from 'next/navigation'

export const revalidate = 7200

const Page = async ({ params }: { params: { path: string[] } }) => {
  const page = await getCachedDocument(COLLECTION_SLUG_PAGE, params.path, 3)
  if (!page) notFound()
  return <Blocks blocks={page?.blocks} locale="en" />
}

export default Page
