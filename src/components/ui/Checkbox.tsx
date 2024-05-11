'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import cn from '@/utils/cn'

export type CheckboxProps = React.ComponentPropsWithRef<typeof CheckboxPrimitive.Root>

const Checkbox = ({ className, type, ref, ...props }: CheckboxProps) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      `peer h-5 w-5 shrink-0 rounded-md border border-zinc-300 bg-zinc-100 transition-[box-shadow] duration-300 ease-in-out focus-visible:outline-none
      focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-zinc-900
      data-[state=checked]:text-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:ring-offset-zinc-950 dark:focus-visible:ring-blue-500/80
      dark:data-[state=checked]:bg-zinc-50 dark:data-[state=checked]:text-zinc-900`,
      className
    )}
    {...props}>
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)

Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
