import { Button } from '@/components/ui/Button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import { Card, CardContent, CardFooter } from '../ui/Card'
import { Label } from '@/components/ui/Label'
import { deleteUser } from './actions'

export default function DeleteAccountSection() {
  const [isAllowedToDelete, setIsAllowedToDelete] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [state, deleteUserAction, isPending] = useFormState(deleteUser, null)

  return (
    <>
      <h2 className="!mt-10 text-xl font-semibold">Danger Zone</h2>
      <Card className="border-red-500/40 dark:border-red-500/50">
        <CardContent className="space-y-2 pt-6">
          <h4 className="font-semibold">Delete Account</h4>
          <p className="text-sm text-zinc-500">
            Permanently remove your Personal Account and all of its contents from the platform. This action is not reversible, so please continue with caution.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end bg-red-500/10 p-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button color="red">Delete Accout</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-2 md:text-2xl">Are you sure?</DialogTitle>
                <DialogDescription className="text-base dark:text-white">
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <Label>
                Type <span className="rounded-md border bg-zinc-50 p-0.5 italic dark:border-zinc-700 dark:bg-zinc-800">delete</span> to confirm
              </Label>
              <Input
                type="text"
                placeholder="We are sad to see you go!"
                value={confirmation}
                onChange={(e) => {
                  setConfirmation(e.target.value)
                  if (e.target.value === 'delete') {
                    setIsAllowedToDelete(true)
                  } else {
                    setIsAllowedToDelete(false)
                  }
                }}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <form action={deleteUserAction}>
                  <Button color="red" disabled={!isAllowedToDelete}>
                    {isPending ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  )
}
