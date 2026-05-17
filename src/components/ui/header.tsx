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
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <div>
        <h2 className="font-semibold text-lg">
          NorthStar Portal
        </h2>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-slate-100"
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  )
}

export default Header