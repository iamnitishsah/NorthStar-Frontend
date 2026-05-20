import { Check, RotateCcw } from "lucide-react"

import Button from "@/components/ui/button"
import { MetricTile, Panel } from "@/components/ui/surface"
import { formatDateIST, formatDateTimeIST } from "@/lib/datetime"
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
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {goal.thrust_area}
          </p>
          <h3 className="break-words text-lg font-semibold text-card-foreground">
            {goal.title}
          </h3>
        </div>

        <ReviewStatusBadge status={goal.status} />
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {goal.description || "No description provided."}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <MetricTile>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Target</dt>
          <dd className="mt-1 truncate font-mono font-semibold text-surface-foreground">
            {goal.target_value}{" "}
            <span className="text-muted-foreground">
              {goal.uom_type}
            </span>
          </dd>
        </MetricTile>

        <MetricTile>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Weightage</dt>
          <dd className="mt-1 truncate font-mono font-semibold text-surface-foreground">
            {goal.weightage}%
          </dd>
        </MetricTile>

        <MetricTile>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Measure</dt>
          <dd className="mt-1 truncate font-mono font-semibold text-surface-foreground">
            {goal.measurement_type}
          </dd>
        </MetricTile>

        <MetricTile>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Goal ID</dt>
          <dd className="mt-1 truncate font-mono font-semibold text-surface-foreground">
            {goal.goal_id}
          </dd>
        </MetricTile>

        {goal.target_date && (
          <MetricTile>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Target Date</dt>
            <dd className="mt-1 truncate font-mono font-semibold text-surface-foreground">
              {formatDateIST(goal.target_date)}
            </dd>
          </MetricTile>
        )}

        {goal.submitted_at && (
          <MetricTile>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Submitted</dt>
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
