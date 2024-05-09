import PreviewBlocks from '@/components/PreviewBlocks'
import { getCurrentUser } from '@/lib/payload'
import fetchPage from '@/payload/utils/fetchPage'
import { unstable_noStore as noStore } from 'next/cache'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

const PreviewCatchAllPage = async ({ params }: { params: { path: string[] } }) => {
  draftMode().enable()
  noStore()
  const user = await getCurrentUser()
  if (!user) notFound()
  const page = await fetchPage(params.path)
  return <PreviewBlocks initialData={page} locale="en" />
}

export default PreviewCatchAllPage
