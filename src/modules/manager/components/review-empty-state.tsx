import { ClipboardCheck } from "lucide-react"

function ReviewEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-input bg-card p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <ClipboardCheck size={22} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-card-foreground">
        No goals awaiting review
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Submitted employee goals will appear here for approval or return.
      </p>
    </div>
  )
}

export default ReviewEmptyState
