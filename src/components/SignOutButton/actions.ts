'use server'

import { signOut } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signOutWithRedirect = async () => {
  await signOut()
  cookies().delete('payload-token')
  redirect('/')
}
