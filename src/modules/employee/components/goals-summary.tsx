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
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm shadow-enterprise-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Submission Summary
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-card-foreground">
            {totalWeightage}% weightage
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface px-4 py-2 font-mono text-sm font-semibold text-surface-foreground">
          {goalCount} / 8 goals
        </div>
      </div>

      <progress
        aria-label="Selected goal weightage"
        className={
          isComplete
            ? "mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted accent-accent"
            : "mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted accent-warning"
        }
        max={100}
        value={progressValue}
      />

      <p className="mt-2 text-sm text-muted-foreground">
        Submission is calculated from selected editable goals plus already locked goals. {totalGoals} total goals available.
      </p>
    </section>
  )
}

export default GoalsSummary
