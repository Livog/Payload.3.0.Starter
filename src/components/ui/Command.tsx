'use client'

import * as React from 'react'
import { type DialogProps } from '@radix-ui/react-dialog'
import { Command as CommandPrimitive } from 'cmdk'
import { Search } from 'lucide-react'

import cn from '@/utils/cn'
import { Dialog, DialogContent } from '@/components/ui/Dialog'

interface CommandProps extends React.ComponentPropsWithRef<typeof CommandPrimitive> {}

const Command = ({ className, ref, ...props }: CommandProps) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50',
      className
    )}
    {...props}
  />
)

Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500
            dark:[&_[cmdk-group-heading]]:text-zinc-400 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5
            [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

interface CommandInputProps extends React.ComponentPropsWithRef<typeof CommandPrimitive.Input> {}

const CommandInput = ({ className, ref, ...props }: CommandInputProps) => (
  <div className="flex items-center border-b px-3 dark:border-zinc-700" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        `flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50
        dark:placeholder:text-zinc-400`,
        className
      )}
      {...props}
    />
  </div>
)

CommandInput.displayName = CommandPrimitive.Input.displayName

interface CommandListProps extends React.ComponentPropsWithRef<typeof CommandPrimitive.List> {}

const CommandList = ({ className, ref, ...props }: CommandListProps) => (
  <CommandPrimitive.List ref={ref} className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)} {...props} />
)

CommandList.displayName = CommandPrimitive.List.displayName

interface CommandEmptyProps extends React.ComponentPropsWithRef<typeof CommandPrimitive.Empty> {}

const CommandEmpty = ({ ref, ...props }: CommandEmptyProps) => <CommandPrimitive.Empty ref={ref} className="py-6 text-center text-sm" {...props} />

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

interface CommandGroupProps extends React.ComponentPropsWithRef<typeof CommandPrimitive.Group> {}

const CommandGroup = ({ className, ref, ...props }: CommandGroupProps) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      `overflow-hidden p-1 text-zinc-950 dark:text-zinc-50 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs
      [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500 dark:[&_[cmdk-group-heading]]:text-zinc-400`,
      className
    )}
    {...props}
  />
)

CommandGroup.displayName = CommandPrimitive.Group.displayName

interface CommandSeparatorProps extends React.ComponentPropsWithRef<typeof CommandPrimitive.Separator> {}

const CommandSeparator = ({ className, ref, ...props }: CommandSeparatorProps) => (
  <CommandPrimitive.Separator ref={ref} className={cn('-mx-1 h-px bg-zinc-200 dark:bg-zinc-800', className)} {...props} />
)
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

interface CommandItemProps extends React.ComponentPropsWithRef<typeof CommandPrimitive.Item> {}

const CommandItem = ({ className, ref, ...props }: CommandItemProps) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      `relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-zinc-100 aria-selected:text-zinc-900
      dark:aria-selected:bg-zinc-700 dark:aria-selected:text-zinc-50`,
      className
    )}
    {...props}
  />
)

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({ className, ...props }: React.ComponentPropsWithRef<'span'>) => {
  return <span className={cn('ml-auto text-xs tracking-widest text-zinc-500 dark:text-zinc-400', className)} {...props} />
}
CommandShortcut.displayName = 'CommandShortcut'

export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator }
