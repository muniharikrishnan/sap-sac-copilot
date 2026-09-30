'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { RiMoonLine, RiSunLine } from '@remixicon/react'
import cn from '@/utils/classnames'
import { THEME_STORAGE_KEY } from '@/config'

const ThemeToggle: FC<{ className?: string }> = ({ className }) => {
  // The real theme is applied to <html> by an inline script in app/layout.tsx.
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !isDark
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light')
    }
    catch { }
    setIsDark(next)
  }

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn('flex items-center justify-center h-9 w-9 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors', className)}
    >
      {isDark ? <RiSunLine className="h-[18px] w-[18px]" /> : <RiMoonLine className="h-[18px] w-[18px]" />}
    </button>
  )
}

export default React.memo(ThemeToggle)
