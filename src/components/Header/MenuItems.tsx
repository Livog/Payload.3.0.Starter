'use client'

import Link from 'next/link'
import type { FormattedMenuItem } from './Menu'
import { usePathname } from 'next/navigation'
import cn from '@/utils/cn'

const MenuItems = ({ items }: { items: FormattedMenuItem[] }) => {
  const currentPath = usePathname()
  return (
    <ul>
      {items.map((item, index) => (
        <li key={item.title || index} className="relative">
          <Link
            className={cn(
              `flex items-center gap-x-2 px-3 py-2 text-lg font-semibold text-zinc-500 transition-all duration-300 ease-in-out hover:text-black
              focus-visible:text-black dark:text-zinc-500 dark:hover:text-white dark:focus-visible:text-white`,
              currentPath === item.path && 'text-black dark:text-white'
            )}
            href={item.path || '#'}>
            {item.title || 'No Title'}
          </Link>
          {item.subMenuItems && item.subMenuItems.length > 0 && (
            <div className="ml-3 border-l pl-2 dark:border-zinc-700">
              <MenuItems items={item.subMenuItems} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default MenuItems
