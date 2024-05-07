import React from 'react'
import ReactIcon from '@/components/ReactIcon'
import Container from '@/components/Container'
import { FeaturesGridBlock } from '~/payload-types'
import isNotNull from '@/payload/utils/isNotNull'
import type { AdditionalBlockProps } from '@/components/Blocks'

export default function FeaturedGrid({ features, preTitle, title, description }: FeaturesGridBlock & AdditionalBlockProps) {
  return (
    <section className="py-12">
      <Container>
        <div className="text-center md:mb-20">
          {isNotNull(preTitle) && (
            <span className="mb-4 inline-block rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-semibold dark:text-zinc-500 md:mb-8">
              {preTitle}
            </span>
          )}
          {isNotNull(title) && <h2 className="text-4xl font-extrabold tracking-tight dark:text-zinc-100 sm:text-5xl md:text-6xl">{title}</h2>}
          {isNotNull(description) && <p className="mx-auto mt-4 max-w-2xl text-xl text-zinc-700 dark:text-zinc-500">{description}</p>}
        </div>
        <div className="mt-10">
          <dl className="space-y-10 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-16 md:space-y-0">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col gap-x-3 gap-y-4">
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 shadow-md
                    dark:border-zinc-600/20 dark:bg-zinc-600/20">
                  <ReactIcon icon={feature.icon} className="h-7 w-7 dark:text-zinc-500" />
                </div>
                <div>
                  <dt className="text-lg font-bold dark:text-white">{feature.title}</dt>
                  <dd className="mt-2 text-base text-zinc-500 max-md:text-pretty">{feature.description}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}
