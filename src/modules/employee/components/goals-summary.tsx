import { CheckCircle2, AlertCircle } from "lucide-react"
import InfoTooltip from "@/components/ui/info-tooltip"
import { Panel } from "@/components/ui/surface"
import { StatusBadge } from "@/components/ui/status-badge"
import { GOAL_HELP } from "@/lib/goal-help"
import type { Goal } from "@/types/goal"

type Props = {
  goals: Goal[]
  selectedGoals?: Goal[]
  lockedGoals?: Goal[]
}

function GoalsSummary({ goals, selectedGoals, lockedGoals = [] }: Props) {
  const activeGoals = selectedGoals
    ? [...selectedGoals, ...lockedGoals]
    : goals
  const totalWeightage = activeGoals.reduce(
    (sum, goal) => sum + goal.weightage,
    0
  )
  const goalCount = activeGoals.length
  const totalGoals = goals.length
  const progressValue = Math.min(totalWeightage, 100)
  const isComplete = totalWeightage === 100 && goalCount <= 8 && goalCount > 0

  return (
    <Panel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Submission Readiness
            </p>
            <InfoTooltip content={GOAL_HELP.submissionReadiness} />
            <StatusBadge
              tone={isComplete ? "success" : "warning"}
              icon={
                isComplete ? (
                  <CheckCircle2 size={12} />
                ) : (
                  <AlertCircle size={12} />
                )
              }
            >
              {isComplete ? "Ready to Submit" : "Requires 100% Weightage"}
            </StatusBadge>
          </div>
          <p className="mt-2 flex items-center gap-2 font-mono text-2xl font-bold text-card-foreground sm:text-3xl">
            <span>{totalWeightage}%</span>
            <span className="text-sm font-normal text-muted-foreground">/ 100% weightage</span>
            <InfoTooltip content={GOAL_HELP.weightage} />
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 font-mono text-sm font-bold text-surface-foreground">
            <span>{goalCount} / 8 Active Goals</span>
            <InfoTooltip content={GOAL_HELP.activeGoalsLimit} />
          </div>
        </div>
      </div>

      <div
        aria-label="Selected goal weightage"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progressValue}
        className="mt-4 h-3 w-full overflow-hidden rounded-full border border-border/60 bg-muted"
        role="progressbar"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isComplete
              ? "bg-success"
              : totalWeightage > 100
                ? "bg-destructive"
                : "bg-warning"
          }`}
          style={{ width: `${progressValue}%` }}
        />
      </div>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Submission is calculated from selected editable goals plus already locked goals ({lockedGoals.length} locked, {totalGoals} total goals in workspace).
      </p>
    </Panel>
  )
}

export default GoalsSummary
