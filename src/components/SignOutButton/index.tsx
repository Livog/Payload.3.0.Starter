import type { ComponentProps } from 'react'
import { signOutWithRedirect } from './actions'

export const SignOutButton = ({ className, children, options = undefined, ...props }: ComponentProps<'button'> & { options?: any }) => {
  return (
    <form action={signOutWithRedirect} className="w-full">
      <button type="submit" className={className} {...props}>
        {children}
      </button>
    </form>
  )
}
