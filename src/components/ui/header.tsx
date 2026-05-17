import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useAuthStore } from "@/app/store/auth-store"

function Header() {
  const navigate = useNavigate()

  const logout = useAuthStore(
    (state) => state.logout
  )

  function handleLogout() {
    logout()

    navigate("/login")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
      <div className="min-w-0">
        <h2 className="font-semibold text-lg">
          NorthStar Portal
        </h2>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-slate-100 sm:px-4"
        type="button"
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  )
}

export default Header
