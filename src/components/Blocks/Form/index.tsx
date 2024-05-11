import type { AdditionalBlockProps } from '@/components/Blocks'
import type { FormBlock as FormBlockType } from '~/payload-types'
import DynamicForm from '@/components/DynamicForm'
import _isObject from 'lodash/isObject'
import Container from '@/components/Container'
import isNotNull from '@/payload/utils/isNotNull'

export default function FormBlock({ form, title, description, locale }: FormBlockType & AdditionalBlockProps) {
  return (
    <section className="py-12 first:mt-16">
      <Container className="max-w-2xl">
        {isNotNull(title) || isNotNull(description) ? (
          <div className="mb-10 text-center md:mb-20">
            {isNotNull(title) && <h2 className="text-4xl font-extrabold tracking-tight dark:text-zinc-100 sm:text-5xl md:text-6xl">{title}</h2>}
            {isNotNull(description) && <p className="mx-auto mt-4 max-w-2xl text-xl text-zinc-700 dark:text-zinc-500">{description}</p>}
          </div>
        ) : null}
        {_isObject(form) ? <DynamicForm form={form} endpoint="/api/form-submissions" locale={locale} /> : null}
      </Container>
    </section>
  )
}
