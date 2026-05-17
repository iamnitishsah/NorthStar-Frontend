import { LogOut, Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuthStore } from "@/app/store/auth-store"
import Button from "./button"

type Props = {
  onMenuClick: () => void
}

function Header({ onMenuClick }: Props) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const logout = useAuthStore(
    (state) => state.logout
  )

  function handleLogout() {
    logout()

    navigate("/login")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Open navigation"
          className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 md:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold">
            NorthStar Portal
          </h2>
          {user && (
            <p className="truncate text-xs text-slate-500">
              {user.name} · {user.designation}
            </p>
          )}
        </div>
      </div>

      <Button
        className="px-3 sm:px-4"
        icon={<LogOut size={18} />}
        onClick={handleLogout}
        variant="secondary"
      >
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </header>
  )
}

export default Header
