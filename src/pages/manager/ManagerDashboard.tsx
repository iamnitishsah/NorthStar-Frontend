import { Link } from "react-router-dom"
import { ClipboardCheck, LineChart, Target, Users } from "lucide-react"

import Button from "@/components/ui/button"
import Card from "@/components/ui/card"
import ErrorState from "@/components/ui/error-state"
import LoadingSkeleton from "@/components/ui/loading-skeleton"
import PageHeader from "@/components/ui/page-header"
import StatCard from "@/components/ui/stat-card"
import {
  useManagerGoals,
  useReviewGoals,
} from "@/modules/manager/hooks/use-manager-review"
import {
  getReviewGoalCount,
  toEmployeeReviewGroups,
} from "@/modules/manager/utils/review-goals"

function ManagerDashboard() {
  const reviewQuery = useReviewGoals()
  const goalsQuery = useManagerGoals()

  if (reviewQuery.isLoading || goalsQuery.isLoading) {
    return <LoadingSkeleton rows={4} />
  }

  if (reviewQuery.isError || goalsQuery.isError) {
    return (
      <ErrorState
        message="Unable to load manager dashboard."
        onRetry={() => {
          reviewQuery.refetch()
          goalsQuery.refetch()
        }}
      />
    )
  }

  const reviewGroups = toEmployeeReviewGroups(reviewQuery.data ?? {})
  const lockedGroups = toEmployeeReviewGroups(goalsQuery.data ?? {})
  const pendingGoals = getReviewGoalCount(reviewGroups)
  const lockedGoals = getReviewGoalCount(lockedGroups)
  const teamMembers = new Set([
    ...reviewGroups.map((group) => group.employeeName),
    ...lockedGroups.map((group) => group.employeeName),
  ]).size

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manager Dashboard"
        description="Review submitted goals and monitor quarterly progress across your team."
        actions={
          <>
            <Button variant="secondary">
              <Link to="/manager/progress">View Progress</Link>
            </Button>
            <Button>
              <Link to="/manager/review">Review Goals</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardCheck} label="Pending Review" value={pendingGoals} />
        <StatCard icon={Target} label="Locked Goals" value={lockedGoals} />
        <StatCard icon={Users} label="Team Members" value={teamMembers} />
        <StatCard icon={LineChart} label="Tracked Groups" value={lockedGroups.length} />
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Review Queue
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {reviewGroups.length === 0 ? (
            <p className="text-sm text-slate-500">No submitted goals waiting for review.</p>
          ) : (
            reviewGroups.slice(0, 6).map((group) => (
              <div
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                key={group.employeeName}
              >
                <p className="font-medium text-slate-950">{group.employeeName}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {group.goalCount} goals · {group.totalWeightage}% weightage
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

export default ManagerDashboard
