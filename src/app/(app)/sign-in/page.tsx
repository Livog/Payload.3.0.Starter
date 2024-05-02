import SignInForm from '@/components/SignInForm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const SignInPage = async () => {
  const session = await auth()
  if (session) return redirect('/')
  return (
    <div className="my-auto flex h-full justify-center pb-10 pt-[100px]">
      <SignInForm />
    </div>
  )
}

export default SignInPage
