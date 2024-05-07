import Link from 'next/link'
import type { FormattedMenuItem } from './Menu'
import cn from '@/utils/cn'
import ReactIcon from '@/components/ReactIcon'

const MenuItems = ({ items, isMain = true }: { items: FormattedMenuItem[]; isMain?: boolean }) => {
  return (
    <ul className="mb-3">
      {items.map((item, index) => {
        const hasSubMenu = item?.subMenuItems && item.subMenuItems.length > 0
        return (
          <li key={item.title || index} className="relative">
            {hasSubMenu || isMain ? (
              <Link
                href={item.path || '#'}
                className="text-md mb-1 flex w-full items-center py-2 text-zinc-500 transition-colors dark:hover:text-white">
                {item.title || 'No Title'}
              </Link>
            ) : (
              <Link
                className={cn(
                  `flex items-center gap-x-3 py-2 text-sm font-semibold text-black transition-all duration-300 ease-in-out hover:text-black
                  focus-visible:text-black dark:text-white dark:hover:text-white dark:focus-visible:text-white`
                )}
                href={item.path || '#'}>
                {item.icon && (
                  <ReactIcon
                    icon={item.icon}
                    className="h-[18px] w-[18px] text-zinc-400 transition-colors group-hover:text-black dark:text-zinc-500 dark:group-hover:text-white"
                  />
                )}
                {item.title || 'No Title'}
              </Link>
            )}
            {item?.subMenuItems && hasSubMenu && <MenuItems items={item?.subMenuItems} isMain={false} />}
          </li>
        )
      })}
    </ul>
  )
}

export default MenuItems
