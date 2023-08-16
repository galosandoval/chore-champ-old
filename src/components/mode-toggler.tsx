'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ModeToggle() {
  const { setTheme } = useTheme()

  return <Button onClick={() => setTheme('dark')}>Theme</Button>
}
