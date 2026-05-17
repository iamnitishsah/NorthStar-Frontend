import type { Goal } from "@/types/goal"

type Props = {
  goals: Goal[]
}

function GoalsSummary({ goals }: Props) {
  const totalWeightage = goals.reduce(
    (sum, goal) => sum + goal.weightage,
    0
  )
  const goalCount = goals.length
  const progressWidth = Math.min(totalWeightage, 100)
  const isComplete = totalWeightage === 100

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Goal Sheet Summary
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
        Submission requires exactly 100% total weightage and no more than 8 goals.
      </p>
    </section>
  )
}

export default GoalsSummary
