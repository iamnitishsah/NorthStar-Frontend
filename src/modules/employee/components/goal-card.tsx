import { ClipboardCheck, LockOpen, Pencil, Share2, Trash2 } from "lucide-react"

import type { Goal } from "@/types/goal"

import GoalStatusBadge from "./goal-status-badge"
import { isEditableGoal } from "../utils/goal-form"
import QuarterlyTimeline from "@/modules/quarterly/components/quarterly-timeline"
import { useAuthStore } from "@/app/store/auth-store"

type Props = {
  goal: Goal
  onDelete: (id: string) => void
  onEdit: (goal: Goal) => void
  onCheckin: (goal: Goal) => void
  onRequestUnlock: (goal: Goal) => void
  isSelected?: boolean
  onSelectChange?: (goal: Goal, selected: boolean) => void
}

function GoalCard({
  goal,
  onDelete,
  onEdit,
  onCheckin,
  onRequestUnlock,
  isSelected,
  onSelectChange,
}: Props) {
  const currentEmployeeId = useAuthStore((state) => state.user?.employee_id)
  const description =
    goal.description || "No description provided."
  const canEdit = isEditableGoal(goal)
  const canCheckin =
    goal.status === "LOCKED" &&
    (!goal.is_shared || goal.primary_owner_id === currentEmployeeId)
  const canRequestUnlock = goal.status === "LOCKED"
  const showSelection = Boolean(onSelectChange)
  const selectionId = `goal-select-${goal.goal_id}`

  return (
    <article className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-[#0D47A1]/25 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {goal.thrust_area}
          </p>

          <h3 className="text-lg font-semibold text-slate-950 break-words">
            {goal.title}
          </h3>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {showSelection && (
            <label
              className="flex items-center gap-2 text-xs font-semibold text-slate-600"
              htmlFor={selectionId}
            >
              <input
                checked={Boolean(isSelected)}
                className="h-4 w-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1]"
                id={selectionId}
                onChange={(event) =>
                  onSelectChange?.(goal, event.target.checked)
                }
                type="checkbox"
              />
              Select
            </label>
          )}
          <GoalStatusBadge
            status={goal.status}
          />
          {goal.is_shared && (
            <span className="inline-flex items-center gap-1 rounded-md bg-[#00897B]/10 px-2 py-1 text-xs font-semibold text-[#00897B]">
              <Share2 size={13} />
              Shared
            </span>
          )}
        </div>
      </div>

      <p className="text-slate-600 text-sm leading-6">
        {description}
      </p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Target
          </p>

          <p className="mt-1 font-mono font-semibold text-slate-950">
            {goal.target_value}{" "}
            <span className="text-slate-500">
              {goal.uom_type}
            </span>
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Weightage
          </p>

          <p className="mt-1 font-mono font-semibold text-slate-950">
            {goal.weightage}%
          </p>
        </div>
      </div>

      {canCheckin && (
        <QuarterlyTimeline
          goal={goal}
          compact
        />
      )}

      {(canEdit || canCheckin || canRequestUnlock) && (
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          {canEdit && (
            <button
              onClick={() => onEdit(goal)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#0D47A1]"
              type="button"
            >
              <Pencil size={16} />
              Edit
            </button>
          )}

          {canCheckin && (
            <button
              onClick={() => onCheckin(goal)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#00897B]"
              type="button"
            >
              <ClipboardCheck size={16} />
              Check-in
            </button>
          )}

          {canRequestUnlock && (
            <button
              onClick={() => onRequestUnlock(goal)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:text-[#EF6C00]"
              type="button"
            >
              <LockOpen size={16} />
              Request Unlock
            </button>
          )}

          {goal.status === "DRAFT" && (
            <button
              onClick={() =>
                onDelete(goal.goal_id)
              }
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[#C62828] hover:bg-red-50"
              type="button"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  )
}

export default GoalCard
