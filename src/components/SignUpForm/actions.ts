'use server'

import { signIn } from '@/lib/auth'
import { getUserByEmail } from '@/lib/auth/adapter'
import { getPayload } from '@/lib/payload'
import { COLLECTION_SLUG_USER } from '@/payload/collections/config'
import { revalidatePath } from 'next/cache'
import { SignUpFormData } from './validation'
import { DEFAULT_USER_ROLE } from '@/lib/auth/config'
import { CredentialsSignin } from 'next-auth'

type SignUpProps = SignUpFormData & { redirectTo?: string }

export const signUp = async ({ firstName, lastName, email, password, redirectTo }: SignUpProps) => {
  const payload = await getPayload()
  const maybeExistingUser = await getUserByEmail({ email, payload })

  if (maybeExistingUser) {
    return {
      success: false,
      error: {
        code: 'alreadyExists',
        message: 'User already exists.'
      }
    }
  }

  try {
    await payload.create({
      collection: COLLECTION_SLUG_USER,
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password,
        role: DEFAULT_USER_ROLE
      }
    })

    const signInResult = await signIn('credentials', { email, password, redirect: false })

    if (signInResult.error) {
      return {
        success: false,
        error: {
          code: 'autoSignInFailed',
          message: 'Failed to automatically sign in.'
        }
      }
    }

    revalidatePath(redirectTo || '/')
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
        code: 'serverError',
        message: 'An error occurred during the sign-up process.'
      }
    }
  }
}
