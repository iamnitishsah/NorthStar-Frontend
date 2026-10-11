import { Navigate } from "react-router-dom"

import { useAuthStore } from "@/app/store/auth-store"
import type { UserRole } from "@/types/auth"

type Props = {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

function RoleProtectedRoute({
  children,
  allowedRoles,
}: Props) {
  const user = useAuthStore(
    (state) => state.user
  )

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RoleProtectedRoute
