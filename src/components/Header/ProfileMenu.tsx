import { SignOutButton } from '@/components/SignOutButton'
import { Avatar } from '@/components/ui/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu'
import { getCurrentUser } from '@/lib/payload'
import ArrowLeftOnRectangle from '@/public/icons/arrow-left-on-rectangle.svg'
import Cog8Tooth from '@/public/icons/cog-8-tooth.svg'
import Link from 'next/link'

const ProfileMenu = async () => {
  const user = await getCurrentUser()
  if (!user) return null
  const firstName = user?.name?.split(' ')[0]

  return (
    <div className="flex flex-row items-center gap-x-2">
      <DropdownMenu closeOnPathChange={true}>
        <DropdownMenuTrigger className="inline-flex items-center gap-x-2 p-2 text-base font-medium outline-none">
          <Avatar image={user?.imageUrl} name={String(user?.name || 'User')} className="h-7 w-7 dark:bg-zinc-700" /> {firstName}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[200px] origin-top-right" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <Link
              href="/profile"
              className="flex w-full items-center gap-x-2 px-2 py-2 text-zinc-500 transition-colors duration-300 ease-in-out hover:text-white">
              <Cog8Tooth className="w-5" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <SignOutButton className="flex w-full items-center gap-x-2 p-2 text-zinc-500 transition-colors duration-300 ease-in-out hover:text-white">
              <ArrowLeftOnRectangle className="w-5" />
              Sign Out
            </SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ProfileMenu
