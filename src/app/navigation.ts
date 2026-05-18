import {
  LayoutDashboard,
  Target,
  ClipboardCheck,
  Share2,
  ShieldCheck,
  ScrollText,
  TrendingUp,
  Users,
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
      label: "Organization",
      path: "/organization",
      icon: Users,
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
      label: "Organization",
      path: "/organization",
      icon: Users,
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
    {
      label: "Shared Goals",
      path: "/shared-goals",
      icon: Share2,
    },
  ],

  ADMIN: [
    {
      label: "Control Center",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Organization",
      path: "/organization",
      icon: Users,
    },
    {
      label: "Audit Logs",
      path: "/admin/logs",
      icon: ScrollText,
    },
    {
      label: "Shared Goals",
      path: "/shared-goals",
      icon: Share2,
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
