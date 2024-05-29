import ProfileForm from '@/components/ProfileForm'
import { getCurrentUser } from '@/lib/payload'
import { CreditCard, UserRound } from 'lucide-react'
import { redirect } from 'next/navigation'

const ProfilePage = async () => {
  const user = await getCurrentUser()
  if (!user) return redirect('/sign-in')
  return <ProfileForm user={user} />
}

export default ProfilePage
