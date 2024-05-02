'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { useState } from 'react'
import type { User } from '~/payload-types'
import { Fieldset } from '@/components/ui/FieldSet'
import { Card, CardContent, CardFooter } from '../ui/Card'
import { updateUser } from './actions'

const ProfileForm = ({ user }: { user: User }) => {
  const [formData, setFormData] = useState<User>(user)

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold">Update Profile</h2>
        <p className="text-gray-500 dark:text-gray-400">Make changes to your profile details below.</p>
      </div>
      <div className="space-y-4">
        <form action={updateUser} className="space-y-4">
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
            <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 pt-6">
              <Label className="col-span-2 text-base" htmlFor="password">
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
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  type="password"
                  onChange={handleOnChange}
                />
              </Fieldset>
            </CardContent>
          </Card>
          <Button className="w-fit" type="submit">
            Update Profile
          </Button>
        </form>
        <h2 className="!mt-10 text-xl font-semibold">Danger Zone</h2>
        <Card className="border-red-500/40 dark:border-red-500/50">
          <CardContent className="space-y-2 pt-6">
            <h4 className="font-semibold">Delete Account</h4>
            <p className="text-sm text-zinc-500">
              Permanently remove your Personal Account and all of its contents from the platform. This action is not reversible, so please continue
              with caution.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end bg-red-500/10 p-3">
            <Button color="red">Delete Accout</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ProfileForm
