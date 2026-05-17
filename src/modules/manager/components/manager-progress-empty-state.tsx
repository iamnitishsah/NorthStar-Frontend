import { LineChart } from "lucide-react"

function ManagerProgressEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <LineChart size={22} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">
        No locked goals to track
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Approved goals and employee quarterly check-ins will appear here.
      </p>
    </div>
  )
}

export default ManagerProgressEmptyState
