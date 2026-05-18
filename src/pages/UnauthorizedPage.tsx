import { Link } from "react-router-dom"
import { ShieldAlert } from "lucide-react"

import { getRoleHomePath } from "@/app/navigation"
import { useAuthStore } from "@/app/store/auth-store"
import EmptyState from "@/components/ui/empty-state"

function UnauthorizedPage() {
  const user = useAuthStore((state) => state.user)
  const homePath = user ? getRoleHomePath(user.role) : "/login"

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-xl">
        <EmptyState
          icon={ShieldAlert}
          title="Unauthorized"
          description="Your current role does not have access to this page."
          action={
            <Link
              className="theme-transition inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              to={homePath}
            >
              Back to workspace
            </Link>
          }
        />
      </div>
    </div>
  )
}

export default UnauthorizedPage
