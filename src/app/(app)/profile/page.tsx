import Container from '@/components/Container'
import ProfileForm from '@/components/ProfileForm'
import { getCurrentUser } from '@/lib/payload'
import { UserRound } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const ProfilePage = async () => {
  const authResult = await getCurrentUser()
  if (!authResult || !authResult?.user) return redirect('/sign-in')
  return (
    <Container>
      <div className="pb-10 pt-[100px]">
        <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-4">
          <div>
            <nav>
              <ul className="flex flex-col gap-y-2 dark:text-zinc-500">
                <li>
                  <Link
                    href="/profile"
                    className="flex items-center gap-x-2 transition-all duration-300 ease-in-out hover:text-zinc-900 dark:hover:text-white">
                    <UserRound className="h-5 w-5" />
                    Profile
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-span-3">
            <ProfileForm user={authResult?.user} />
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ProfilePage
