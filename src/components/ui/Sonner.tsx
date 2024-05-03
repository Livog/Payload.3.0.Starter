'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast isolate bg-white dark:bg-zinc-950',
          description: 'text-zinc-500 dark:text-zinc-400',
          success: 'text-green-700 bg-[#e1f5e3] border-green-500/20 dark:text-green-400 dark:border-green-500/10 dark:bg-[#16241a]',
          error: 'text-red-700 bg-[#f7e8e8] border-red-500/20 dark:text-red-400 dark:border-red-500/10 dark:bg-[#2d1c1c]',
          warning: 'text-yellow-700 bg-[#fff9e8] border-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/10 dark:bg-[#2a2513]',
          info: 'text-blue-700 bg-[#e8f7ff] border-blue-500/20 dark:text-blue-400 dark:border-blue-500/10 dark:bg-[#172037]',
          actionButton: 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900',
          cancelButton: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
