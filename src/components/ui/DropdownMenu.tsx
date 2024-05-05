'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
import cn from '@/utils/cn'
import { usePathname } from 'next/navigation'

type DropdownMenuRootProps = React.ComponentProps<typeof DropdownMenuPrimitive.Root> & {
  closeOnPathChange?: boolean
}

const DropdownMenu = ({ closeOnPathChange = false, ...props }: DropdownMenuRootProps) => {
  const [isOpen, setIsOpen] = React.useState(props.open ?? false)
  const pathname = usePathname()

  React.useEffect(() => {
    if (closeOnPathChange) setIsOpen(false)
  }, [pathname, closeOnPathChange])

  const handleOpenChange = (open: boolean) => {
    if (props.onOpenChange) props.onOpenChange(open)
    setIsOpen(open)
  }

  return <DropdownMenuPrimitive.Root open={isOpen} onOpenChange={handleOpenChange} {...props} />
}

DropdownMenu.displayName = DropdownMenuPrimitive.Root.displayName

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

interface DropdownMenuSubTriggerProps extends React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.SubTrigger> {
  inset?: boolean
}

const DropdownMenuSubTrigger = ({ className, inset, children, ref, ...props }: DropdownMenuSubTriggerProps) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      `flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-zinc-100 data-[state=open]:bg-zinc-100
      dark:focus:bg-zinc-800 dark:data-[state=open]:bg-zinc-800`,
      inset && 'pl-8',
      className
    )}
    {...props}>
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
)
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

interface DropdownMenuSubContentProps extends React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.SubContent> {}

const DropdownMenuSubContent = ({ className, ref, ...props }: DropdownMenuSubContentProps) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
      data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
      data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border
      border-zinc-200 bg-white p-1 text-zinc-950 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50`,
      className
    )}
    {...props}
  />
)
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

interface DropdownMenuContentProps extends React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Content> {}

const DropdownMenuContent = ({ className, sideOffset = 4, ref, ...props }: DropdownMenuContentProps) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
        data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border
        border-zinc-200 bg-white p-1 text-zinc-950 shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50`,
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
)
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

interface DropdownMenuItemProps extends React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Item> {
  inset?: boolean
}
const DropdownMenuItem = ({ className, inset, ref, ...props }: DropdownMenuItemProps) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      `relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-zinc-100
      focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50`,
      inset && 'pl-8',
      className
    )}
    {...props}
  />
)
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

interface DropdownMenuCheckboxItemProps extends React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.CheckboxItem> {
  checked?: boolean
}

const DropdownMenuCheckboxItem = ({ className, children, checked, ref, ...props }: DropdownMenuCheckboxItemProps) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      `relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-zinc-100
      focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50`,
      className
    )}
    checked={checked}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
)
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

interface DropdownMenuRadioItemProps extends React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.RadioItem> {}
const DropdownMenuRadioItem = ({ className, children, ref, ...props }: DropdownMenuRadioItemProps) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      `relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-zinc-100
      focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50`,
      className
    )}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
)
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

interface DropdownMenuLabelProps extends React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Label> {
  inset?: boolean
}
const DropdownMenuLabel = ({ className, inset, ref, ...props }: DropdownMenuLabelProps) => (
  <DropdownMenuPrimitive.Label ref={ref} className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)} {...props} />
)
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

interface DropdownMenuSeparatorProps extends React.ComponentPropsWithRef<typeof DropdownMenuPrimitive.Separator> {}

const DropdownMenuSeparator = ({ className, ref, ...props }: DropdownMenuSeparatorProps) => (
  <DropdownMenuPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-zinc-100 dark:bg-zinc-800', className)} {...props} />
)
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup
}
