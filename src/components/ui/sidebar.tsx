import { NavLink } from "react-router-dom"
import { Sparkles, Star, X } from "lucide-react"

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
      <div className="border-b border-white/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0B1220] shadow-sm">
              <Star className="fill-[#00897B] text-[#00897B]" size={25} />
              <Sparkles className="absolute right-1 top-1 text-[#0D47A1]" size={11} />
            </div>
            <h1 className="text-2xl font-bold">
              NorthStar
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Performance Operations
            </p>
          </div>

          {onClose && (
            <button
              aria-label="Close navigation"
              className="rounded-md p-2 text-slate-300 hover:bg-white/10 md:hidden"
              onClick={onClose}
              type="button"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4" aria-label="Primary navigation">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              onClick={onClose}
              to={item.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition
                ${
                  isActive
                    ? "bg-[#0D47A1] text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
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

      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm">
          <p className="font-semibold">
            {user.name}
          </p>

          <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
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
      <aside className="hidden w-72 shrink-0 flex-col bg-[#0B1220] text-white md:flex">
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
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-[#0B1220] text-white shadow-xl">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar
