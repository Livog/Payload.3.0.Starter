import '@/app/style.css'
import Header from '@/components/Header'
import type { Viewport } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-inter',
  display: 'swap'
})

export const viewport: Viewport = {
  themeColor: '#161616'
}

const Layout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="overflow-x-hidden bg-zinc-940 text-white">
        <div className="flex min-h-screen flex-col justify-between">
          <Header />
          <main className="flex-grow">{children}</main>
          <footer className="bg-zinc-950 text-white"></footer>
        </div>
      </body>
    </html>
  )
}

export default Layout
