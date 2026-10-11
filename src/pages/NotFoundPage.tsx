import { Link } from "react-router-dom"
import { Compass } from "lucide-react"

import { getRoleHomePath } from "@/app/navigation"
import { useAuthStore } from "@/app/store/auth-store"
import EmptyState from "@/components/ui/empty-state"

function NotFoundPage() {
  const user = useAuthStore((state) => state.user)
  const homePath = user ? getRoleHomePath(user.role) : "/"

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-xl">
        <EmptyState
          icon={Compass}
          title="Page not found"
          description="The route you opened does not exist in NorthStar."
          action={
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {user ? (
                <Link
                  className="theme-transition inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  to={homePath}
                >
                  Back to workspace
                </Link>
              ) : null}
              <Link
                className="theme-transition inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-hover"
                to="/"
              >
                Return to Landing Page
              </Link>
            </div>
          }
        />
      </div>
    </div>
  )
}

export default NotFoundPage
