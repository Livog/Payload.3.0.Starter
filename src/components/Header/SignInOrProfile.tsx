import { auth } from '@/lib/auth'
import Link from 'next/link'
import ProfileMenu from './ProfileMenu'
import { Suspense } from 'react'

const SignInOrProfile = async () => {
  const session = await auth()
  return (
    <div className="relative">
      {!session && (
        <Link
          className="rounded-full bg-zinc-200 px-5 py-3 font-medium text-black transition-all duration-300 hover:bg-zinc-300 dark:bg-zinc-800
            dark:text-white dark:hover:bg-zinc-700"
          href="/sign-in">
          Sign in
        </Link>
      )}
      {session?.user && <ProfileMenu user={session.user} />}
    </div>
  )
}

export default SignInOrProfile
