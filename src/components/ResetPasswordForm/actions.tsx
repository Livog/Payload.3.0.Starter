'use server'

import { signIn } from '@/lib/auth'
import { getUserByEmail } from '@/lib/auth/edge'
import { getPayload } from '@/lib/payload'
import { COLLECTION_SLUG_USER } from '@/payload/collections/config'
import { revalidatePath } from 'next/cache'
import { APIError } from 'payload/errors'
import { Resend } from 'resend'
import ResetPasswordEmailTemplate from '@/emails/reset-password'

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export type GenerateResetPasswordTokenResponse = { success: true } | { success: false; error: { code: string; message: string } }
type GenerateResetPasswordTokenFormData = {
  email: string
}
export const generateResetPasswordToken = async ({ email }: GenerateResetPasswordTokenFormData): Promise<GenerateResetPasswordTokenResponse> => {
  const payload = await getPayload()
  const user = await getUserByEmail({ email, payload })
  if (!user) return { success: false, error: { code: 'userNotFound', message: 'User not found' } }
  const hasResendEmail = typeof process.env.RESEND_DEFAULT_EMAIL === 'string'
  const token = await payload.forgotPassword({
    data: {
      email: user.email
    },
    disableEmail: hasResendEmail,
    collection: COLLECTION_SLUG_USER
  })

  if (typeof process.env.RESEND_DEFAULT_EMAIL === 'string') {
    await resend.emails.send({
      from: `Payload Admin <${process.env.RESEND_DEFAULT_EMAIL}>`,
      to: user.email,
      subject: 'Reset Password',
      react: (
        <ResetPasswordEmailTemplate
          appName="Payload"
          userFirstname={user?.name || 'User'}
          resetPasswordLink={`${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`}
        />
      )
    })
  }

  return { success: true }
}

export type ResetPasswordResponse = { success: true } | { success: false; error: { code: string; message: string } }

export const resetPassword = async ({
  password,
  token,
  redirectTo
}: {
  password: string
  token: string
  redirectTo?: string
}): Promise<ResetPasswordResponse> => {
  const payload = await getPayload()
  try {
    const { user } = await payload.resetPassword({
      data: {
        password,
        token
      },
      overrideAccess: true,
      collection: COLLECTION_SLUG_USER
    })
    await signIn('credentials', { email: user.email, password, redirect: false })
    revalidatePath(redirectTo || '/', 'layout')
    return { success: true }
  } catch (error: any) {
    if (error instanceof APIError) {
      return {
        success: false,
        error: {
          code: error.name,
          message: (error && error?.message) || 'Failed to reset password. Please try again.'
        }
      }
    }
    return {
      success: false,
      error: {
        code: 'resetPasswordFailed',
        message: (error && error?.message) || 'Failed to reset password. Please try again.'
      }
    }
  }
}
