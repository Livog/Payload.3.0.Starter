import cn from '@/utils/cn'
import type { ComponentProps } from 'react'

export const Label = ({ children, className, ...props }: ComponentProps<'label'>) => (
  <label {...props} className={cn('mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400', className)}>
    {children}
  </label>
)
