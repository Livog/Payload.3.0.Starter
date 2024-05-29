import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/components/ui/Drawer'
import { getCachedGlobal } from '@/payload/utils/getGlobal'
import cn from '@/utils/cn'
import { ChevronDown, XIcon } from 'lucide-react'
import Link from 'next/link'
import type { Config, HeaderMenu } from '~/payload-types'
import { MobileMenuHamburger } from '@/components/MobileMenuHamburger'
import ReactIcon from '@/components/ReactIcon'
import MenuItems from './MenuItems'
import { GLOBAL_SETTINGS_SLUG } from '@/payload/globals/config'

type MenuItem = NonNullable<HeaderMenu>[number]
type Page = NonNullable<MenuItem['page']>['value'] extends infer P ? (P extends { id: string } ? P : never) : never
type Collection = keyof Config['collections']

export type FormattedMenuItem = Page & {
  collection: Collection
  icon?: string
  description?: string
  subMenuItems?: FormattedMenuItem[]
}

const formatMenuItems = (menuItems: HeaderMenu): FormattedMenuItem[] => {
  return (menuItems || []).flatMap((menuItem): FormattedMenuItem[] => {
    const formatted: FormattedMenuItem[] = []
    if (menuItem.page && typeof menuItem.page.value === 'object') {
      const pageValue = menuItem?.page?.value as Page
      const newMenuItem: FormattedMenuItem = {
        ...pageValue,
        icon: menuItem?.icon || undefined,
        description: menuItem?.description || undefined,
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
  const settings = await getCachedGlobal(GLOBAL_SETTINGS_SLUG)
  const menuItems = formatMenuItems(settings?.header?.menuItems || [])
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
          <div className="mx-auto h-screen w-full overflow-y-auto overflow-x-hidden px-5 py-10">
            <MenuItems items={menuItems} />
          </div>
        </DrawerContent>
      </Drawer>
      <nav className="max-md:hidden">
        <ul className="flex flex-nowrap gap-x-2">
          {menuItems.map((item, index: number) => (
            <li key={item.title || index} className="group relative">
              <Link
                className="flex items-center gap-x-2 rounded-lg px-3 py-2 font-medium outline-none ring-blue-500/80 transition-all duration-300 hover:bg-black/5
                  focus-visible:ring-2 dark:hover:bg-white/10"
                href={item.path || '#'}>
                {item.title || 'No Title'}
                {item.subMenuItems && item.subMenuItems.length > 0 && <ChevronDown className="h-4 w-4" />}
              </Link>
              {item.subMenuItems && item.subMenuItems.length > 0 && (
                <ul
                  className={cn(
                    `invisible absolute left-0 top-full mt-2 grid w-fit origin-top scale-95 auto-rows-[minmax(0,1fr)] grid-cols-[repeat(2,minmax(250px,1fr))]
                    gap-1 rounded-xl border bg-zinc-100 p-1 opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:scale-100
                    group-hover:opacity-100 group-focus:visible group-focus:scale-100 group-focus:opacity-100 group-[&:has(>a:focus-visible)]:visible
                    group-[&:has(>a:focus-visible)]:scale-100 group-[&:has(>a:focus-visible)]:opacity-100 group-[:not(:hover)]:delay-300 dark:border-zinc-700
                    dark:bg-zinc-800 md:origin-top-right`
                  )}>
                  {item.subMenuItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        className="group/item flex w-full items-center gap-x-2 rounded-lg px-3 py-2 font-semibold transition-all duration-300 hover:bg-black/5
                          dark:hover:bg-black/25"
                        href={subItem.path || '#'}>
                        {subItem.icon && (
                          <div className="inline-flex h-8 w-8 items-center justify-center">
                            <ReactIcon
                              icon={subItem.icon}
                              className="h-[22px] w-[22px] text-zinc-400 transition-colors group-hover/item:text-black dark:text-zinc-500
                                dark:group-hover/item:text-white"
                            />
                          </div>
                        )}
                        <div className="inline-flex flex-col space-y-0.5">
                          <span className="text-[13px]">{subItem.title || 'No Title'}</span>
                          {subItem?.description && (
                            <span
                              className="text-[13px] text-zinc-400 transition-colors group-hover/item:text-black dark:text-zinc-500
                                dark:group-hover/item:text-white">
                              {subItem?.description}
                            </span>
                          )}
                        </div>
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
