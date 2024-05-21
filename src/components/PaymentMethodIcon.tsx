import Visa from '@/public/icons/payment-methods/visa.svg'
import Mastercard from '@/public/icons/payment-methods/mastercard-alt.svg'
import Klarna from '@/public/icons/payment-methods/klarna.svg'
import Paypal from '@/public/icons/payment-methods/paypal.svg'
import AmericanExpress from '@/public/icons/payment-methods/american-express.svg'
import CardGeneric from '@/public/icons/payment-methods/card-generic.svg'
import type { ComponentProps } from 'react'

const paymentMethods = {
  visa: Visa,
  mastercard: Mastercard,
  klarna: Klarna,
  paypal: Paypal,
  amex: AmericanExpress,
  unknown: CardGeneric
} as const

type PaymentMethodIconProps = ComponentProps<'svg'> & {
  icon: keyof typeof paymentMethods
}
export const PaymentMethodIcon = ({ icon, ...props }: PaymentMethodIconProps) => {
  const Icon = paymentMethods[icon] ?? paymentMethods['unknown']
  return <Icon {...props} />
}
