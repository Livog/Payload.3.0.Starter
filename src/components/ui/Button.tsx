import cn from '@/utils/cn'
import type { ComponentProps } from 'react'

export const Button = ({ children, className, ...props }: ComponentProps<'button'>) => (
  <button
    className={cn(
      `flex flex-auto items-center justify-center gap-x-2 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-3 text-sm font-medium text-black
      !outline-none ring-0 ring-blue-500/80 transition-all duration-300 ease-in-out hover:bg-zinc-200 focus:ring-2 dark:bg-white dark:text-black
      dark:hover:opacity-90`,
      className
    )}
    {...props}>
    {children}
  </button>
)
