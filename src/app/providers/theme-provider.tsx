import {
  useEffect,
  useMemo,
  useState,
} from "react"
import type { ReactNode } from "react"

import { ThemeContext } from "./theme-context"
import type { Theme } from "./theme-context"

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"

  const savedTheme = localStorage.getItem("northstar-theme")

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement

    root.classList.toggle("dark", theme === "dark")
    root.classList.toggle("light", theme === "light")
    localStorage.setItem("northstar-theme", theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () =>
        setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
