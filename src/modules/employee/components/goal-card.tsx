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
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {goal.thrust_area}
          </p>

          <h3 className="text-xl font-semibold">
            {goal.title}
          </h3>
        </div>

        <GoalStatusBadge
          status={goal.status}
        />
      </div>

      <p className="text-slate-600 text-sm">
        {goal.description}
      </p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500">
            Target
          </p>

          <p className="font-medium">
            {goal.target_value}
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
          className="flex items-center gap-2 text-red-500 text-sm"
        >
          <Trash2 size={16} />

          Delete
        </button>
      )}
    </div>
  )
}

export default GoalCard