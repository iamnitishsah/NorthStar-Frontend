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
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:border-[#0D47A1]/25 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
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

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target</dt>
          <dd className="mt-1 font-mono font-semibold text-slate-950">
            {goal.target_value}{" "}
            <span className="text-slate-500">
              {goal.uom_type}
            </span>
          </dd>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Weightage</dt>
          <dd className="mt-1 font-mono font-semibold text-slate-950">
            {goal.weightage}%
          </dd>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Measure</dt>
          <dd className="mt-1 font-mono font-semibold text-slate-950">
            {goal.measurement_type}
          </dd>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Goal ID</dt>
          <dd className="mt-1 truncate font-mono font-semibold text-slate-950">
            {goal.goal_id}
          </dd>
        </div>
      </dl>

      {canAct && (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
          <button
            className="flex items-center gap-2 rounded-md bg-[#2E7D32] px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
            onClick={() => onApprove(goal)}
            type="button"
          >
            <Check size={16} />
            Approve
          </button>

          <button
            className="flex items-center gap-2 rounded-md border border-orange-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#EF6C00] hover:bg-orange-50"
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
