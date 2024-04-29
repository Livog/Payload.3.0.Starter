import { auth, signOut } from '@/lib/auth'
import Link from 'next/link'

const ProfileDropdown = async () => {
  const session = await auth()
  const firstName = session?.user?.name?.split(' ')[0]
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
      {session?.user && (
        <div className="flex items-center gap-x-2">
          <p>Hello {firstName}</p>
          <form
            action={async () => {
              'use server'
              await signOut()
            }}>
            <button type="submit" className="rounded-full px-3 py-1.5 text-sm font-medium dark:bg-white dark:text-black">
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
