import {
  LayoutDashboard,
  Target,
  ClipboardCheck,
  ShieldCheck,
  ScrollText,
} from "lucide-react"
import type { UserRole } from "@/types/auth"

export const roleHomePath: Record<UserRole, string> = {
  EMPLOYEE: "/employee/dashboard",
  MANAGER: "/manager/dashboard",
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
  ],

  ADMIN: [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Audit Logs",
      path: "/admin/logs",
      icon: ScrollText,
    },
    {
      label: "Controls",
      path: "/admin/control",
      icon: ShieldCheck,
    },
  ],
}