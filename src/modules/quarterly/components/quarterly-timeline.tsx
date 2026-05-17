import { MessageSquare, Share2 } from "lucide-react"

import type { Goal } from "@/types/goal"

import ProgressBar from "./progress-bar"
import {
  getDisplayProgress,
  getProgressStatusClassName,
  getQuarterLabel,
  quarterKeys,
} from "../utils/quarterly"

type Props = {
  goal: Goal
  compact?: boolean
  onComment?: (goal: Goal, quarter: number) => void
}

function QuarterlyTimeline({
  goal,
  compact = false,
  onComment,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-900">
          Quarterly Progress
        </h4>

        {goal.is_shared && (
          <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
            <Share2 size={13} />
            Synced shared goal
          </span>
        )}
      </div>

      <div className={compact ? "grid gap-3" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-4"}>
        {quarterKeys.map((quarter) => {
          const checkin = goal.quarter?.[quarter]
          const progress = getDisplayProgress(goal, quarter)
          const quarterNumber = Number(quarter)

          return (
            <div
              className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              key={quarter}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-slate-950">
                  {getQuarterLabel(quarter)}
                </span>
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${getProgressStatusClassName(checkin?.progress_status)}`}
                >
                  {checkin?.progress_status ?? "PENDING"}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Achievement</span>
                  <span className="font-medium text-slate-900">
                    {checkin ? checkin.achievement_value : "-"}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-medium text-slate-900">
                    {progress === null || progress === undefined
                      ? "-"
                      : `${Math.round(progress)}%`}
                  </span>
                </div>

                <ProgressBar value={progress} />
              </div>

              {checkin?.manager_note && (
                <p className="mt-3 rounded border border-slate-200 bg-white p-2 text-xs leading-5 text-slate-600">
                  {checkin.manager_note}
                </p>
              )}

              {onComment && checkin && (
                <button
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-950"
                  onClick={() => onComment(goal, quarterNumber)}
                  type="button"
                >
                  <MessageSquare size={14} />
                  Comment
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default QuarterlyTimeline
