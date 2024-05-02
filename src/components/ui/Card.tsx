import cn from '@/utils/cn'

interface CardProps extends React.ComponentPropsWithRef<'div'> {}

const Card = ({ className, ref, ...props }: CardProps) => (
  <div ref={ref} className={cn('rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-800', className)} {...props} />
)
Card.displayName = 'Card'

interface CardHeaderProps extends React.ComponentPropsWithRef<'div'> {}

const CardHeader = ({ className, ref, ...props }: CardHeaderProps) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
)
CardHeader.displayName = 'CardHeader'

interface CardContentProps extends React.ComponentPropsWithRef<'div'> {}

const CardContent = ({ className, ref, ...props }: CardContentProps) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
CardContent.displayName = 'CardContent'

interface CardFooterProps extends React.ComponentPropsWithRef<'div'> {}

const CardFooter = ({ className, ref, ...props }: CardFooterProps) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
CardFooter.displayName = 'CardFooter'

export { Card, CardContent, CardFooter, CardHeader }
