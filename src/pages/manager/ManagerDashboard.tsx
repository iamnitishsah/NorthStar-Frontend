import { Link } from "react-router-dom"
import { ClipboardCheck, LineChart, Target, Users } from "lucide-react"

import Card from "@/components/ui/card"
import ErrorState from "@/components/ui/error-state"
import LoadingSkeleton from "@/components/ui/loading-skeleton"
import PageHeader from "@/components/ui/page-header"
import StatCard from "@/components/ui/stat-card"
import EmptyState from "@/components/ui/empty-state"
import { MetricTile } from "@/components/ui/surface"
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
            <Link
              className="theme-transition inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground hover:border-primary/35 hover:bg-hover"
              to="/manager/progress"
            >
              View Progress
            </Link>
            <Link
              className="theme-transition inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-enterprise-sm hover:bg-primary/90"
              to="/manager/review"
            >
              Review Goals
            </Link>
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
        <h2 className="text-lg font-semibold text-card-foreground">
          Review Queue
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {reviewGroups.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState
                icon={ClipboardCheck}
                title="No submitted goals"
                description="Submitted team goals will appear here when they need review."
              />
            </div>
          ) : (
            reviewGroups.slice(0, 6).map((group) => (
              <MetricTile
                className="p-4"
                key={group.employeeName}
              >
                <p className="truncate font-medium text-surface-foreground">{group.employeeName}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {group.goalCount} goals · {group.totalWeightage}% weightage
                </p>
              </MetricTile>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

export default ManagerDashboard
