'use server'

import { signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const signOutWithRedirect = async () => {
  await signOut()
  redirect('/')
}
