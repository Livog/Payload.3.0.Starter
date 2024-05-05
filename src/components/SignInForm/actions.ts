'use server'

import { signIn } from '@/lib/auth'
import { CredentialsSignin } from 'next-auth'
import { revalidatePath } from 'next/cache'

export type SignInWithCredentialsResponse = { success: true } | { success: false; error: CredentialsSignin }

export const signInWithCredentials = async ({
  email,
  password,
  redirectTo
}: {
  email: string
  password: string
  redirectTo?: string
}): Promise<SignInWithCredentialsResponse> => {
  try {
    await signIn('credentials', { email, password, redirect: false })
    redirectTo && revalidatePath(redirectTo)
    return { success: true }
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return {
        success: false,
        error: JSON.parse(JSON.stringify(error)) as CredentialsSignin
      }
    }

    return {
      success: false,
      error: {
        name: 'credentials',
        type: 'CredentialsSignin',
        code: 'credentials',
        message: 'Sign in failed. Check the details you provided are correct.'
      } as CredentialsSignin
    }
  }
}

export const signInWithGithub = async () => {
  await signIn('github', { redirectTo: '/' })
}
