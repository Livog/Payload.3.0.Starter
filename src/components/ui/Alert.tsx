import React from 'react'
import cn from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const alertStyles = cva(['block rounded-md p-3 text-sm transition-all duration-300 ease-in-out'], {
  variants: {
    color: {
      red: 'bg-red-500 text-red-400 hover:bg-red-500/20 dark:bg-red-500/10',
      yellow: 'bg-yellow-400 text-yellow-700 hover:bg-yellow-400/20 dark:bg-[#383119] dark:text-[#FDE047]',
      green: 'bg-green-500 text-green-700 hover:bg-green-500/20 dark:bg-green-500/10 dark:text-green-600',
      blue: 'bg-blue-500 text-blue-700 hover:bg-blue-500/20 dark:bg-blue-500/10'
    }
  },
  defaultVariants: {
    color: 'blue'
  }
})

type AlertProps = React.ComponentPropsWithoutRef<'div'> & VariantProps<typeof alertStyles>

export function Alert({ color, className, children, ...props }: AlertProps) {
  return (
    <div {...props} className={cn(alertStyles({ color }), className)}>
      <p>{children}</p>
    </div>
  )
}
