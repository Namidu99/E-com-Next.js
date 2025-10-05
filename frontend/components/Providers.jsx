'use client'

import { ThemeProvider } from 'next-themes'
import AuthProvider from '../context/AuthContext'

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}