import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/Collapsible'
import Container from '@/components/Container'
import LexicalContent from '@/components/LexicalContent'
import type { FaqBlock } from '~/payload-types'
import type { AdditionalBlockProps } from '@/components/Blocks'
import isNotNull from '@/payload/utils/isNotNull'

export default function FaqBlock({ title, questions, locale }: FaqBlock & AdditionalBlockProps) {
  if (!questions || !Array.isArray(questions) || questions.length === 0) return null
  return (
    <section className="py-12 md:py-20">
      <Container>
        {isNotNull(title) ? (
          <div className="mb-8 text-center md:mb-16">
            <span className="mb-4 inline-block rounded-md border border-zinc-800 px-3 py-1.5 text-sm font-semibold dark:text-zinc-500 md:mb-8">
              FAQ
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight dark:text-zinc-100 sm:text-5xl md:text-6xl">{title}</h2>
          </div>
        ) : null}
        <div className="mx-auto max-w-screen-md space-y-3">
          {questions &&
            questions.map(({ question, answer }, ix) => {
              return (
                <Collapsible
                  key={ix}
                  className="after:block after:h-px after:w-full after:bg-zinc-700 after:opacity-20 after:[--mask-fade-distance:25%]
                    after:[mask-image:_linear-gradient(to_right,transparent_0,_black_var(--mask-fade-distance),_black_calc(100%-var(--mask-fade-distance)),transparent_100%)]
                    dark:after:opacity-100 md:after:[--mask-fade-distance:50%]">
                  <CollapsibleTrigger className="p-3 text-lg font-bold md:py-5 md:text-2xl">{question}</CollapsibleTrigger>
                  <CollapsibleContent className="text-md px-3 pb-5 pt-2 text-zinc-700 dark:text-zinc-500 md:text-xl md:leading-relaxed">
                    {/* @ts-ignore */}
                    <LexicalContent childrenNodes={answer?.root?.children} locale={locale} lazyLoadImages={false} />
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
        </div>
      </Container>
    </section>
  )
}
