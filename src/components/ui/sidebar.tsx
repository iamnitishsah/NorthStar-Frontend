import { NavLink } from "react-router-dom"

import { navigation } from "@/app/navigation"
import { useAuthStore } from "@/app/store/auth-store"

function Sidebar() {
  const user = useAuthStore(
    (state) => state.user
  )

  if (!user) return null

  const items =
    navigation[user.role] || []

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 text-white md:flex">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">
          NorthStar
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Goal Tracking Portal
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3 rounded-lg px-4 py-3 transition
                ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }
              `
              }
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="text-sm">
          <p className="font-medium">
            {user.name}
          </p>

          <p className="text-slate-400">
            {user.role}
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
