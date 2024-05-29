import { GenerateResetTokenForm, ResetPasswordForm } from '@/components/ResetPasswordForm'
import { unstable_noStore as noStore } from 'next/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ResetPasswordPage({ searchParams }: { searchParams: Record<string, string> }) {
  noStore()
  const token = searchParams?.token || null

  return <div className="my-auto flex h-full justify-center pb-10 pt-[100px]">{token ? <ResetPasswordForm token={token} /> : <GenerateResetTokenForm />}</div>
}
