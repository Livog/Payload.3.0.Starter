import * as React from 'react'
import cn from '@/utils/cn'

export interface InputProps extends React.ComponentPropsWithRef<'input'> {}

const Input = ({ className, type, ref, ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={cn(
        `flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-300 ease-in-out
        file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-950
        disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:ring-blue-500/80 dark:ring-offset-zinc-950
        dark:placeholder:text-zinc-500`,
        className
      )}
      ref={ref}
      {...props}
    />
  )
}

Input.displayName = 'Input'

export { Input }
