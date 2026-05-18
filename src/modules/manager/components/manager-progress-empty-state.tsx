import { LineChart } from "lucide-react"

function ManagerProgressEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-input bg-card p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <LineChart size={22} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-card-foreground">
        No locked goals to track
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Approved goals and employee quarterly check-ins will appear here.
      </p>
    </div>
  )
}

export default ManagerProgressEmptyState
