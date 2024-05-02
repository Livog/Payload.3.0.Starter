'use client'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import GithubLogo from '@/public/icons/github-logo.svg'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type ComponentProps } from 'react'
import { useFormState } from 'react-dom'
import { signInWithCredentials, signInWithGithub } from './actions'
import { Fieldset } from '@/components/ui/FieldSet'

const Separator = ({ children }: ComponentProps<'div'>) => (
  <div className="relative isolate my-3 flex items-center justify-center">
    <p className="bg-white p-2 text-sm font-medium uppercase text-zinc-500 dark:bg-zinc-900">{children}</p>
    <hr className="absolute z-[-1] w-full border-0 bg-zinc-200 p-px dark:bg-zinc-600" />
  </div>
)

const SignInForm = () => {
  const [formData, setFormData] = useState<any>({ email: '', password: '', redirectTo: '/', error: false, success: false })
  const router = useRouter()
  const [error, signInWithCredentialsAction, isPending] = useFormState(async () => {
    return await signInWithCredentials(formData)
  }, null)
  useEffect(() => {
    if (error === null) return
    if (error === undefined || 'success' in error) {
      setFormData({ ...formData, success: true })
      router.push(formData.redreictTo)
      return
    }
    setFormData({ ...formData, error })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value, error: false })
  }
  return (
    <div className="w-full max-w-[440px] space-y-4 rounded-lg bg-black/5 p-2 pb-5 dark:bg-zinc-800 dark:text-white">
      <div className="bg-white px-6 py-10 dark:bg-zinc-900">
        <h2 className="mb-3 text-center text-2xl font-medium">Welcome Back!</h2>
        <p className="mb-5 text-center text-zinc-500">Please enter your details to login.</p>
        <form action={signInWithCredentialsAction} className="space-y-4">
          {formData?.success && <Alert color="green">Successfully logged in! Redirecting...</Alert>}
          {formData?.error && (
            <Alert color="red">{formData?.error?.code === 'credentials' && 'Sign in failed. Check the details you provided are correct.'}</Alert>
          )}
          <Fieldset>
            <Label htmlFor="email">E-mail</Label>
            <Input
              type="email"
              name="email"
              id="email"
              onChange={handleOnChange}
              autoComplete="email"
              value={formData.email}
              placeholder="john.doe@example.com"
              tabIndex={5}
            />
          </Fieldset>
          <Fieldset>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder="● ● ● ● ● ● ● ● ●"
              tabIndex={6}
              onChange={handleOnChange}
              value={formData.password}
              className="placeholder:-translate-y-[2px] placeholder:text-[10px]"
            />
          </Fieldset>

          <p className="text-sm text-zinc-500">
            Forgot password?{' '}
            <Link tabIndex={7} className="text-black underline dark:text-white" href="/forgot-password">
              Reset it
            </Link>
          </p>
          <Button type="submit" tabIndex={8} disabled={isPending} className="w-full">
            {isPending ? 'Loading...' : 'Sign In'}
          </Button>
        </form>

        <Separator>or</Separator>

        <form className="flex gap-4" action={signInWithGithub}>
          <Button type="submit" tabIndex={9} className="w-full">
            <GithubLogo className="h-5 w-5 text-black" />
            Sign In with Github
          </Button>
        </form>
      </div>
      <p className="mb-3 mt-4 text-center text-zinc-500 dark:text-zinc-400">
        Don&apos;t have an account?{' '}
        <Link tabIndex={10} className="text-black underline dark:text-white" href="/sign-up">
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default SignInForm
