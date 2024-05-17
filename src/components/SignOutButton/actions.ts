'use server'

import { signOut } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signOutWithRedirect = async () => {
  cookies().delete('payload-token')
  await signOut()
  redirect('/')
}
