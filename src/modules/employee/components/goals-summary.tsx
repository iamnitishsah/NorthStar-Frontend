import type { Goal } from "@/types/goal"

type Props = {
  goals: Goal[]
  selectedGoals?: Goal[]
}

function GoalsSummary({ goals, selectedGoals }: Props) {
  const activeGoals = selectedGoals ?? goals
  const totalWeightage = activeGoals.reduce(
    (sum, goal) => sum + goal.weightage,
    0
  )
  const goalCount = activeGoals.length
  const totalGoals = goals.length
  const progressWidth = Math.min(totalWeightage, 100)
  const isComplete = totalWeightage === 100 && goalCount <= 8 && goalCount > 0

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Submission Summary
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {totalWeightage}% weightage
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
          {goalCount} / 8 goals
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={
            isComplete
              ? "h-full rounded-full bg-emerald-500"
              : "h-full rounded-full bg-amber-500"
          }
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-slate-500">
        Select up to 8 goals totaling exactly 100% to submit. {totalGoals} total goals available.
      </p>
    </section>
  )
}

export default GoalsSummary
