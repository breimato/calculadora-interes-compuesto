"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext({})

export function ThemeProvider({ children, defaultTheme = "dark", ...props }) {
  const [theme, setTheme] = useState(
    () => (typeof window !== "undefined" && localStorage.getItem("theme")) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme) => {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
