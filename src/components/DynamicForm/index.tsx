'use client'

import LexicalContent from '@/components/LexicalContent'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import isNotNull from '@/payload/utils/isNotNull'
import cn from '@/utils/cn'
import fetchJson from '@/utils/fetchJson'
import { zodResolver } from '@hookform/resolvers/zod'
import _isObject from 'lodash/isObject'
import { useRouter } from 'next/navigation'
import { CSSProperties, useMemo, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form as FormType } from '~/payload-types'
import CountryField from './CountryField'
import SelectField from './SelectField'

const createSchema = (form: FormType) => {
  if (!form || !form.fields || form.fields.length === 0) return z.object({})

  const fieldSchemas = form.fields.reduce(
    (acc, field) => {
      if (field.blockType === 'message') {
        return acc
      }

      let validator: z.ZodTypeAny
      switch (field.blockType) {
        case 'email':
          validator = z.string().email('Invalid email')
          break
        case 'checkbox':
          validator = z.boolean()
          break
        case 'number':
          validator = z
            .string()
            .optional()
            .refine((val) => val === '' || /^\d+$/.test(val || ''), {
              message: `${field.label || 'Field'} must be a valid number or empty`
            })
          break
        default:
          validator = z.string()
          break
      }

      if (field.required) {
        switch (field.blockType) {
          case 'email':
          case 'text':
          case 'textarea':
          case 'country':
            validator = validator.refine((val) => val != null && val.trim() !== '', {
              message: `${field.label || 'Field'} is required`
            })
            break
          case 'number':
            validator = z.string().refine((val) => val != null && val.trim() !== '' && /^\d+$/.test(val), {
              message: `${field.label || 'Field'} must be a valid number and is required`
            })
            break
          case 'checkbox':
            validator = validator.refine((val) => val === true, {
              message: `This field must be checked`
            })
            break
        }
      }
      acc[field.name] = validator
      return acc
    },
    {} as Record<string, z.ZodTypeAny>
  )

  return z.object(fieldSchemas)
}

const createDefaultValues = (form: FormType) => {
  if (!_isObject(form) || !form?.fields || form.fields.length === 0) return {}
  const defaultValues: Record<string, any> = {}
  form.fields.reduce((acc, field) => {
    if (field.blockType === 'message') {
      return acc
    }
    if (field.blockType === 'checkbox') {
      // @ts-ignore
      acc[field.name] = field?.defaultValue ?? false
      return acc
    }
    // @ts-ignore
    acc[field.name] = field?.defaultValue || ''
    return acc
  }, defaultValues)
  return defaultValues
}

export default function DynamicForm({ endpoint, form, locale }: { endpoint: string; form: FormType; locale: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverResponse, setServerResponse] = useState(null)
  const schema = useMemo(() => createSchema(form), [form])
  const defaultValues = useMemo(() => createDefaultValues(form), [form])
  const reactForm = useForm({ resolver: zodResolver(schema), defaultValues })

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = reactForm

  if ((!_isObject(form) && isNotNull(form)) || (form?.fields || []).length === 0) return null

  const onSubmit = (data: any) => {
    startTransition(async () => {
      const preparedDataForPayload = Object.entries(data).map(([key, value]) => ({
        field: key,
        value
      }))
      const submissionData = {
        form: form.id,
        submissionData: preparedDataForPayload
      }

      const response = await fetchJson(endpoint, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(submissionData)
      })

      setServerResponse(response)
      if (response && form.confirmationType === 'redirect') {
        if (form?.redirect?.url) {
          // eslint-disable-next-line react-compiler/react-compiler
          window.location.href = form.redirect.url
        } else if (typeof form.redirect?.reference?.value !== 'string') {
          router.push(form.redirect?.reference?.value?.path || '/')
        }
      }
    })
  }

  if (serverResponse && form.confirmationType === 'message') {
    // @ts-ignore
    return <LexicalContent childrenNodes={form.confirmationMessage.root.children} />
  }

  return (
    <Form {...reactForm}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 [--form-gap:1rem]">
        {(form?.fields || []).map((payloadField: any) => {
          if (payloadField.blockType === 'message') {
            return (
              <div className="prose dark:prose-invert" key={payloadField.id}>
                <LexicalContent childrenNodes={payloadField?.message?.root?.children || []} locale={locale} lazyLoadImages={false} />
              </div>
            )
          }
          return (
            <FormField
              key={payloadField.id}
              control={control}
              name={payloadField.name}
              render={({ field }: any) => (
                <FormItem
                  style={{ '--field-group-width': `${payloadField?.width || 100}%` } as CSSProperties}
                  className={cn(
                    'flex grow basis-full flex-wrap gap-2 space-y-0 sm:basis-[calc(var(--field-group-width)-var(--form-gap))]',
                    payloadField.blockType !== 'checkbox' ? 'flex flex-col justify-start' : 'flex flex-row items-center'
                  )}>
                  {payloadField.blockType !== 'checkbox' ? (
                    <FormLabel>
                      {payloadField.label}
                      {payloadField.required ? <span className="relative -top-px text-red-500 dark:text-red-700"> *</span> : null}
                    </FormLabel>
                  ) : null}
                  {payloadField.blockType === 'text' ? (
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                  ) : null}
                  {payloadField.blockType === 'email' ? (
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                  ) : null}

                  {payloadField.blockType === 'number' ? (
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                  ) : null}

                  {payloadField.blockType === 'textarea' ? (
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  ) : null}
                  {payloadField.blockType === 'checkbox' ? (
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  ) : null}
                  {payloadField.blockType === 'country' ? <CountryField field={field} /> : null}
                  {payloadField.blockType === 'select' ? <SelectField field={field} payloadField={payloadField} /> : null}
                  {payloadField.blockType === 'checkbox' ? (
                    <FormLabel className="font-medium">
                      {payloadField.label}
                      {payloadField.required ? <span className="relative -top-px text-red-500 dark:text-red-700"> *</span> : null}
                    </FormLabel>
                  ) : null}
                  {/* @ts-ignore */}
                  <FormMessage className={cn('flex w-full grow')}>{errors[payloadField.name] && errors[payloadField.name]?.message}</FormMessage>
                </FormItem>
              )}
            />
          )
        })}
        <div className="flex w-full">
          <Button type="submit">{isPending ? 'Submitting...' : form.submitButtonLabel || 'Submit'}</Button>
        </div>
      </form>
    </Form>
  )
}
