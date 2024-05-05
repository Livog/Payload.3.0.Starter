import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/Drawer'
import getSiteSettings from '@/payload/utils/fetchSiteSettings'
import { ChevronDown, XIcon } from 'lucide-react'
import Link from 'next/link'
import type { Config, SiteSetting } from '~/payload-types'
import { MobileMenuHamburger } from '../MobileMenuHamburger'
import MenuItems from './MenuItems'

type MenuItem = NonNullable<SiteSetting['header']['menuItems']>[number]
type Page = NonNullable<MenuItem['page']>['value'] extends infer P ? (P extends { id: string } ? P : never) : never
type Collection = keyof Config['collections']

export type FormattedMenuItem = Page & {
  collection: Collection
  subMenuItems?: FormattedMenuItem[]
}

const formatMenuItems = (menuItems: SiteSetting['header']['menuItems']): FormattedMenuItem[] => {
  return (menuItems || []).flatMap((menuItem): FormattedMenuItem[] => {
    const formatted: FormattedMenuItem[] = []
    if (menuItem.page && typeof menuItem.page.value === 'object') {
      const pageValue = menuItem?.page?.value as Page
      const newMenuItem: FormattedMenuItem = {
        ...pageValue,
        collection: menuItem.page.relationTo
      }
      if (menuItem.subMenuItems) {
        newMenuItem.subMenuItems = formatMenuItems(menuItem.subMenuItems)
      }
      formatted.push(newMenuItem)
    }

    return formatted
  })
}

export const Menu = async () => {
  const settings = await getSiteSettings()
  const menuItems = formatMenuItems(settings?.header?.menuItems)
  return (
    <>
      <Drawer direction="right" closeOnPathChange fixed>
        <DrawerTrigger asChild className="group block h-10 w-10 outline-none md:hidden">
          <MobileMenuHamburger />
        </DrawerTrigger>
        <DrawerContent showBar={false} className="left-auto right-0 top-0 mt-0 w-[350px] max-w-full rounded-none">
          <DrawerClose className="absolute right-3 top-3 z-50 rounded-sm text-white ring-offset-white focus:outline-none focus:ring-2">
            <XIcon className="h-7 w-7" />
          </DrawerClose>
          <div className="mx-auto h-screen w-full overflow-y-auto overflow-x-hidden p-5">
            <MenuItems items={menuItems} />
          </div>
        </DrawerContent>
      </Drawer>
      <nav className="max-md:hidden">
        <ul className="flex flex-nowrap gap-x-2">
          {menuItems.map((item, index: number) => (
            <li key={item.title || index} className="group relative">
              <Link
                className="flex items-center gap-x-2 rounded-lg px-3 py-2 font-medium outline-none ring-blue-500/80 transition-all duration-300
                  hover:bg-black/20 focus-visible:ring-2 dark:hover:bg-white/10"
                href={item.path || '#'}>
                {item.title || 'No Title'}
                {item.subMenuItems && item.subMenuItems.length > 0 && <ChevronDown className="h-4 w-4" />}
              </Link>
              {item.subMenuItems && item.subMenuItems.length > 0 && (
                <ul
                  className="invisible absolute left-0 top-full mt-2 flex w-fit origin-left translate-y-1 flex-col gap-y-1 rounded-lg border p-1
                    opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100
                    group-focus:visible group-focus:translate-y-0 group-focus:opacity-100 group-[:not(:hover)]:delay-300 dark:border-zinc-700
                    dark:bg-zinc-800 md:w-[200px] md:origin-top-right">
                  {item.subMenuItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        className="block w-full rounded-md px-3 py-2 font-medium transition-all duration-300 hover:bg-black/20 dark:hover:bg-white/10"
                        href={subItem.path || '#'}>
                        {subItem.title || 'No Title'}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
