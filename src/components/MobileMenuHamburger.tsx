import cn from '@/utils/cn'
import type { ComponentProps } from 'react'

export const MobileMenuHamburger = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={cn('grid place-content-center gap-2', className)} {...props}>
      <span
        className="h-0.5 w-[22px] rounded-full bg-black transition-all duration-300 ease-in-out group-[[data-state='open']]:translate-y-[5px]
          group-[[data-state='open']]:rotate-45 dark:bg-white"></span>
      <span
        className="h-0.5 w-[22px] rounded-full bg-black transition-all duration-300 ease-in-out group-[[data-state='open']]:-translate-y-[5px]
          group-[[data-state='open']]:-rotate-45 dark:bg-white"></span>
    </div>
  )
}
