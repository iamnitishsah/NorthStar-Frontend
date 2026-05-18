import { LogOut, Menu, Moon, Search, Sun } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuthStore } from "@/app/store/auth-store"
import { useTheme } from "@/app/providers/use-theme"
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
    <header className="dashboard-surface theme-transition flex h-16 items-center justify-between rounded-none border-x-0 border-t-0 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Open navigation"
          className="theme-transition rounded-md border border-border p-2 text-muted-foreground hover:bg-hover hover:text-foreground md:hidden"
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
            <p className="truncate text-xs text-muted-foreground">
              {user.name} · {user.designation} · {user.department}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted-foreground lg:flex">
          <Search size={16} />
          Search goals, people, audits
        </div>

        <button
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="theme-transition rounded-md border border-border p-2 text-muted-foreground hover:bg-hover hover:text-foreground"
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
