import { NavLink } from "react-router-dom"
import { X } from "lucide-react"

import { navigation } from "@/app/navigation"
import { useAuthStore } from "@/app/store/auth-store"

type Props = {
  isOpen?: boolean
  onClose?: () => void
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const user = useAuthStore(
    (state) => state.user
  )

  if (!user) return null

  const items =
    navigation[user.role] || []

  return (
    <>
      <div className="border-b border-slate-800 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              NorthStar
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Goal Tracking Portal
            </p>
          </div>

          {onClose && (
            <button
              aria-label="Close navigation"
              className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
              onClick={onClose}
              type="button"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              onClick={onClose}
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

      <div className="border-t border-slate-800 p-4">
        <div className="text-sm">
          <p className="font-medium">
            {user.name}
          </p>

          <p className="text-slate-400">
            {user.role} · {user.department}
          </p>
        </div>
      </div>
    </>
  )
}

function Sidebar({
  isOpen = false,
  onClose,
}: Props) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 text-white md:flex">
        <SidebarContent />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-slate-950/50"
            onClick={onClose}
            type="button"
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-slate-900 text-white shadow-xl">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar
