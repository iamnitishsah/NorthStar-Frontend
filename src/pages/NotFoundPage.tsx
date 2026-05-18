import { Link } from "react-router-dom"
import { Compass } from "lucide-react"

import EmptyState from "@/components/ui/empty-state"

function NotFoundPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4 text-foreground">
      <div className="w-full max-w-xl">
        <EmptyState
          icon={Compass}
          title="Page not found"
          description="The route you opened does not exist in NorthStar."
          action={
            <Link
              className="theme-transition inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              to="/login"
            >
              Go to login
            </Link>
          }
        />
      </div>
    </div>
  )
}

export default NotFoundPage
