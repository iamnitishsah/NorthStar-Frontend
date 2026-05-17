import { Share2 } from "lucide-react"

import type { Goal } from "@/types/goal"
import QuarterlyTimeline from "@/modules/quarterly/components/quarterly-timeline"
import ProgressBar from "@/modules/quarterly/components/progress-bar"

type Props = {
  goal: Goal
  onComment: (goal: Goal, quarter: number) => void
}

function ManagerProgressCard({
  goal,
  onComment,
}: Props) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-slate-500">
              {goal.thrust_area}
            </p>
            {goal.is_shared && (
              <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                <Share2 size={13} />
                Shared
              </span>
            )}
          </div>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">
            {goal.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {goal.description || "No description provided."}
          </p>
        </div>

        <div className="w-full rounded-lg border border-slate-200 bg-slate-50 p-4 lg:w-64">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Progress</span>
            <span className="font-semibold text-slate-950">
              {goal.progress_percentage === null ||
              goal.progress_percentage === undefined
                ? "-"
                : `${Math.round(goal.progress_percentage)}%`}
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar value={goal.progress_percentage} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-500">Target</p>
              <p className="font-medium text-slate-950">
                {goal.target_value}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Weightage</p>
              <p className="font-medium text-slate-950">
                {goal.weightage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <QuarterlyTimeline
          goal={goal}
          onComment={onComment}
        />
      </div>
    </article>
  )
}

export default ManagerProgressCard
