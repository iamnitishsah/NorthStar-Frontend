import { ClipboardCheck, LockOpen, Pencil, Share2, Trash2 } from "lucide-react"

import Button from "@/components/ui/button"
import { MetricTile, Panel } from "@/components/ui/surface"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatDateIST, formatDateTimeIST } from "@/lib/datetime"
import type { Goal } from "@/types/goal"

import GoalStatusBadge from "./goal-status-badge"
import { isEditableGoal } from "../utils/goal-form"
import QuarterlyTimeline from "@/modules/quarterly/components/quarterly-timeline"

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
  const description =
    goal.description || "No description provided."
  const canEdit = isEditableGoal(goal)
  const canCheckin = goal.status === "LOCKED"
  const canRequestUnlock = goal.status === "LOCKED"
  const showSelection = Boolean(onSelectChange)
  const selectionId = `goal-select-${goal.goal_id}`

  return (
    <Panel className="space-y-4 hover:border-primary/30 hover:shadow-enterprise-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {goal.thrust_area}
          </p>

          <h3 className="break-words text-lg font-semibold text-card-foreground">
            {goal.title}
          </h3>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {showSelection && (
            <label
              className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"
              htmlFor={selectionId}
            >
              <input
                checked={Boolean(isSelected)}
                className="h-4 w-4 rounded border-input accent-primary focus:ring-ring"
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
            <StatusBadge tone="accent" icon={<Share2 size={13} />}>
              Shared
            </StatusBadge>
          )}
        </div>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <MetricTile>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Target
          </p>

          <p className="mt-1 truncate font-mono font-semibold text-surface-foreground">
            {goal.target_value}{" "}
            <span className="text-muted-foreground">
              {goal.uom_type}
            </span>
          </p>
        </MetricTile>

        {goal.target_date && (
          <MetricTile>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Target Date
            </p>

            <p className="mt-1 truncate font-mono font-semibold text-surface-foreground">
              {formatDateIST(goal.target_date)}
            </p>
          </MetricTile>
        )}

        {goal.created_at && (
          <MetricTile>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Created
            </p>

            <p className="mt-1 truncate font-mono font-semibold text-surface-foreground">
              {formatDateTimeIST(goal.created_at)}
            </p>
          </MetricTile>
        )}

        <MetricTile>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Weightage
          </p>

          <p className="mt-1 truncate font-mono font-semibold text-surface-foreground">
            {goal.weightage}%
          </p>
        </MetricTile>
      </div>

      {(goal.approved_at || goal.returned_at || goal.updated_at) && (
        <dl className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
          {goal.approved_at && (
            <div>
              <dt className="font-semibold uppercase tracking-wide">Approved</dt>
              <dd>{formatDateTimeIST(goal.approved_at)}</dd>
            </div>
          )}
          {goal.returned_at && (
            <div>
              <dt className="font-semibold uppercase tracking-wide">Returned</dt>
              <dd>{formatDateTimeIST(goal.returned_at)}</dd>
            </div>
          )}
          {goal.updated_at && (
            <div>
              <dt className="font-semibold uppercase tracking-wide">Updated</dt>
              <dd>{formatDateTimeIST(goal.updated_at)}</dd>
            </div>
          )}
        </dl>
      )}

      {canCheckin && (
        <QuarterlyTimeline
          goal={goal}
          compact
        />
      )}

      {(canEdit || canCheckin || canRequestUnlock) && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {canEdit && (
            <Button
              onClick={() => onEdit(goal)}
              className="px-3 py-2"
              type="button"
              variant="ghost"
            >
              <Pencil size={16} />
              Edit
            </Button>
          )}

          {canCheckin && (
            <Button
              onClick={() => onCheckin(goal)}
              className="px-3 py-2 hover:text-accent"
              type="button"
              variant="ghost"
            >
              <ClipboardCheck size={16} />
              Check-in
            </Button>
          )}

          {canRequestUnlock && (
            <Button
              onClick={() => onRequestUnlock(goal)}
              className="px-3 py-2 hover:text-warning"
              type="button"
              variant="ghost"
            >
              <LockOpen size={16} />
              Request Unlock
            </Button>
          )}

          {goal.status === "DRAFT" && (
            <Button
              onClick={() =>
                onDelete(goal.goal_id)
              }
              className="px-3 py-2"
              type="button"
              variant="danger"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          )}
        </div>
      )}
    </Panel>
  )
}

export default GoalCard
