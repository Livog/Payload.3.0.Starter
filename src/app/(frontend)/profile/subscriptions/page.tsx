import { PaymentMethodIcon } from '@/components/PaymentMethodIcon'
import { Badge, BadgeProps } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { getCurrentUser, getPayload } from '@/lib/payload'
import { COLLECTION_SLUG_SUBSCRIPTIONS } from '@/payload/collections/config'
import { Button } from '@/components/ui/Button'
import { ArrowUpRightIcon } from 'lucide-react'
import Stripe from 'stripe'
import ManageSubscriptionButton from './ManageSubscriptionButton'
import { Alert } from '@/components/ui/Alert'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-08-01' })

export default async function SubscriptionsPage() {
  const user = await getCurrentUser()
  const payload = await getPayload()
  const { docs: subscriptions } = await payload.find({
    collection: COLLECTION_SLUG_SUBSCRIPTIONS,
    where: {
      stripeCustomerId: { equals: user?.stripeCustomerId }
    }
  })
  const subscription = subscriptions?.at(0) || null
  const productName = typeof subscription?.product === 'object' && subscription?.product?.name ? subscription?.product?.name : null
  const paymentMethodsList = user?.stripeCustomerId ? await stripe.paymentMethods.list({ customer: user?.stripeCustomerId }) : null
  const paymentMethods = paymentMethodsList?.data || []

  let subscriptionStatusColor: BadgeProps['color'] = 'green'
  switch (subscription?.status) {
    case 'incomplete_expired':
    case 'incomplete':
    case 'paused':
    case 'past_due':
      subscriptionStatusColor = 'yellow'
      break
    case 'canceled':
    case 'unpaid':
      subscriptionStatusColor = 'red'
      break
  }

  return (
    <div className="space-y-4 md:space-y-8">
      {!subscription ? (
        <Alert color="yellow" className="p-4 font-bold">
          You currently don&apos;t have a subscription.
        </Alert>
      ) : null}
      {!!subscription ? (
        <Card className="dark:border-white/5 dark:bg-[#1e1e1e]">
          <CardHeader>
            <h2 className="text-2xl font-medium">Current Subscription</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>Plan:</div>
                <div>{productName || 'Free'}</div>
              </div>
              {subscription?.status && (
                <div className="flex justify-between">
                  <div>Status:</div>
                  <div>
                    <Badge color={subscriptionStatusColor} duotone size="sm" className="capitalize">
                      {String(subscription?.status || 'Free').replaceAll('_', ' ')}
                    </Badge>
                  </div>
                </div>
              )}
              {subscription?.currentPeriodEnd && subscription?.status !== 'canceled' && (
                <div className="flex justify-between">
                  <div>Renewal Date:</div>
                  <div>{new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              )}
              {subscription?.endedAt && subscription?.status === 'canceled' && (
                <div className="flex justify-between">
                  <div>Canceled Date:</div>
                  <div>{new Date(subscription.endedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
      <Card className="dark:border-white/5 dark:bg-[#1e1e1e]">
        <CardHeader>
          <h2 className="text-2xl font-medium">Payment Methods</h2>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {paymentMethods.map((paymentMethod) => (
              <div
                key={paymentMethod.id}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-700 ">
                {paymentMethod?.type === 'card' && (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <PaymentMethodIcon
                        icon={paymentMethod?.card?.brand as any}
                        className="h-7 w-10 overflow-hidden rounded-md text-zinc-500 dark:text-zinc-400"
                      />
                    </div>
                    <div>
                      <div className="font-bold capitalize">{String(paymentMethod?.card?.display_brand).replace('_', ' ')}</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        **** {paymentMethod?.card?.last4} - Expires {paymentMethod?.card?.exp_month}/{paymentMethod?.card?.exp_year}
                      </div>
                    </div>
                    <div className="flex items-center gap-2"></div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div>
        <ManageSubscriptionButton />
      </div>
    </div>
  )
}
