import type { Goal } from "@/types/goal"
import type { EmployeeReviewGroup } from "../utils/review-goals"
import ManagerProgressCard from "./manager-progress-card"

type Props = {
  group: EmployeeReviewGroup
  onComment: (goal: Goal, quarter: number) => void
}

function ManagerProgressSection({
  group,
  onComment,
}: Props) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">
            {group.employeeName}
          </h2>
          <p className="text-sm text-slate-500">
            {group.goalCount} locked {group.goalCount === 1 ? "goal" : "goals"}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
          Total weightage: {group.totalWeightage}%
        </div>
      </div>

      <div className="space-y-4 p-4">
        {group.goals.map((goal) => (
          <ManagerProgressCard
            goal={goal}
            key={goal.goal_id}
            onComment={onComment}
          />
        ))}
      </div>
    </section>
  )
}

export default ManagerProgressSection
