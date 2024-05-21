'use client'

import { Button } from '@/components/ui/Button'
import redirectToBillingPortal from '@/payload/stripe/actions/redirectToBillingPortal'
import { ArrowUpRightIcon } from 'lucide-react'

export default function ManageSubscriptionButton() {
  return (
    <form action={() => redirectToBillingPortal({ goBackUrl: window.location.href })}>
      <Button type="submit">
        <ArrowUpRightIcon className="h-5 w-5" /> Manage Subscriptions
      </Button>
    </form>
  )
}
