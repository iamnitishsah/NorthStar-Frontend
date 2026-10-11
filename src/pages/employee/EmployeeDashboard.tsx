import { Link } from "react-router-dom"
import { CheckCircle2, Clock, Target, TrendingUp } from "lucide-react"

import Card from "@/components/ui/card"
import ErrorState from "@/components/ui/error-state"
import InfoTooltip from "@/components/ui/info-tooltip"
import LoadingSkeleton from "@/components/ui/loading-skeleton"
import PageHeader from "@/components/ui/page-header"
import StatCard from "@/components/ui/stat-card"
import { MetricTile } from "@/components/ui/surface"
import { GOAL_HELP, getGoalStatusHelp } from "@/lib/goal-help"
import { useMyGoals } from "@/modules/employee/hooks/use-my-goals"
import ProgressBar from "@/modules/quarterly/components/progress-bar"

function EmployeeDashboard() {
  const { data = [], isLoading, isError, refetch } = useMyGoals()

  if (isLoading) {
    return <LoadingSkeleton rows={4} />
  }

  if (isError) {
    return (
      <ErrorState
        message="Unable to load employee dashboard."
        onRetry={() => refetch()}
      />
    )
  }

  const lockedGoals = data.filter((goal) => goal.status === "LOCKED")
  const submittedGoals = data.filter((goal) => goal.status === "SUBMITTED")
  const editableGoals = data.filter(
    (goal) =>
      goal.status === "DRAFT" ||
      goal.status === "RETURNED" ||
      goal.status === "ADMIN_UNLOCKED"
  )
  const completedGoals = data.filter(
    (goal) => (goal.progress_percentage ?? 0) >= 100
  )
  const totalWeightage = data.reduce((sum, goal) => sum + goal.weightage, 0)
  const averageProgress = lockedGoals.length
    ? Math.round(
        lockedGoals.reduce(
          (sum, goal) => sum + (goal.progress_percentage ?? 0),
          0
        ) / lockedGoals.length
      )
    : 0

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Employee Workspace"
        title="Employee Dashboard"
        description="Track goal readiness, approval state, and quarterly progress."
        actions={
          <Link
            className="theme-transition inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-enterprise-xs hover:bg-primary/90"
            to="/employee/goals"
          >
            Manage Goals
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Target}
          label="Total Goals"
          tooltip={GOAL_HELP.goalDefinition}
          value={data.length}
        />
        <StatCard
          icon={CheckCircle2}
          label="Locked Goals"
          tooltip={getGoalStatusHelp("LOCKED")}
          value={lockedGoals.length}
        />
        <StatCard
          icon={Clock}
          label="In Review"
          tooltip={getGoalStatusHelp("SUBMITTED")}
          value={submittedGoals.length}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Progress"
          tooltip={GOAL_HELP.quarterlyProgressSection}
          value={`${averageProgress}%`}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="p-6 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-card-foreground">
                  Goal Sheet Readiness
                </h2>
                <InfoTooltip content={GOAL_HELP.submissionReadiness} />
              </div>
              <p className="text-sm text-muted-foreground">
                Submission requires exactly 100% total weightage.
              </p>
            </div>
            <span className="shrink-0 font-mono text-2xl font-bold text-card-foreground">
              {totalWeightage}%
            </span>
          </div>
          <div className="mt-5">
            <ProgressBar value={totalWeightage} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-card-foreground">
            Workflow Summary
          </h2>
          <div className="mt-4 grid gap-3 text-sm">
            <MetricTile className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span>Draft / Returned</span>
                <InfoTooltip content={getGoalStatusHelp("DRAFT")} />
              </span>
              <span className="font-mono font-bold text-surface-foreground">
                {editableGoals.length}
              </span>
            </MetricTile>
            <MetricTile className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span>Completed</span>
                <InfoTooltip content={GOAL_HELP.progressStatus} />
              </span>
              <span className="font-mono font-bold text-surface-foreground">
                {completedGoals.length}
              </span>
            </MetricTile>
            <MetricTile className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span>Shared Goals</span>
                <InfoTooltip content={GOAL_HELP.sharedGoalBadge} />
              </span>
              <span className="font-mono font-bold text-surface-foreground">
                {data.filter((goal) => goal.is_shared).length}
              </span>
            </MetricTile>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default EmployeeDashboard
