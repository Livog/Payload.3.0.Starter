import cn from '@/utils/cn'
import type { ComponentProps } from 'react'

export const Input = ({ className, ...props }: ComponentProps<'input'>) => (
  <input
    {...props}
    className={cn(
      `mb-5 block w-full rounded-md border border-zinc-200 px-3 py-2 text-zinc-900 placeholder-zinc-500 !outline-none ring-0 ring-blue-500/80
      transition-all duration-300 ease-in-out placeholder:text-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white
      dark:placeholder-zinc-600`,
      className
    )}
  />
)
