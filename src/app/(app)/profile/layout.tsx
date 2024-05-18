import Container from '@/components/Container'
import { getCurrentUser } from '@/lib/payload'
import { CreditCard, UserRound } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const ProfileMenu = [
  {
    label: 'Profile',
    path: '/profile',
    icon: <UserRound className="h-5 w-5" />
  },
  {
    label: 'Subscriptions',
    path: '/profile/subscriptions',
    icon: <CreditCard className="h-5 w-5" />
  }
]

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) return redirect('/sign-in')
  return (
    <Container>
      <div className="pb-10 pt-[100px]">
        <div className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-4">
          <nav>
            <ul className="flex gap-x-8 gap-y-2 dark:text-zinc-500 sm:flex-col">
              {ProfileMenu.map(({ label, path, icon }) => (
                <li key={label}>
                  <Link
                    href={path}
                    className="flex items-center gap-x-3 py-1.5 transition-all duration-300 ease-in-out hover:text-zinc-900 dark:hover:text-white">
                    {icon}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-3">{children}</div>
        </div>
      </div>
    </Container>
  )
}
