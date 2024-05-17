'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { useState } from 'react'
import type { User } from '~/payload-types'
import { Fieldset } from '@/components/ui/FieldSet'
import { Card, CardContent } from '@/components/ui/Card'
import { updateUser } from './actions'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'
import DeleteAccountSection from './DeleteAccountSection'

const ProfileForm = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState<User>(user)

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const [response, updateUserAction, isPending] = useFormState(async () => {
    const response = await updateUser(formData)
    if (!response || !response.user) return null
    toast.success('Profile updated successfully!', { duration: 2000, position: 'top-center', dismissible: true })
    return response
  }, null)

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold">Update Profile</h2>
        <p className="text-gray-500 dark:text-gray-400">Make changes to your profile details below.</p>
      </div>
      <div className="space-y-4">
        <form action={updateUserAction} className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Label className="text-base font-bold" htmlFor="user-email">
                E-mail
              </Label>
              <p className="!mb-4 text-sm text-zinc-500">This is the email address you use to log in to your account.</p>
              <Fieldset>
                <Input disabled name="email" id="user-email" placeholder="Enter your email" type="email" value={formData.email} />
              </Fieldset>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Fieldset>
                <Label className="text-base" htmlFor="user-name">
                  Name
                </Label>
                <p className="!mb-4 text-sm text-zinc-500">Display name for your account.</p>
                <Input id="user-name" name="name" placeholder="Enter your first name" value={formData?.name || ''} onChange={handleOnChange} />
              </Fieldset>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid grid-cols-1 gap-x-6 gap-y-4 pt-6 md:grid-cols-2">
              <Label className="text-base md:col-span-2" htmlFor="password">
                Change Password
              </Label>
              <Fieldset>
                <Label className="text-left" htmlFor="password">
                  New Password
                </Label>
                <Input id="password" name="password" placeholder="Enter a new password" type="password" onChange={handleOnChange} />
              </Fieldset>
              <Fieldset>
                <Label className="text-left" htmlFor="confirmPassword">
                  Confirm Password
                </Label>
                <Input id="confirmPassword" name="confirmPassword" placeholder="Confirm your new password" type="password" onChange={handleOnChange} />
              </Fieldset>
            </CardContent>
          </Card>
          <Button className="w-fit" type="submit">
            {isPending ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
        <DeleteAccountSection />
      </div>
    </div>
  )
}

export default ProfileForm
