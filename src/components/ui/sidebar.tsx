import { Link, NavLink } from "react-router-dom"
import { Sparkles, X } from "lucide-react"

import { navigation } from "@/app/navigation"
import { useAuthStore } from "@/app/store/auth-store"
import { cn } from "@/lib/utils"
import { StatusBadge } from "./status-badge"

type Props = {
  isOpen?: boolean
  onClose?: () => void
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const user = useAuthStore((state) => state.user)

  if (!user) return null

  const items = navigation[user.role] || []

  return (
    <>
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            onClick={onClose}
            className="group flex min-w-0 items-center gap-3.5"
          >
            <div className="northstar-mark flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl transition-transform group-hover:scale-105">
              <img
                alt="NorthStar"
                className="h-full w-full"
                src="/favicon.svg"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-bold tracking-tight text-card-foreground">
                  NorthStar
                </h1>
                <StatusBadge tone="info" className="px-1.5 py-0 text-[10px]">
                  {user.role}
                </StatusBadge>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                Performance Operations
              </p>
            </div>
          </Link>

          {onClose && (
            <button
              aria-label="Close navigation"
              className="theme-transition rounded-lg border border-transparent p-2 text-muted-foreground hover:border-border hover:bg-hover hover:text-foreground md:hidden"
              onClick={onClose}
              type="button"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="px-6 pt-5 pb-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Workspace Navigation
        </p>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-2" aria-label="Primary navigation">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              onClick={onClose}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "theme-transition group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-enterprise-sm"
                    : "text-muted-foreground hover:bg-hover hover:text-foreground"
                )
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-3">
        <Link
          to="/"
          onClick={onClose}
          className="theme-transition flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            Portal Overview
          </span>
          <span className="font-mono text-[10px] uppercase text-primary">Home</span>
        </Link>

        <div className="inset-panel flex items-center gap-3 rounded-xl p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/12 font-mono text-sm font-bold text-primary">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-surface-foreground">
              {user.name}
            </p>
            <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
              {user.employee_id} · {user.department}
            </p>
          </div>
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
      <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-card text-card-foreground md:flex">
        <SidebarContent />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-black/65 backdrop-blur-xs"
            onClick={onClose}
            type="button"
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-border bg-card text-card-foreground shadow-enterprise-md">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar
