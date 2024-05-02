import cn from '@/utils/cn'
import type { ComponentPropsWithoutRef } from 'react'

const Container = ({ children, className }: ComponentPropsWithoutRef<'div'>) => {
  return <div className={cn('container mx-auto w-full max-w-screen-lg px-3', className)}>{children}</div>
}

export default Container
