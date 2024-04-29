'use server'

import { signIn } from '@/lib/auth'
import { CredentialsSignin } from 'next-auth'

export const signInWithCredentials = async ({ email, password }: { email: string; password: string }) => {
  try {
    await signIn('credentials', {
      email,
      password
    })
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
