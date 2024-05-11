type FormWrapperProps = React.ComponentPropsWithoutRef<'div'> & {
  outerContent?: React.ReactNode
}
import cn from '@/utils/cn'

export default function FormWrapper({ children, className, outerContent, ...props }: FormWrapperProps) {
  return (
    <div
      className={cn('w-full max-w-[440px] space-y-4 rounded-lg bg-black/5 p-1 dark:bg-zinc-800 dark:text-white', !!outerContent && 'pb-5', className)}
      {...props}>
      <div className="bg-white px-6 py-10 dark:bg-zinc-900">{children}</div>
      {outerContent ? outerContent : null}
    </div>
  )
}
