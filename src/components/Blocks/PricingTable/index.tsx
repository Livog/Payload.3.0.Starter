'use client'

import { useState } from 'react'
import type { AdditionalBlockProps } from '@/components/Blocks'
import Container from '@/components/Container'
import isNotNull from '@/payload/utils/isNotNull'
import _isObject from 'lodash/isObject'
import type { PricingTableBlock, Product } from '~/payload-types'
import PricingTableItem from './PricingTableItem'
import PaymentIntervalControl from './PaymentIntervalControl'

export default function PricingTableBlock({ title, products, locale }: PricingTableBlock & AdditionalBlockProps) {
  const [interval, setInterval] = useState('month')

  if (!products || !Array.isArray(products) || products.length === 0) return null
  const formattedProducts = products.filter(({ product }) => product != null && _isObject(product?.value)).map(({ product }) => product?.value) as Product[]

  const handleIntervalChange = (newInterval: string) => setInterval(newInterval)

  return (
    <section className="py-12 md:py-20">
      <Container className="space-y-6">
        {isNotNull(title) ? (
          <div className="text-center md:mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight dark:text-zinc-100 sm:text-5xl md:text-6xl">{title}</h2>
          </div>
        ) : null}
        <div className="mx-auto flex justify-center rounded-md p-0.5">
          <PaymentIntervalControl onChange={handleIntervalChange} />
        </div>
        <h3 className="mx-auto max-w-xl text-center text-lg font-bold">Get 20% off on yearly </h3>
        <div className="group mx-auto grid grid-cols-1 gap-4 sm:grid-cols-3">
          {formattedProducts.map((product, ix) => (
            <PricingTableItem key={ix} product={product} interval={interval} />
          ))}
        </div>
      </Container>
    </section>
  )
}
