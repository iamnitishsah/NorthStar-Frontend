import { Building2, LogOut, Menu, Moon, Sun } from "lucide-react"
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
  const logout = useAuthStore((state) => state.logout)

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <header className="theme-transition sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Open navigation"
          className="theme-transition rounded-lg border border-border bg-surface p-2 text-muted-foreground hover:bg-hover hover:text-foreground md:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="truncate text-base font-bold tracking-tight text-card-foreground sm:text-lg">
              Operations Console
            </h2>
            <span className="hidden items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-2.5 py-0.5 text-[11px] font-semibold text-success sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Active Cycle
            </span>
          </div>
          {user && (
            <p className="truncate text-xs text-muted-foreground">
              {user.name} · {user.designation}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {user && (
          <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-surface-foreground lg:flex">
            <Building2 size={14} className="text-primary" />
            <span>{user.department}</span>
            <span className="text-muted-foreground">·</span>
            <span className="font-mono text-muted-foreground">{user.employee_id}</span>
          </div>
        )}

        <button
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="theme-transition inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-surface-foreground shadow-enterprise-sm hover:border-primary/35 hover:bg-hover"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          type="button"
        >
          {theme === "dark" ? (
            <>
              <Sun size={16} className="text-warning" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon size={16} className="text-primary" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        <Button
          className="px-3.5 py-2"
          icon={<LogOut size={16} />}
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
