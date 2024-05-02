import cn from '@/utils/cn'
import React from 'react'
import type { ComponentProps } from 'react'

export function Fieldset({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cn(className, 'space-y-2')} />
}
