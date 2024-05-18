import cn from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

const badge = cva(['inline-flex items-center gap-x-1.5 px-1.5 py-0.5 text-xs/5 font-medium transition-all duration-300 ease-in-out forced-colors:outline'], {
  variants: {
    color: {
      red: '',
      orange: '',
      amber: '',
      yellow: '',
      lime: '',
      green: '',
      emerald: '',
      teal: '',
      cyan: '',
      sky: '',
      blue: '',
      indigo: '',
      violet: '',
      purple: '',
      fuchsia: '',
      pink: '',
      rose: '',
      zinc: '',
      light: ''
    },
    size: {
      xs: 'text-xs sm:text-sm',
      sm: 'sm:text-md text-sm',
      md: 'text-md sm:text-lg',
      lg: 'text-lg sm:text-lg'
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm ',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full'
    },
    duotone: {
      true: ''
    },
    variant: {
      solid: '',
      duotone: '',
      outline: 'border'
    }
  },
  compoundVariants: [
    { variant: 'outline', color: 'red', className: 'border-red-500 dark:border-red-500/50' },
    { variant: 'outline', color: 'orange', className: 'border-orange-500 dark:border-orange-500/50' },
    { variant: 'outline', color: 'amber', className: 'border-amber-400 dark:border-amber-400/50' },
    { variant: 'outline', color: 'yellow', className: 'border-yellow-400 dark:border-yellow-400/50' },
    { variant: 'outline', color: 'lime', className: 'border-lime-400 dark:border-lime-400/50' },
    { variant: 'outline', color: 'green', className: 'border-green-500 dark:border-green-500/50' },
    { variant: 'outline', color: 'emerald', className: 'border-emerald-500 dark:border-emerald-500/50' },
    { variant: 'outline', color: 'teal', className: 'border-teal-500 dark:border-teal-500/50' },
    { variant: 'outline', color: 'cyan', className: 'border-cyan-400 dark:border-cyan-400/50' },
    { variant: 'outline', color: 'sky', className: 'border-sky-500 dark:border-sky-500/50' },
    { variant: 'outline', color: 'blue', className: 'border-blue-500 dark:border-blue-500/50' },
    { variant: 'outline', color: 'indigo', className: 'border-indigo-500 dark:border-indigo-500/50' },
    { variant: 'outline', color: 'violet', className: 'border-violet-500 dark:border-violet-500/50' },
    { variant: 'outline', color: 'purple', className: 'border-purple-500 dark:border-purple-500/50' },
    { variant: 'outline', color: 'fuchsia', className: 'border-fuchsia-400 dark:border-fuchsia-400/50' },
    { variant: 'outline', color: 'pink', className: 'border-pink-400 dark:border-pink-400/50' },
    { variant: 'outline', color: 'rose', className: 'border-rose-400 dark:border-rose-400/50' },
    { variant: 'outline', color: 'zinc', className: 'border-zinc-600 dark:border-white/50' },
    { variant: 'outline', color: 'light', className: 'border-zinc-800 dark:border-zinc-100/15' },
    // Solid variants
    { variant: 'solid', color: 'red', className: 'bg-red-500 text-white dark:bg-red-500' },
    { variant: 'solid', color: 'orange', className: 'bg-orange-500 dark:bg-orange-500' },
    { variant: 'solid', color: 'amber', className: 'bg-amber-400 dark:bg-amber-400' },
    { variant: 'solid', color: 'yellow', className: 'bg-yellow-400 text-black dark:bg-yellow-400' },
    { variant: 'solid', color: 'lime', className: 'bg-lime-400 text-black dark:bg-lime-400' },
    { variant: 'solid', color: 'green', className: 'bg-green-500 dark:bg-green-500' },
    { variant: 'solid', color: 'emerald', className: 'bg-emerald-500 dark:bg-emerald-500' },
    { variant: 'solid', color: 'teal', className: 'bg-teal-500 dark:bg-teal-500' },
    { variant: 'solid', color: 'cyan', className: 'bg-cyan-400 text-black dark:bg-cyan-400' },
    { variant: 'solid', color: 'sky', className: 'bg-sky-500 dark:bg-sky-500' },
    { variant: 'solid', color: 'blue', className: 'bg-blue-500 dark:bg-blue-500' },
    { variant: 'solid', color: 'indigo', className: 'bg-indigo-500 dark:bg-indigo-500' },
    { variant: 'solid', color: 'violet', className: 'bg-violet-500 dark:bg-violet-500' },
    { variant: 'solid', color: 'purple', className: 'bg-purple-500 dark:bg-purple-500' },
    { variant: 'solid', color: 'fuchsia', className: 'bg-fuchsia-400 dark:bg-fuchsia-400' },
    { variant: 'solid', color: 'pink', className: 'bg-pink-400 dark:bg-pink-400' },
    { variant: 'solid', color: 'rose', className: 'bg-rose-400 dark:bg-rose-400' },
    { variant: 'solid', color: 'zinc', className: 'bg-zinc-600 text-black dark:bg-white' },
    { variant: 'solid', color: 'light', className: 'bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-200' },
    // Duotone variants

    { duotone: true, color: 'red', className: 'bg-red-500/15 text-red-700 dark:bg-red-500/10 dark:text-red-400' },
    { duotone: true, color: 'orange', className: 'bg-orange-500/15 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' },
    { duotone: true, color: 'amber', className: 'bg-amber-400/15 text-amber-400 dark:bg-amber-400/10 dark:text-amber-400' },
    { duotone: true, color: 'yellow', className: 'bg-yellow-400/15 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-400' },
    { duotone: true, color: 'lime', className: 'bg-lime-400/15 text-lime-700 dark:bg-lime-400/10 dark:text-lime-400' },
    { duotone: true, color: 'green', className: 'bg-green-500/15 text-green-700 dark:bg-green-500/10 dark:text-green-400' },
    { duotone: true, color: 'emerald', className: 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
    { duotone: true, color: 'teal', className: 'bg-teal-500/15 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400' },
    { duotone: true, color: 'cyan', className: 'bg-cyan-400/15 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-400' },
    { duotone: true, color: 'sky', className: 'bg-sky-500/15 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400' },
    { duotone: true, color: 'blue', className: 'bg-blue-500/15 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
    { duotone: true, color: 'indigo', className: 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' },
    { duotone: true, color: 'violet', className: 'bg-violet-500/15 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400' },
    { duotone: true, color: 'purple', className: 'bg-purple-500/15 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' },
    { duotone: true, color: 'fuchsia', className: 'bg-fuchsia-400/15 text-fuchsia-700 dark:bg-fuchsia-400/10 dark:text-fuchsia-400' },
    { duotone: true, color: 'pink', className: 'bg-pink-400/15 text-pink-700 dark:bg-pink-400/10 dark:text-pink-400' },
    { duotone: true, color: 'rose', className: 'bg-rose-400/15 text-rose-700 dark:bg-rose-400/10 dark:text-rose-400' },
    { duotone: true, color: 'zinc', className: 'bg-zinc-600/10 text-zinc-700 dark:bg-white/10 dark:text-zinc-400' },
    { duotone: true, color: 'light', className: 'bg-zinc-100/10 text-zinc-700 dark:text-zinc-400' }
  ],
  defaultVariants: {
    color: 'light',
    size: 'md',
    rounded: 'md',
    variant: 'solid'
  }
})

export type BadgeProps = React.ComponentPropsWithoutRef<'span'> & {} & VariantProps<typeof badge>

export function Badge({ color = 'zinc', className, variant, size, rounded, duotone, ...props }: BadgeProps) {
  return <span {...props} className={cn(badge({ color, variant, size, rounded, duotone }), className)} />
}
