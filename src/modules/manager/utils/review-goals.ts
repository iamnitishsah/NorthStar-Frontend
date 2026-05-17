import type { Goal } from "@/types/goal"

export type EmployeeReviewGroup = {
  employeeName: string
  goals: Goal[]
  goalCount: number
  totalWeightage: number
}

export function toEmployeeReviewGroups(
  groupedGoals: Record<string, Goal[]>
): EmployeeReviewGroup[] {
  return Object.entries(groupedGoals)
    .map(([employeeName, goals]) => ({
      employeeName,
      goals,
      goalCount: goals.length,
      totalWeightage: goals.reduce(
        (sum, goal) => sum + goal.weightage,
        0
      ),
    }))
    .sort((left, right) =>
      left.employeeName.localeCompare(right.employeeName)
    )
}

export function getReviewGoalCount(groups: EmployeeReviewGroup[]) {
  return groups.reduce(
    (sum, group) => sum + group.goalCount,
    0
  )
}
