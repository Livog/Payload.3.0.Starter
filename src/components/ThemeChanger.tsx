'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Skeleton } from '@/components/ui/Skeleton'
import { MoonIcon, SunIcon, ComputerIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'

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
    <Select onValueChange={(value) => setTheme(value)} value={theme}>
      <SelectTrigger className="w-[150px] transition-all duration-300 ease-in-out dark:hover:text-white [&>span]:ml-2 [&>span]:mr-auto">
        {theme === 'system' ? <ComputerIcon className="h-5 w-5" /> : null}
        {theme === 'dark' ? <MoonIcon className="h-5 w-5" /> : null}
        {theme === 'light' ? <SunIcon className="h-5 w-5" /> : null}
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default ThemeSwitch
