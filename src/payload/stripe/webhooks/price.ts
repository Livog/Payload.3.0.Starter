import { COLLECTION_SLUG_PRICES } from '@/payload/collections/config'
import { payloadUpsert } from '@/payload/utils/upsert'
import type { StripeWebhookHandler } from '@payloadcms/plugin-stripe/types'
import type Stripe from 'stripe'
import type { Price } from '~/payload-types'

export function ensurePriceExist(price: Stripe.Price): Promise<Price | null> {
  const stripeProductID = typeof price.product === 'string' ? price.product : price.product.id
  return payloadUpsert({
    collection: COLLECTION_SLUG_PRICES,
    data: {
      stripeID: price.id,
      stripeProductId: stripeProductID,
      active: price.active,
      unitAmount: price.unit_amount as number,
      currency: price.currency,
      type: price.type,
      interval: price.recurring?.interval,
      intervalCount: price.recurring?.interval_count
    },
    where: {
      stripeID: { equals: price.id }
    }
  })
}

export const priceUpsert: StripeWebhookHandler<{ data: { object: Stripe.Price } }> = async (args) => {
  const { event, payload, pluginConfig } = args

  try {
    await ensurePriceExist(event.data.object)

    pluginConfig?.logs && payload.logger.info(`✅ Successfully upserted price with Stripe ID: ${event.data.object.id}`)
  } catch (error) {
    payload.logger.error(`- Error upserting price: ${error}`)
  }
}

export const priceDeleted: StripeWebhookHandler<{ data: { object: Stripe.Price } }> = async (args) => {
  const { event, payload } = args
  const { id } = event.data.object

  try {
    await payload.delete({
      collection: COLLECTION_SLUG_PRICES,
      where: {
        stripeID: { equals: id }
      }
    })
  } catch (error) {
    payload.logger.error(`- Error deleting price: ${error}`)
  }
}
