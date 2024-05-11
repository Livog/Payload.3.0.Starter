import type { AdditionalBlockProps } from '@/components/Blocks'
import Container from '@/components/Container'
import LexicalContent from '@/components/LexicalContent'
import type { RichTextBlock } from '~/payload-types'

export default function RichText({ content, locale }: RichTextBlock & AdditionalBlockProps) {
  if (content?.root?.children?.length === 0) return null
  return (
    <section className="py-10 first:mt-16">
      <Container>
        <div className="prose dark:prose-invert md:prose-lg">
          {/* @ts-ignore */}
          <LexicalContent childrenNodes={content?.root?.children} locale={locale} lazyLoadImages={false} />
        </div>
      </Container>
    </section>
  )
}
