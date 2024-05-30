'use server'

import Stripe from 'stripe'
import { getCurrentUser, getPayload } from '@/lib/payload'
import { COLLECTION_SLUG_USER, COLLECTION_SLUG_PRICES } from '@/payload/collections/config'
import type { Price } from '~/payload-types'
import { redirect } from 'next/navigation'
import authConfig from '@/lib/auth/config'
import { cookies } from 'next/headers'
import { AUTHJS_CALLBACK_URL_COOKIE_NAME } from '@/lib/auth/edge'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-08-01'
})

type CreatePaymentIntentResponse = { success: true; clientSecret: string } | { success: false; error: string }

type CartItem = {
  stripeProductId: string
  quantity: number
  stripePriceId: string
}

type Cart = CartItem[]

const fetchPriceData = async (stripePriceIds: string[]) => {
  const payload = await getPayload()
  const prices = await payload.find({
    collection: COLLECTION_SLUG_PRICES,
    where: { stripeID: { in: stripePriceIds }, active: { equals: true } },
    depth: 1
  })

  return prices.docs
}

const isCartValid = (cart: Cart, prices: Price[]): boolean => {
  const priceMap = new Map(prices.map((price) => [price.stripeID, price]))

  for (const item of cart) {
    const price = priceMap.get(item.stripePriceId)
    if (!price || price.stripeProductId !== item.stripeProductId || !price.active) {
      return false
    }
  }

  return true
}

const getCartCurrency = (prices: Price[]): string | null => {
  const currencies = prices.map((price) => price.currency)
  const uniqueCurrencies = new Set(currencies)

  return uniqueCurrencies.size === 1 ? currencies[0] : null
}

export const createPaymentIntent = async (cart: Cart): Promise<CreatePaymentIntentResponse> => {
  let user = await getCurrentUser()
  const payload = await getPayload()

  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  user = await payload.findByID({
    id: user.id,
    collection: COLLECTION_SLUG_USER,
    depth: 3
  })

  if (!user) {
    return { success: false, error: 'User not found' }
  }

  if (!user.name) {
    return { success: false, error: 'Account field "name" is not set' }
  }

  try {
    let stripeCustomerID = user.stripeCustomerId

    if (!stripeCustomerID) {
      const customer = await stripe.customers.create({
        name: user.name,
        email: user.email
      })

      stripeCustomerID = customer.id

      await payload.update({
        id: user.id,
        collection: COLLECTION_SLUG_USER,
        data: { stripeCustomerId: customer.id }
      })
    }

    if (cart.length === 0) {
      return { success: false, error: 'No items in cart' }
    }

    const stripePriceIds = cart.map((item) => item.stripePriceId)
    const prices = await fetchPriceData(stripePriceIds)

    // Validate cart items
    if (!isCartValid(cart, prices)) {
      return { success: false, error: 'Invalid cart items' }
    }

    // Ensure all items have the same currency
    const currency = getCartCurrency(prices)
    if (!currency) {
      return { success: false, error: 'Cart contains items with different currencies' }
    }

    const total = cart.reduce((acc, item) => {
      const price = prices.find((price) => price.stripeID === item.stripePriceId)
      return acc + (price?.unitAmount || 0) * item.quantity
    }, 0)

    if (total === 0) {
      return { success: false, error: 'There is nothing to pay for, add some items to your cart and try again.' }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: currency,
      customer: stripeCustomerID
    })

    if (!paymentIntent.client_secret) {
      return { success: false, error: 'Payment intent creation failed' }
    }

    return { success: true, clientSecret: paymentIntent.client_secret }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

type CreateCheckoutSessionResponse = { success: true; sessionId: string } | { success: false; error: string }
type CreateCheckoutSessionRedirects = { success?: string; cancel?: string }

export const createCheckoutSession = async (cart: Cart, redirects: CreateCheckoutSessionRedirects = {}): Promise<CreateCheckoutSessionResponse> => {
  let user = await getCurrentUser()
  const payload = await getPayload()

  const successRedirectUrl = (redirects.success || `${process.env.NEXT_PUBLIC_SITE_URL}/subscription-success`) + '?session_id={CHECKOUT_SESSION_ID}'
  const cancelRedirectUrl = redirects.cancel || `${process.env.NEXT_PUBLIC_SITE_URL}`

  if (!user) {
    redirects.cancel && cookies().set(AUTHJS_CALLBACK_URL_COOKIE_NAME, redirects.cancel)
    redirect(authConfig?.pages?.signIn || '/sign-in')
  }

  user = await payload.findByID({
    id: user.id,
    collection: COLLECTION_SLUG_USER,
    depth: 3
  })

  if (!user) {
    return { success: false, error: 'User not found' }
  }

  if (!user.name) {
    return { success: false, error: 'Account field "name" is not set' }
  }

  try {
    let stripeCustomerID = user.stripeCustomerId

    if (!stripeCustomerID) {
      const customer = await stripe.customers.create({
        name: user.name,
        email: user.email
      })

      stripeCustomerID = customer.id

      await payload.update({
        id: user.id,
        collection: COLLECTION_SLUG_USER,
        data: { stripeCustomerId: customer.id }
      })
    }

    if (cart.length === 0) {
      return { success: false, error: 'No items in cart' }
    }

    const stripePriceIds = cart.map((item) => item.stripePriceId)
    const prices = await fetchPriceData(stripePriceIds)

    // Validate cart items
    if (!isCartValid(cart, prices)) {
      return { success: false, error: 'Invalid cart items' }
    }

    // Ensure all items have the same currency
    const currency = getCartCurrency(prices)
    if (!currency) {
      return { success: false, error: 'Cart contains items with different currencies' }
    }

    // Determine the mode (payment or subscription)
    const isSubscription = prices.every((price) => price?.interval != null)
    const mode = isSubscription ? 'subscription' : 'payment'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.map((item) => ({
        price: item.stripePriceId,
        quantity: item.quantity
      })),
      mode,
      success_url: successRedirectUrl,
      cancel_url: cancelRedirectUrl,
      customer: stripeCustomerID
    })

    if (!session.id) {
      return { success: false, error: 'Checkout session creation failed' }
    }

    return { success: true, sessionId: session.id }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}
