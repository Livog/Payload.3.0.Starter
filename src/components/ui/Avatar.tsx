import cn from '@/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import Image from 'next/image'

const avatarStyles = cva(['relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-xl font-semibold'], {
  variants: {
    radius: {
      small: 'rounded-sm',
      medium: 'rounded-md',
      large: 'rounded-lg',
      full: 'rounded-full'
    }
  },
  defaultVariants: {
    radius: 'full'
  }
})

type AvatarProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof avatarStyles> & {
    image?: string | null
    name: string
  }

export const Avatar = ({ image, name, className, ...props }: AvatarProps) => {
  const getInitials = (name: string): string => {
    const names = name.split(' ').filter(Boolean)
    if (names.length > 1) {
      return `${names[0][0].toUpperCase()}${names[names.length - 1][0].toUpperCase()}`
    }
    return `${name[0]?.toUpperCase()}${name[1]?.toLowerCase() || ''}`
  }

  return (
    <div {...props} className={cn(avatarStyles(props), className)}>
      {image ? (
        <Image width={100} height={100} src={image} alt={`Avatar image of ${name}`} className="object-cover object-center" />
      ) : (
        <span className="text-xs font-bold">{getInitials(name)}</span>
      )}
    </div>
  )
}
