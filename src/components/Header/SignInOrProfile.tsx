import { hasAuthCookie } from '@/lib/auth/edge'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Suspense } from 'react'
import { Skeleton } from '../ui/Skeleton'
import ProfileMenu from './ProfileMenu'

const SignInOrProfile = () => {
  const isSignedIn = hasAuthCookie(headers())
  return (
    <div className="relative">
      {!isSignedIn && (
        <Link
          className="rounded-full bg-zinc-200 px-5 py-3 font-medium text-black transition-all duration-300 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white
            dark:hover:bg-zinc-700"
          href="/sign-in">
          Sign in
        </Link>
      )}
      {isSignedIn ? (
        <Suspense
          fallback={
            <Skeleton className="h-9 w-28 px-3">
              <Skeleton className="h-6 w-6 rounded-full"></Skeleton>
            </Skeleton>
          }>
          <ProfileMenu />
        </Suspense>
      ) : null}
    </div>
  )
}

export default SignInOrProfile
