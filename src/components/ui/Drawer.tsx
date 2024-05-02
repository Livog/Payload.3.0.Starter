'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'
import { usePathname } from 'next/navigation'

import cn from '@/utils/cn'

type DrawerRootProps = React.ComponentProps<typeof DrawerPrimitive.Root> & {
  closeOnPathChange?: boolean
}

const Drawer = ({ shouldScaleBackground = true, closeOnPathChange = false, ...props }: DrawerRootProps) => {
  const [isOpen, setIsOpen] = React.useState(props.open ?? false)
  const pathname = usePathname()

  React.useEffect(() => {
    if (closeOnPathChange) setIsOpen(false)
  }, [pathname, closeOnPathChange])

  const handleOpenChange = (open: boolean) => {
    if (props.onOpenChange) props.onOpenChange(open)
    setIsOpen(open)
  }
  return <DrawerPrimitive.Root open={isOpen} onOpenChange={handleOpenChange} shouldScaleBackground={shouldScaleBackground} {...props} />
}
Drawer.displayName = 'Drawer'

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

interface DrawerOverlayProps extends React.ComponentPropsWithRef<typeof DrawerPrimitive.Overlay> {}

const DrawerOverlay = ({ className, ref, ...props }: DrawerOverlayProps) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/60', className)} {...props} />
)
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

interface DrawerContentProps extends React.ComponentPropsWithRef<typeof DrawerPrimitive.Content> {
  className?: string
  showBar?: boolean
}

const DrawerContent = ({ className, children, showBar = true, ref, ...props }: DrawerContentProps) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        `fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-zinc-200 bg-white outline-none dark:border-zinc-700
        dark:bg-zinc-900`,
        className
      )}
      {...props}>
      {showBar ? <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-zinc-200 dark:bg-zinc-800" /> : null}
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
)
DrawerContent.displayName = 'DrawerContent'

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} />
)
DrawerHeader.displayName = 'DrawerHeader'

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
)
DrawerFooter.displayName = 'DrawerFooter'

interface DrawerTitleProps extends React.ComponentPropsWithRef<typeof DrawerPrimitive.Title> {
  className?: string
}

const DrawerTitle = ({ className, ref, ...props }: DrawerTitleProps) => (
  <DrawerPrimitive.Title ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
)

DrawerTitle.displayName = DrawerPrimitive.Title.displayName

interface DrawerDescriptionProps extends React.ComponentPropsWithRef<typeof DrawerPrimitive.Description> {
  className?: string
}

const DrawerDescription = ({ className, ref, ...props }: DrawerDescriptionProps) => (
  <DrawerPrimitive.Description ref={ref} className={cn('text-sm text-zinc-500 dark:text-zinc-400', className)} {...props} />
)
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription }
