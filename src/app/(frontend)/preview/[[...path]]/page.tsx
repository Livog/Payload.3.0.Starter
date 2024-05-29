import PreviewBlocks from '@/components/PreviewBlocks'
import { getCurrentUser } from '@/lib/payload'
import { COLLECTION_SLUG_PAGE } from '@/payload/collections/config'
import { getDocument } from '@/payload/utils/getDocument'
import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'

const PreviewCatchAllPage = async ({ params }: { params: { path: string[] } }) => {
  noStore()
  const [user, page] = await Promise.all([
    getCurrentUser(),
    getDocument({
      collection: COLLECTION_SLUG_PAGE,
      path: params.path,
      depth: 3,
      cache: false
    })
  ])
  if (!user || !page) notFound()
  return <PreviewBlocks initialData={page} locale="en" />
}

export default PreviewCatchAllPage
