'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'
import type { Session } from 'next-auth'

type ProvidersProps = {
  children: ReactNode
  session: Session | null
}

const Providers = ({ children, session }: ProvidersProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>
}

export default Providers
