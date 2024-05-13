import Blocks from '@/components/Blocks'
import fetchPage from '@/payload/utils/fetchPage'

export const revalidate = 7200

const Page = async ({ params }: { params: { path: string[] } }) => {
  const page = await fetchPage(params.path)
  return <Blocks blocks={page?.blocks} locale="en" />
}

export default Page
