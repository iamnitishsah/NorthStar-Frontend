import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

import { getRoleHomePath } from "@/app/navigation"
import { useAuthStore } from "@/app/store/auth-store"

type Props = {
  children: ReactNode
}

function PublicOnlyRoute({ children }: Props) {
  const token = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)

  if (token && user) {
    return <Navigate to={getRoleHomePath(user.role)} replace />
  }

  return children
}

export default PublicOnlyRoute

