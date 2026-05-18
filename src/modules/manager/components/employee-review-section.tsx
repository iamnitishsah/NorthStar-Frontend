import type { EmployeeReviewGroup } from "../utils/review-goals"
import ReviewGoalCard from "./review-goal-card"
import type { Goal } from "@/types/goal"

type Props = {
  group: EmployeeReviewGroup
  onApprove: (goal: Goal) => void
  onReturn: (goal: Goal) => void
}

function EmployeeReviewSection({
  group,
  onApprove,
  onReturn,
}: Props) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm shadow-enterprise-sm">
      <div className="flex flex-col gap-3 border-b border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            {group.employeeName}
          </h2>
          <p className="text-sm text-muted-foreground">
            {group.goalCount} submitted {group.goalCount === 1 ? "goal" : "goals"}
          </p>
        </div>

        <div className="rounded-md border border-border bg-card px-4 py-2 font-mono text-sm font-semibold text-surface-foreground">
          Total weightage: {group.totalWeightage}%
        </div>
      </div>

      <div className="space-y-4 p-4">
        {group.goals.map((goal) => (
          <ReviewGoalCard
            goal={goal}
            key={goal.goal_id}
            onApprove={onApprove}
            onReturn={onReturn}
          />
        ))}
      </div>
    </section>
  )
}

export default EmployeeReviewSection
