'use client'
import { useMemo, useState, useTransition } from 'react'
import type { Price, Product } from '~/payload-types'
import { Button } from '@/components/ui/Button'
import { createCheckoutSession } from '@/payload/stripe/actions/createPaymentIntent'
import { Alert } from '@/components/ui/Alert'
import { CheckIcon } from 'lucide-react'

function isPriceArray(prices: any): prices is { price: Price }[] {
  return (
    Array.isArray(prices) &&
    prices.every((item) => typeof item === 'object' && item !== null && 'price' in item && typeof item.price === 'object' && 'currency' in item.price)
  )
}

const normalizeStripePrice = (amount: number) => {
  return amount / 100
}

const FeatureItem = ({ children }: { children?: React.ReactNode }) => {
  return (
    <li className="flex items-center gap-x-3">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600/15 p-1 dark:bg-green-500/10">
        <CheckIcon className="w-4 text-green-600 dark:text-green-500" />
      </span>
      {children}
    </li>
  )
}

export default function PricingTableItem({ product, currency = 'usd', interval = 'month' }: { product: Product; currency?: string; interval?: string }) {
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const price = useMemo(() => {
    if (!isPriceArray(product?.prices)) return null
    let foundPrice = product.prices.find(({ price }) => price.currency == currency && price.interval == interval)?.price
    if (!foundPrice) {
      foundPrice = product.prices.find(({ price }) => price.currency == currency)?.price
    }
    return foundPrice
  }, [product.prices, currency, interval])

  if (!isPriceArray(product?.prices)) {
    console.error('PricingTableItem: product.prices is not an array')
    return null
  }

  if (!price || typeof product.stripeID !== 'string') {
    return null
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    startTransition(async () => {
      const response = await createCheckoutSession([{ quantity: 1, stripePriceId: price.stripeID, stripeProductId: product.stripeID as string }], {
        cancel: window.location.href,
        success: new URL('/subscription-success', window.location.href).href
      })

      if (!response.success) {
        setErrorMessage('Failed to create checkout session')
        return
      }
      const stripe = await import('@stripe/stripe-js').then(({ loadStripe }) => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!))
      if (!stripe) {
        setErrorMessage('Stripe.js failed to load')
        return
      }
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId
      })

      if (error) {
        setErrorMessage(error.message || 'Checkout failed')
      }
    })
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-full flex-col space-y-4 px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
        <h3 className="text-2xl font-bold md:text-3xl">{product?.name}</h3>
        <div className="flex items-baseline">
          <span className="text-4xl font-bold md:text-5xl">${normalizeStripePrice(price.unitAmount)}</span>
          <span className="ml-2 text-sm text-zinc-500">/{price.interval}</span>
        </div>
        <ul className="!my-8 space-y-4">{product?.features && product?.features?.map(({ title }, ix) => <FeatureItem key={ix}>{title}</FeatureItem>)}</ul>
        <form method="post" className="mt-auto" onSubmit={handleFormSubmit}>
          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? 'Redirecting to checkout...' : 'Subscribe'}
          </Button>
        </form>
        {errorMessage && (
          <Alert color="red" className="mt-4">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  )
}
