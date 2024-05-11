import * as React from 'react'

import cn from '@/utils/cn'

export interface TextareaProps extends React.ComponentPropsWithRef<'textarea'> {}

const Textarea = ({ className, ref, ...props }: TextareaProps) => {
  return (
    <textarea
      className={cn(
        `flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-[box-shadow] duration-300 ease-in-out
        placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700
        dark:bg-zinc-800 dark:ring-blue-500/80 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-500`,
        className
      )}
      ref={ref}
      {...props}
    />
  )
}

Textarea.displayName = 'Textarea'

export { Textarea }
