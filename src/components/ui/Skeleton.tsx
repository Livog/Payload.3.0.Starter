import cn from '@/utils/cn'
import type { ComponentProps } from 'react'

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800', className)} {...props} />
}

export { Skeleton }
