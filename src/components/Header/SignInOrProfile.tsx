import { hasAuthCookie } from '@/lib/auth/edge'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import ProfileMenu from './ProfileMenu'
import authConfig from '@/lib/auth/config'

const SignInOrProfile = () => {
  const isSignedIn = hasAuthCookie(headers())
  return (
    <div className="relative flex items-center gap-x-2">
      {!isSignedIn && (
        <>
          <Link
            className="rounded-full bg-zinc-800 px-3 py-1.5 font-medium text-white transition-all duration-300 hover:bg-zinc-300 dark:bg-white dark:text-black
              dark:hover:bg-zinc-200 sm:px-5 sm:py-2.5"
            href={authConfig?.pages?.newUser || '/sign-in'}>
            Try for free
          </Link>
          <Link
            className="rounded-full bg-zinc-200 px-3 py-1.5 font-medium text-black transition-all duration-300 hover:bg-zinc-300 dark:bg-zinc-800
              dark:text-white dark:hover:bg-zinc-700 sm:px-5 sm:py-2.5"
            href={authConfig?.pages?.signIn || '/sign-up'}>
            Sign in
          </Link>
        </>
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
