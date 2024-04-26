import { auth, signIn, signOut } from '@/lib/auth'

const ProfileDropdown = async () => {
  const session = await auth()
  const firstName = session?.user?.name?.split(' ')[0]
  return (
    <div className="relative">
      {!session && (
        <form
          action={async () => {
            'use server'
            await signIn('github')
          }}>
          <button type="submit" className="rounded-full px-6 py-2 hover:cursor-pointer dark:bg-white dark:text-black">
            Sign in with GitHub
          </button>
        </form>
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
