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

        <div className="flex shrink-0 flex-col items-end gap-2">
          {showSelection && (
            <label
              className="flex items-center gap-2 text-xs font-medium text-slate-600"
              htmlFor={selectionId}
            >
              <input
                checked={Boolean(isSelected)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
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
            <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
              <Share2 size={13} />
              Shared
            </span>
          )}
        </div>
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

      {canCheckin && (
        <QuarterlyTimeline
          goal={goal}
          compact
        />
      )}

      {(canEdit || canCheckin || canRequestUnlock) && (
        <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
          {canEdit && (
            <button
              onClick={() => onEdit(goal)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950"
              type="button"
            >
              <Pencil size={16} />
              Edit
            </button>
          )}

          {canCheckin && (
            <button
              onClick={() => onCheckin(goal)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950"
              type="button"
            >
              <ClipboardCheck size={16} />
              Check-in
            </button>
          )}

          {canRequestUnlock && (
            <button
              onClick={() => onRequestUnlock(goal)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-950"
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
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
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
