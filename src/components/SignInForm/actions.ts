'use server'

import { signIn } from '@/lib/auth'
import { CredentialsSignin } from 'next-auth'
import { revalidatePath } from 'next/cache'

export const signInWithCredentials = async ({ email, password, redirectTo }: { email: string; password: string; redirectTo: string }) => {
  try {
    await signIn('credentials', {
      email,
      password
    })
    redirectTo && revalidatePath(redirectTo)
    return { success: true }
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return JSON.parse(JSON.stringify(error)) as CredentialsSignin
    }
  }
}

export const signInWithGithub = async () => {
  await signIn('github', { redirectTo: '/' })
}
