import { Plus } from "lucide-react"

type Props = {
  onCreate: () => void
}

function GoalsEmptyState({ onCreate }: Props) {
  return (
    <div className="rounded-lg border border-dashed border-input bg-card p-8 text-center">
      <h2 className="text-lg font-semibold text-card-foreground">
        No goals found
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Create your first draft goal, assign weightage, then submit your goal sheet when the total reaches 100%.
      </p>
      <button
        className="mx-auto mt-5 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        onClick={onCreate}
        type="button"
      >
        <Plus size={16} />
        Create Goal
      </button>
    </div>
  )
}

export default GoalsEmptyState
