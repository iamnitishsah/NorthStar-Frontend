import { Check, RotateCcw, Share2 } from "lucide-react"

import Button from "@/components/ui/button"
import InfoTooltip from "@/components/ui/info-tooltip"
import { StatusBadge } from "@/components/ui/status-badge"
import { MetricTile, Panel } from "@/components/ui/surface"
import { formatDateIST, formatDateTimeIST } from "@/lib/datetime"
import {
  GOAL_HELP,
  getGoalStatusHelp,
  getGoalTargetHelp,
  getMeasurementHelp,
  getUomHelp,
} from "@/lib/goal-help"
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
    <Panel className="hover:border-primary/30 hover:shadow-enterprise-md">
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
          <div className="flex items-center gap-1.5">
            <ReviewStatusBadge status={goal.status} />
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

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {goal.description || "No description provided."}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <MetricTile>
          <dt className="flex items-center justify-between gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Target & UoM</span>
            <InfoTooltip content={getGoalTargetHelp(goal)} />
          </dt>
          <dd className="mt-1 flex items-center gap-1.5 truncate font-mono font-semibold text-surface-foreground">
            <span>{goal.target_value}</span>
            <span className="text-muted-foreground">
              {goal.uom_type}
            </span>
            <InfoTooltip content={getUomHelp(goal.uom_type)} />
          </dd>
        </MetricTile>

        <MetricTile>
          <dt className="flex items-center justify-between gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Weightage</span>
            <InfoTooltip content={GOAL_HELP.weightage} />
          </dt>
          <dd className="mt-1 truncate font-mono font-semibold text-surface-foreground">
            {goal.weightage}%
          </dd>
        </MetricTile>

        <MetricTile>
          <dt className="flex items-center justify-between gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Measure</span>
            <InfoTooltip
              content={getMeasurementHelp(goal.measurement_type, goal.uom_type)}
            />
          </dt>
          <dd className="mt-1 truncate font-mono font-semibold text-surface-foreground">
            {goal.measurement_type}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              ({goal.measurement_type === "MIN" ? "Higher is better" : "Lower is better"})
            </span>
          </dd>
        </MetricTile>

        <MetricTile>
          <dt className="flex items-center justify-between gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Goal ID</span>
            <InfoTooltip content={GOAL_HELP.goalId} />
          </dt>
          <dd className="mt-1 truncate font-mono font-semibold text-surface-foreground">
            {goal.goal_id}
          </dd>
        </MetricTile>

        {goal.target_date && (
          <MetricTile>
            <dt className="flex items-center justify-between gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Target Date</span>
              <InfoTooltip content={GOAL_HELP.targetDate} />
            </dt>
            <dd className="mt-1 truncate font-mono font-semibold text-surface-foreground">
              {formatDateIST(goal.target_date)}
            </dd>
          </MetricTile>
        )}

        {goal.submitted_at && (
          <MetricTile>
            <dt className="flex items-center justify-between gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Submitted</span>
              <InfoTooltip content={GOAL_HELP.submittedTimestamp} />
            </dt>
            <dd className="mt-1 truncate font-mono font-semibold text-surface-foreground">
              {formatDateTimeIST(goal.submitted_at)}
            </dd>
          </MetricTile>
        )}
      </dl>

      {canAct && (
        <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4">
          <Button
            className="bg-success text-primary-foreground hover:bg-success/90"
            onClick={() => onApprove(goal)}
            type="button"
          >
            <Check size={16} />
            Approve
          </Button>

          <Button
            className="border-warning/25 text-warning hover:bg-warning/10 hover:text-warning"
            onClick={() => onReturn(goal)}
            type="button"
            variant="secondary"
          >
            <RotateCcw size={16} />
            Return
          </Button>
        </div>
      )}
    </Panel>
  )
}

export default ReviewGoalCard
