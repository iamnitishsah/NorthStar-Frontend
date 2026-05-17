import { Trash2 } from "lucide-react"

import type { Goal } from "@/types/goal"

import GoalStatusBadge from "./goal-status-badge"

type Props = {
  goal: Goal
  onDelete: (id: string) => void
}

function GoalCard({
  goal,
  onDelete,
}: Props) {
  const description =
    goal.description || "No description provided."

  return (
    <article className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">
            {goal.thrust_area}
          </p>

          <h3 className="text-lg font-semibold text-slate-950 break-words">
            {goal.title}
          </h3>
        </div>

        <GoalStatusBadge
          status={goal.status}
        />
      </div>

      <p className="text-slate-600 text-sm leading-6">
        {description}
      </p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500">
            Target
          </p>

          <p className="font-medium">
            {goal.target_value}{" "}
            <span className="text-slate-500">
              {goal.uom_type}
            </span>
          </p>
        </div>

        <div>
          <p className="text-slate-500">
            Weightage
          </p>

          <p className="font-medium">
            {goal.weightage}%
          </p>
        </div>
      </div>

      {goal.status === "DRAFT" && (
        <button
          onClick={() =>
            onDelete(goal.goal_id)
          }
          className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
          type="button"
        >
          <Trash2 size={16} />

          Delete
        </button>
      )}
    </article>
  )
}

export default GoalCard
