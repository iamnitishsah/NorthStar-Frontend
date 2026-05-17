import { Check, RotateCcw } from "lucide-react"

import type { Goal } from "@/types/goal"

import ReviewStatusBadge from "./review-status-badge"

type Props = {
  goal: Goal
  onApprove: (goal: Goal) => void
  onReturn: (goal: Goal) => void
}

function ReviewGoalCard({
  goal,
  onApprove,
  onReturn,
}: Props) {
  const canAct = goal.status === "SUBMITTED"

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">
            {goal.thrust_area}
          </p>
          <h3 className="text-lg font-semibold text-slate-950">
            {goal.title}
          </h3>
        </div>

        <ReviewStatusBadge status={goal.status} />
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {goal.description || "No description provided."}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-slate-500">Target</dt>
          <dd className="font-medium text-slate-950">
            {goal.target_value}{" "}
            <span className="text-slate-500">
              {goal.uom_type}
            </span>
          </dd>
        </div>

        <div>
          <dt className="text-slate-500">Weightage</dt>
          <dd className="font-medium text-slate-950">
            {goal.weightage}%
          </dd>
        </div>

        <div>
          <dt className="text-slate-500">Measure</dt>
          <dd className="font-medium text-slate-950">
            {goal.measurement_type}
          </dd>
        </div>

        <div>
          <dt className="text-slate-500">Goal ID</dt>
          <dd className="truncate font-medium text-slate-950">
            {goal.goal_id}
          </dd>
        </div>
      </dl>

      {canAct && (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
          <button
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            onClick={() => onApprove(goal)}
            type="button"
          >
            <Check size={16} />
            Approve
          </button>

          <button
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            onClick={() => onReturn(goal)}
            type="button"
          >
            <RotateCcw size={16} />
            Return
          </button>
        </div>
      )}
    </article>
  )
}

export default ReviewGoalCard
