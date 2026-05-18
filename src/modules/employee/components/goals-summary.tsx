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
  const progressWidth = Math.min(totalWeightage, 100)
  const isComplete = totalWeightage === 100 && goalCount <= 8 && goalCount > 0

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Submission Summary
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold text-slate-950">
            {totalWeightage}% weightage
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 font-mono text-sm font-semibold text-slate-700">
          {goalCount} / 8 goals
        </div>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={
            isComplete
              ? "h-full rounded-full bg-gradient-to-r from-[#00897B] to-[#2E7D32] transition-all duration-300"
              : "h-full rounded-full bg-gradient-to-r from-[#EF6C00] to-[#00897B] transition-all duration-300"
          }
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-slate-500">
        Submission is calculated from selected editable goals plus already locked goals. {totalGoals} total goals available.
      </p>
    </section>
  )
}

export default GoalsSummary
