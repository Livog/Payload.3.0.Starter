import type { StripeWebhookHandler } from '@payloadcms/plugin-stripe/types'
import type Stripe from 'stripe'
import { manageSubscriptionStatusChange } from './subscription'

const logs = false

export const checkoutSessionCompleted: StripeWebhookHandler<{ data: { object: Stripe.Checkout.Session } }> = async (args) => {
  const { event, payload, stripe } = args
  const checkoutSession = event.data.object as Stripe.Checkout.Session

  if (checkoutSession.mode === 'subscription') {
    const subscriptionId = typeof checkoutSession.subscription === 'string' ? checkoutSession.subscription : checkoutSession.subscription?.id

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId as string)

      if (subscription) {
        await manageSubscriptionStatusChange(subscription, payload)

        if (logs) payload.logger.info(`✅ Successfully managed subscription status change for session ${checkoutSession.id}`)
      }
    } catch (error) {
      payload.logger.error(`- Error fetching subscription from Stripe: ${error}`)
    }
  }
}
