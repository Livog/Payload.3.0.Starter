'use client'

import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

import cn from '@/utils/cn'

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof SheetPrimitive.Overlay>) => (
  <SheetPrimitive.Overlay
    className={cn(
      `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50
      bg-black/80`,
      className
    )}
    ref={ref}
    {...props}
  />
)

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  `data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 border-zinc-700 bg-white p-6 shadow-lg transition ease-in-out
  data-[state=closed]:duration-300 data-[state=open]:duration-300 dark:bg-zinc-900`,
  {
    variants: {
      side: {
        top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b',
        bottom: 'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t',
        left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
        right: 'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm'
      }
    },
    defaultVariants: {
      side: 'right'
    }
  }
)

interface SheetCloseProps extends React.ComponentPropsWithRef<typeof SheetPrimitive.Close> {
  className?: string
  iconClassName?: string
}

const SheetClose = ({ className, iconClassName, ref, ...props }: SheetCloseProps) => (
  <SheetPrimitive.Close
    ref={ref}
    className={cn(
      `absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2
      focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-100 dark:ring-offset-zinc-950
      dark:focus:ring-zinc-300 dark:data-[state=open]:bg-zinc-800`,
      className
    )}
    {...props}>
    <X className={cn('h-4 w-4', iconClassName)} />
    <span className="sr-only">Close</span>
  </SheetPrimitive.Close>
)

SheetClose.displayName = SheetPrimitive.Close.displayName

interface SheetContentProps extends React.ComponentPropsWithRef<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants> {
  overlayClassName?: string
}

const SheetContent = ({ side = 'right', className, children, overlayClassName, ref, ...props }: SheetContentProps) => (
  <SheetPortal>
    <SheetOverlay className={cn(overlayClassName)} />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
)

SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
)
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof SheetPrimitive.Title>) => (
  <SheetPrimitive.Title ref={ref} className={cn('text-lg font-semibold text-zinc-950 dark:text-zinc-50', className)} {...props} />
)

SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = ({ className, ref, ...props }: React.ComponentPropsWithRef<typeof SheetPrimitive.Description>) => (
  <SheetPrimitive.Description ref={ref} className={cn('text-sm text-zinc-500 dark:text-zinc-400', className)} {...props} />
)

SheetDescription.displayName = SheetPrimitive.Description.displayName

export { Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription }
