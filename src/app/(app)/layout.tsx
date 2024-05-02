import '@/app/style.css'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import cn from '@/utils/cn'
import type { Viewport } from 'next'
import { ThemeProvider } from 'next-themes'
import { Inter as FontSans } from 'next/font/google'

const fontSans = FontSans({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-sans',
  display: 'swap'
})

export const viewport: Viewport = {
  themeColor: '#161616'
}

const Layout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  return (
    <html lang="en" className={cn(fontSans.variable, 'h-full')} suppressHydrationWarning>
      <body className="overflow-x-hidden bg-zinc-50 font-sans antialiased dark:bg-zinc-940 dark:text-white">
        <ThemeProvider attribute="class">
          <div className="app flex min-h-screen flex-col">
            <Header />
            <main className="flex grow flex-col">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default Layout
