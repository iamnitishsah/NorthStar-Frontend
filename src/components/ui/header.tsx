import { LogOut, Menu, Moon, Search, Sun } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuthStore } from "@/app/store/auth-store"
import { useTheme } from "@/app/providers/theme-provider"
import Button from "./button"

type Props = {
  onMenuClick: () => void
}

function Header({ onMenuClick }: Props) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { theme, toggleTheme } = useTheme()

  const logout = useAuthStore(
    (state) => state.logout
  )

  function handleLogout() {
    logout()

    navigate("/login")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Open navigation"
          className="rounded-md border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold">
            Operations Console
          </h2>
          {user && (
            <p className="truncate text-xs text-slate-500">
              {user.name} · {user.designation} · {user.department}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 lg:flex">
          <Search size={16} />
          Search goals, people, audits
        </div>

        <button
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          type="button"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Button
          className="px-3 py-2 sm:px-4"
          icon={<LogOut size={18} />}
          onClick={handleLogout}
          variant="secondary"
        >
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}

export default Header
