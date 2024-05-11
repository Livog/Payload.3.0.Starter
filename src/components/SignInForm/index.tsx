'use client'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import GithubLogo from '@/public/icons/github-logo.svg'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition, type ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signInWithCredentials, signInWithGithub } from './actions'
import FormWrapper from '@/components/FormWrapper'

export const loginFormSchema = z.object({
  email: z.string().min(1, { message: 'E-mail is required' }).email({ message: 'E-mail is invalid' }),
  password: z.string().min(1, { message: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters long' })
})

const Separator = ({ children }: ComponentProps<'div'>) => (
  <div className="relative isolate my-3 flex items-center justify-center">
    <p className="bg-white p-2 text-sm font-medium uppercase text-zinc-500 dark:bg-zinc-900">{children}</p>
    <hr className="absolute z-[-1] w-full border-0 bg-zinc-200 p-px dark:bg-zinc-600" />
  </div>
)

const SignInForm = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [backendLoginResponse, setBackendLoginResponse] = useState<Awaited<ReturnType<typeof signInWithCredentials>> | null>(null)
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const {
    handleSubmit,
    formState: { errors },
    watch
  } = form

  const [email, password] = watch(['email', 'password'])

  useEffect(() => {
    if (backendLoginResponse && backendLoginResponse.success === false) {
      setBackendLoginResponse(null)
    }
  }, [email, password])

  const onSubmit = (data: z.infer<typeof loginFormSchema>) => {
    startTransition(() => {
      signInWithCredentials({ ...data, redirectTo: '/' }).then((result) => {
        if (!result) return
        if (result.success === true) {
          router.push('/')
        }
        if ('error' in result) {
          setBackendLoginResponse(result)
        }
      })
    })
  }

  return (
    <FormWrapper
      outerContent={
        <p className="mb-3 mt-4 text-center text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link tabIndex={10} className="text-black underline dark:text-white" href="/sign-up">
            Sign Up
          </Link>
        </p>
      }>
      <h2 className="mb-3 text-center text-2xl font-bold">Welcome Back!</h2>
      <p className="mb-5 text-center text-zinc-500">Please enter your details to login.</p>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {backendLoginResponse && 'error' in backendLoginResponse ? (
            <Alert color="red">{backendLoginResponse?.error?.code === 'credentials' && 'Sign in failed. Check the details you provided are correct.'}</Alert>
          ) : null}
          {backendLoginResponse && backendLoginResponse?.success === true ? <Alert color="green">Successfully logged in! Redirecting...</Alert> : null}
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
                    autoComplete="current-password"
                    {...field}
                    className="placeholder:-translate-y-[2px] placeholder:text-[10px]"
                  />
                </FormControl>
                <FormMessage>{errors.password && errors.password.message}</FormMessage>
              </FormItem>
            )}
          />

          <p className="text-sm text-zinc-600 dark:text-zinc-500">
            Forgot your password?{' '}
            <Link className="underline dark:text-zinc-50" href="/reset-password">
              Reset it.
            </Link>
          </p>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Loading...' : 'Sign In'}
          </Button>
        </form>
      </Form>

      <Separator>or</Separator>

      <form className="flex gap-4" action={signInWithGithub}>
        <Button type="submit" tabIndex={9} className="w-full">
          <GithubLogo className="h-5 w-5 text-black" />
          Sign In with Github
        </Button>
      </form>
    </FormWrapper>
  )
}

export default SignInForm
