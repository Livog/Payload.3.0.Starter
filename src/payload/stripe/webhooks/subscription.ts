import { COLLECTION_SLUG_PRODUCTS, COLLECTION_SLUG_SUBSCRIPTIONS, COLLECTION_SLUG_USER } from '@/payload/collections/config'
import { payloadUpsert } from '@/payload/utils/upsert'
import type { StripeWebhookHandler } from '@payloadcms/plugin-stripe/types'
import type Stripe from 'stripe'

const logs = false

export const manageSubscriptionStatusChange = async (subscription: Stripe.Subscription, payload: any) => {
  const {
    id: stripeID,
    customer,
    status,
    metadata,
    cancel_at_period_end,
    current_period_start,
    current_period_end,
    ended_at,
    cancel_at,
    canceled_at,
    trial_start,
    trial_end
  } = subscription

  try {
    const userQuery = await payload.find({
      collection: COLLECTION_SLUG_USER,
      where: {
        stripeCustomerId: { equals: customer }
      }
    })

    const userID = userQuery.docs?.[0]?.id
    if (!userID) return
    const subscriptionItem = subscription.items.data.at(0)

    const { docs: products } = await payload.find({
      collection: COLLECTION_SLUG_PRODUCTS,
      where: {
        stripeID: { equals: subscriptionItem?.plan?.product }
      }
    })
    const productID = products.at(0)?.id

    const subscriptionData = {
      stripeID,
      stripeCustomerId: customer,
      product: productID,
      user: userID,
      status,
      metadata,
      cancelAtPeriodEnd: cancel_at_period_end,
      created: new Date().toISOString(),
      currentPeriodStart: new Date(current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(current_period_end * 1000).toISOString(),
      endedAt: ended_at ? new Date(ended_at * 1000).toISOString() : null,
      cancelAt: cancel_at ? new Date(cancel_at * 1000).toISOString() : null,
      canceledAt: canceled_at ? new Date(canceled_at * 1000).toISOString() : null,
      trialStart: trial_start ? new Date(trial_start * 1000).toISOString() : null,
      trialEnd: trial_end ? new Date(trial_end * 1000).toISOString() : null
    }

    await payloadUpsert({
      collection: COLLECTION_SLUG_SUBSCRIPTIONS,
      // @ts-ignore
      data: subscriptionData,
      where: {
        stripeID: { equals: stripeID }
      }
    })

    if (logs) {
      payload.logger.info(`✅ Successfully updated subscription with Stripe ID: ${stripeID}`)
    }
  } catch (error) {
    payload.logger.error(`- Error managing subscription: ${error}`)
  }
}

export const subscriptionUpsert: StripeWebhookHandler<{ data: { object: Stripe.Subscription } }> = async (args) => {
  const { event, payload } = args
  await manageSubscriptionStatusChange(event.data.object as Stripe.Subscription, payload)
}

export const subscriptionDeleted: StripeWebhookHandler<{ data: { object: Stripe.Subscription } }> = async (args) => {
  const { event, payload } = args
  const subscription = event.data.object as Stripe.Subscription
  const { id: stripeSubscriptionID } = subscription

  try {
    await payload.delete({
      collection: COLLECTION_SLUG_SUBSCRIPTIONS,
      where: {
        stripeSubscriptionId: { equals: stripeSubscriptionID }
      }
    })

    if (logs) payload.logger.info(`✅ Successfully deleted subscription with Stripe ID: ${stripeSubscriptionID}`)
  } catch (error) {
    payload.logger.error(`- Error deleting subscription: ${error}`)
  }
}
