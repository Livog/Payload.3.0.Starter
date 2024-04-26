import cn from '@/utils/cn'

type ContainerProps = {
  children: React.ReactNode
  className?: string
}

const Container = ({ children, className = '' }: ContainerProps) => {
  return <div className={cn('container mx-auto w-full max-w-screen-xl px-3', className)}>{children}</div>
}

export default Container
