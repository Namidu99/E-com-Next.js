'use client'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      className="p-2 rounded border"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
