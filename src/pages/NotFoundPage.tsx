import { Link } from "react-router-dom"
import { Compass } from "lucide-react"

import EmptyState from "@/components/ui/empty-state"

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-xl">
        <EmptyState
          icon={Compass}
          title="Page not found"
          description="The route you opened does not exist in NorthStar."
          action={
            <Link
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
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
