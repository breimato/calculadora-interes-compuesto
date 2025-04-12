"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Switch } from "../ui/switch"

export function ThemeToggle() {
  const [theme, setThemeState] = useState("dark")
  
  useEffect(() => {
    // Obtener el tema actual del DOM al cargar
    const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light"
    setThemeState(currentTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    
    // Actualizar el DOM
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(newTheme)
    
    // Guardar en localStorage
    localStorage.setItem("theme", newTheme)
    
    // Actualizar el estado
    setThemeState(newTheme)
  }

  const isDark = theme === "dark"

  return (
    <div className="flex items-center gap-2 bg-secondary/30 p-1 px-3 rounded-full backdrop-blur-sm border border-border/30 shadow-md">
      <Sun className={`h-4 w-4 ${isDark ? 'text-muted-foreground' : 'text-amber-500'}`} />
      <Switch 
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-amber-400"
      />
      <Moon className={`h-4 w-4 ${isDark ? 'text-indigo-400' : 'text-muted-foreground'}`} />
      <span className="sr-only">Cambiar tema</span>
    </div>
  )
}
