'use client'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition, type ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signUp } from './actions'
import FormWrapper from '../FormWrapper'

export const signUpFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().min(1, { message: 'E-mail is required' }).email({ message: 'E-mail is invalid' }),
  password: z.string().min(1, { message: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters long' })
})

export type SignUpFormData = z.infer<typeof signUpFormSchema>

const SignUpForm = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [backendSignUpResponse, setBackendSignUpResponse] = useState<any>(null)
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  })
  const {
    handleSubmit,
    formState: { errors },
    watch
  } = form
  const [firstName, lastName, email, password] = watch(['firstName', 'lastName', 'email', 'password'])

  useEffect(() => {
    if (backendSignUpResponse) {
      setBackendSignUpResponse(null)
    }
  }, [firstName, lastName, email, password])

  const onSubmit = async (data: SignUpFormData) => {
    startTransition(async () => {
      const result = await signUp({ ...data, redirectTo: '/profile' })
      setBackendSignUpResponse(result)
      if (result.success) {
        router.push('/profile')
      }
    })
  }

  return (
    <FormWrapper
      outerContent={
        <p className="mb-3 mt-4 text-center text-zinc-500 dark:text-zinc-400">
          Already have an account?{' '}
          <Link tabIndex={10} className="text-black underline dark:text-white" href="/sign-in">
            Sign In
          </Link>
        </p>
      }>
      <h2 className="mb-3 text-center text-2xl font-medium">Create Your Account</h2>
      <p className="mb-5 text-center text-zinc-500">Please enter your details to sign up.</p>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {backendSignUpResponse && !backendSignUpResponse?.success && backendSignUpResponse?.error ? (
            <Alert color="red">{backendSignUpResponse.error.message}</Alert>
          ) : null}
          {backendSignUpResponse && backendSignUpResponse?.success ? <Alert color="green">Account created! Redirecting...</Alert> : null}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="firstName">First Name</Label>
                <FormControl>
                  <Input type="text" placeholder="John" {...field} />
                </FormControl>
                <FormMessage>{errors.firstName && errors.firstName.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="lastName">Last Name</Label>
                <FormControl>
                  <Input type="text" placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage>{errors.lastName && errors.lastName.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">E-mail</Label>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage>{errors.email && errors.email.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="password">Password</Label>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="● ● ● ● ● ● ● ● ●"
                    autoComplete="new-password"
                    {...field}
                    className="placeholder:-translate-y-[2px] placeholder:text-[10px]"
                  />
                </FormControl>
                <FormMessage>{errors.password && errors.password.message}</FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  )
}

export default SignUpForm
