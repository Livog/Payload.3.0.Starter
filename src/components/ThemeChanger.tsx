'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Skeleton } from '@/components/ui/Skeleton'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Skeleton className="h-11" />
  }

  return (
    <select
      className="block w-full appearance-none rounded-md bg-zinc-50 p-3 text-sm text-black dark:bg-zinc-800 dark:text-white"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}>
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  )
}

export default ThemeSwitch
