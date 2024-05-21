import { COLLECTION_SLUG_PRODUCTS } from '@/payload/collections/config'
import { payloadUpsert } from '@/payload/utils/upsert'
import type { StripeWebhookHandler } from '@payloadcms/plugin-stripe/types'
import type Stripe from 'stripe'

const logs = false

export const productUpsert: StripeWebhookHandler<{ data: { object: Stripe.Product } }> = async (args) => {
  const { event, payload } = args
  const { id: stripeProductID, name, description, images } = event.data.object

  try {
    await payloadUpsert({
      collection: COLLECTION_SLUG_PRODUCTS,
      data: {
        active: true,
        name,
        description,
        image: images?.[0] || '',
        skipSync: true
      },
      where: {
        stripeProductId: { equals: stripeProductID }
      }
    })

    if (logs) payload.logger.info(`✅ Successfully upserted product with Stripe ID: ${stripeProductID}`)
  } catch (error) {
    payload.logger.error(`- Error upserting product: ${error}`)
  }
}

export const productDeleted: StripeWebhookHandler<{ data: { object: Stripe.Product } }> = async (args) => {
  const { event, payload } = args
  const { id: stripeProductID } = event.data.object

  try {
    const productQuery = await payload.find({
      collection: COLLECTION_SLUG_PRODUCTS,
      where: {
        stripeProductId: { equals: stripeProductID }
      }
    })

    const payloadProductID = productQuery.docs?.[0]?.id

    if (payloadProductID) {
      await payload.delete({
        collection: COLLECTION_SLUG_PRODUCTS,
        id: payloadProductID
      })

      if (logs) payload.logger.info(`✅ Successfully deleted product with Stripe ID: ${stripeProductID}`)
    }
  } catch (error) {
    payload.logger.error(`- Error deleting product: ${error}`)
  }
}
