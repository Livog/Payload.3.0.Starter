import '@/app/style.css'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import cn from '@/utils/cn'
import type { Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
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
    <html lang="en" className={cn(inter.variable, 'h-full')} suppressHydrationWarning>
      <body className="flex h-full flex-col bg-zinc-50 dark:bg-zinc-940 dark:text-white">
        <ThemeProvider attribute="class">
          <Header />
          <main className="grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default Layout
