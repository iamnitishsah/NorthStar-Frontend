import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

import { useAuthStore } from "@/app/store/auth-store"

type Props = {
  children: ReactNode
}

function ProtectedRoute({ children }: Props) {
  const token = useAuthStore(
    (state) => state.accessToken
  )
  const user = useAuthStore((state) => state.user)

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
