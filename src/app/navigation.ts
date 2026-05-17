import {
  LayoutDashboard,
  Target,
  ClipboardCheck,
  ShieldCheck,
  ScrollText,
  TrendingUp,
} from "lucide-react"
import type { UserRole } from "@/types/auth"

export const roleHomePath: Record<UserRole, string> = {
  EMPLOYEE: "/employee/dashboard",
  MANAGER: "/manager/dashboard",
  HR: "/login",
  ADMIN: "/admin/dashboard",
}

export function getRoleHomePath(role: UserRole): string {
  return roleHomePath[role] || "/login"
}

export const navigation = {
  EMPLOYEE: [
    {
      label: "Dashboard",
      path: "/employee/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Goals",
      path: "/employee/goals",
      icon: Target,
    },
  ],

  MANAGER: [
    {
      label: "Dashboard",
      path: "/manager/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Review Goals",
      path: "/manager/review",
      icon: ClipboardCheck,
    },
    {
      label: "Progress",
      path: "/manager/progress",
      icon: TrendingUp,
    },
  ],

  ADMIN: [
    {
      label: "Control Center",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Audit Logs",
      path: "/admin/logs",
      icon: ScrollText,
    },
  ],

  HR: [
    {
      label: "Dashboard",
      path: "/login",
      icon: ShieldCheck,
    },
  ],
}
