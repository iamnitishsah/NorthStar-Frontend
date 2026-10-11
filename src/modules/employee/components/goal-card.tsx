import { ClipboardCheck, LockOpen, Pencil, Share2, Trash2 } from "lucide-react"

import Button from "@/components/ui/button"
import InfoTooltip from "@/components/ui/info-tooltip"
import { MetricTile, Panel } from "@/components/ui/surface"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatDateIST, formatDateTimeIST } from "@/lib/datetime"
import {
  GOAL_HELP,
  getGoalStatusHelp,
  getGoalTargetHelp,
  getMeasurementHelp,
  getUomHelp,
} from "@/lib/goal-help"
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
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {goal.thrust_area}
            </p>
            <InfoTooltip content={GOAL_HELP.thrustArea} />
          </div>

          <div className="mt-0.5 flex items-center gap-1.5">
            <h3 className="break-words text-lg font-semibold text-card-foreground">
              {goal.title}
            </h3>
            <InfoTooltip content={GOAL_HELP.title} />
          </div>
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
              <span>Select</span>
              <InfoTooltip content={GOAL_HELP.selectGoalForSubmission} />
            </label>
          )}
          <div className="flex items-center gap-1.5">
            <GoalStatusBadge
              status={goal.status}
            />
            <InfoTooltip content={getGoalStatusHelp(goal.status)} />
          </div>
          {goal.is_shared && (
            <div className="flex items-center gap-1.5">
              <StatusBadge tone="accent" icon={<Share2 size={13} />}>
                Shared
              </StatusBadge>
              <InfoTooltip content={GOAL_HELP.sharedGoalBadge} />
            </div>
          )}
        </div>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {goal.manager_note && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-warning">
            <span>Manager Feedback Note</span>
            <InfoTooltip content={GOAL_HELP.managerReturnNote} />
          </div>
          <p className="mt-1 leading-relaxed text-surface-foreground">
            {goal.manager_note}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <MetricTile>
          <div className="flex items-center justify-between gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Target & UoM
            </p>
            <InfoTooltip content={getGoalTargetHelp(goal)} />
          </div>

          <p className="mt-1 flex items-center gap-1.5 truncate font-mono font-semibold text-surface-foreground">
            <span>{goal.target_value}</span>
            <span className="text-muted-foreground">
              {goal.uom_type}
            </span>
            <InfoTooltip content={getUomHelp(goal.uom_type)} />
          </p>
        </MetricTile>

        <MetricTile>
          <div className="flex items-center justify-between gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Measure
            </p>
            <InfoTooltip
              content={getMeasurementHelp(goal.measurement_type, goal.uom_type)}
            />
          </div>

          <p className="mt-1 truncate font-mono font-semibold text-surface-foreground">
            {goal.measurement_type}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              ({goal.measurement_type === "MIN" ? "Higher is better" : "Lower is better"})
            </span>
          </p>
        </MetricTile>

        <MetricTile>
          <div className="flex items-center justify-between gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Weightage
            </p>
            <InfoTooltip content={GOAL_HELP.weightage} />
          </div>

          <p className="mt-1 truncate font-mono font-semibold text-surface-foreground">
            {goal.weightage}%
          </p>
        </MetricTile>

        {goal.target_date && (
          <MetricTile>
            <div className="flex items-center justify-between gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Target Date
              </p>
              <InfoTooltip content={GOAL_HELP.targetDate} />
            </div>

            <p className="mt-1 truncate font-mono font-semibold text-surface-foreground">
              {formatDateIST(goal.target_date)}
            </p>
          </MetricTile>
        )}

        {goal.created_at && (
          <MetricTile>
            <div className="flex items-center justify-between gap-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Created
              </p>
              <InfoTooltip content={GOAL_HELP.createdTimestamp} />
            </div>

            <p className="mt-1 truncate font-mono font-semibold text-surface-foreground">
              {formatDateTimeIST(goal.created_at)}
            </p>
          </MetricTile>
        )}
      </div>

      {(goal.approved_at || goal.returned_at || goal.updated_at) && (
        <dl className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
          {goal.approved_at && (
            <div>
              <dt className="flex items-center gap-1 font-semibold uppercase tracking-wide">
                <span>Approved</span>
                <InfoTooltip content={GOAL_HELP.approvedTimestamp} />
              </dt>
              <dd>{formatDateTimeIST(goal.approved_at)}</dd>
            </div>
          )}
          {goal.returned_at && (
            <div>
              <dt className="flex items-center gap-1 font-semibold uppercase tracking-wide">
                <span>Returned</span>
                <InfoTooltip content={GOAL_HELP.returnedTimestamp} />
              </dt>
              <dd>{formatDateTimeIST(goal.returned_at)}</dd>
            </div>
          )}
          {goal.updated_at && (
            <div>
              <dt className="flex items-center gap-1 font-semibold uppercase tracking-wide">
                <span>Updated</span>
                <InfoTooltip content={GOAL_HELP.updatedTimestamp} />
              </dt>
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
