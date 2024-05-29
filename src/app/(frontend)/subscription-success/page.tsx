import Stripe from 'stripe'
import { unstable_noStore as noStore } from 'next/cache'
import { getCurrentUser } from '@/lib/payload'
import { Button } from '@/components/ui/Button'
import { CardHeader, CardContent, Card } from '@/components/ui/Card'
import { CircleCheckIcon } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-08-01' })

export default async function SuccessPage({ searchParams }: { searchParams: Record<string, string> }) {
  noStore()
  const sessionId = searchParams?.session_id || null

  if (!sessionId) {
    return <div>Error: Invalid session_id.</div>
  }

  const user = await getCurrentUser()

  if (!user) return <div>You are not allowed to view this session.</div>

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['customer', 'invoice', 'subscription'] })
    const subscription = session.subscription as Stripe.Subscription
    const productIds = subscription.items.data.map((item) => (typeof item.price.product === 'string' ? item.price.product : item.price.product.id))
    const { data: products } = await stripe.products.list({ ids: productIds })
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
    if (user.stripeCustomerId !== customerId) return <div>You are not allowed to view this session.</div>

    const customer = session.customer as Stripe.Customer
    const invoice = session.invoice as Stripe.Invoice
    const subscriptionItem = subscription.items.data.at(0) as Stripe.SubscriptionItem

    const invoiceUrl = invoice?.hosted_invoice_url || null
    const customerName = customer?.name || customer?.email || null
    const productName = products.at(0)?.name || null
    const priceAmount = subscriptionItem.price.unit_amount ? (subscriptionItem.price.unit_amount / 100).toFixed(2) : null
    const priceCurrency = subscriptionItem.price.currency.toUpperCase()
    const billingCycle = subscriptionItem.price.recurring ? subscriptionItem.price.recurring.interval : 'One Time'
    const startDate = new Date(subscription.current_period_start * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const nextBillingDate = new Date(subscription.current_period_end * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    return (
      <div className="my-auto flex h-full justify-center pb-10 pt-[100px]">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 text-center md:px-6">
            <div className="mx-auto max-w-2xl space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Subscription Complete</h1>
              <p className="text-zinc-500 dark:text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Thank you {customerName} for subscribing! Your subscription has been processed and is now active.
              </p>
              <div className="flex flex-col items-center gap-4">
                <CircleCheckIcon className="text-primary h-16 w-16" />
                <p className="text-zinc-500 dark:text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  You will receive a confirmation email with details about your subscription.
                </p>
                <div className="flex items-center gap-4">
                  <Button className="w-full max-w-xs" asChild>
                    <Link href="/profile">View Subscription</Link>
                  </Button>
                  <Button asChild>
                    {invoiceUrl && (
                      <a href={invoiceUrl} target="_blank">
                        Download Your Invoice
                      </a>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-8 max-w-xl">
              <Card className="bg-zinc-100 dark:border dark:border-zinc-700 dark:bg-zinc-800">
                <CardHeader>
                  <h2 className="text-2xl font-bold">Subscription Details</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="text-zinc-500 dark:text-zinc-400">Plan</div>
                      <div className="font-medium">{productName}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-zinc-500 dark:text-zinc-400">Price</div>
                      <div className="font-medium">
                        {priceAmount} {priceCurrency} / {billingCycle}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-zinc-500 dark:text-zinc-400">Start Date</div>
                      <div className="font-medium">{startDate}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-zinc-500 dark:text-zinc-400">Next Billing Date</div>
                      <div className="font-medium">{nextBillingDate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error fetching session data:', error)
    return <div>Error: Unable to fetch session data.</div>
  }
}
