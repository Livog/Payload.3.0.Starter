import Container from '@/components/Container'
import getSiteSettings from '@/payload/utils/fetchSiteSettings'
import Logo from '@/public/logo.svg'
import Link from 'next/link'
import type { Page } from '~/payload-types'
import ProfileDropdown from './ProfileDropdown'
import { Suspense } from 'react'

const Header = async () => {
  ;('')
  const settings = await getSiteSettings()
  const menuItems = (settings?.menuItems || [])
    .filter(({ page }) => typeof page?.value === 'object')
    .map(({ page }) => ({ ...(typeof page?.value === 'object' ? page?.value : {}), collection: page?.relationTo })) as Page[]
  return (
    <header className="absolute top-0 z-50 w-full py-2 text-black dark:text-white">
      <Container className="flex items-center justify-between gap-x-3">
        <div className="relative flex w-1/4 flex-nowrap items-center gap-2 text-xl">
          <Logo className="w-14" />
          <h1 className="font-bold">{settings?.logo}</h1>
          <Link href="/" className="absolute inset-0">
            <span className="sr-only">Go to start page</span>
          </Link>
        </div>
        <div className="flex items-center justify-center max-sm:hidden md:w-2/4">
          <nav className="w-fit rounded-full backdrop-blur-sm">
            <ul className="flex gap-x-1.5 px-1.5 py-1 font-medium">
              {menuItems.map((page, index) => (
                <li key={index}>
                  <Link className="inline-flex rounded-full px-5 pt-2 pb-[7px] transition-all duration-300 hover:bg-white/10" href={page?.path || '#'}>
                    <span className="translate-y-[-1px]">{page?.title || ''}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex w-1/4 justify-end">
          <Suspense fallback={<div>Loading...</div>}>
            <ProfileDropdown />
          </Suspense>
        </div>
      </Container>
    </header>
  )
}

export default Header
