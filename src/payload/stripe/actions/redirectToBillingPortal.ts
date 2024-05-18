'use server'

import { getCurrentUser } from '@/lib/payload'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import authConfig from '@/lib/auth/config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-08-01' })

type CreateBillingPortalSessionResponse = { success: true } | { success: false; error: string }

export default async function redirectToBillingPortal({ goBackUrl }: { goBackUrl?: string } = {}): Promise<CreateBillingPortalSessionResponse> {
  const user = await getCurrentUser()
  const signInPath = authConfig?.pages?.signIn || '/sign-in'
  if (!user) return redirect(signInPath)
  const customer = user.stripeCustomerId
  if (!customer) return redirect(signInPath)
  const session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: goBackUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/profile`
  })
  redirect(session.url)
}
