import { Link } from "react-router-dom"
import { CheckCircle2, Clock, Target, TrendingUp } from "lucide-react"

import Button from "@/components/ui/button"
import Card from "@/components/ui/card"
import ErrorState from "@/components/ui/error-state"
import LoadingSkeleton from "@/components/ui/loading-skeleton"
import PageHeader from "@/components/ui/page-header"
import StatCard from "@/components/ui/stat-card"
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
        title="Employee Dashboard"
        description="Track goal readiness, approval state, and quarterly progress."
        actions={
          <Button>
            <Link to="/employee/goals">Manage Goals</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Target} label="Total Goals" value={data.length} />
        <StatCard icon={CheckCircle2} label="Locked Goals" value={lockedGoals.length} />
        <StatCard icon={Clock} label="In Review" value={submittedGoals.length} />
        <StatCard icon={TrendingUp} label="Avg Progress" value={`${averageProgress}%`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Goal Sheet Readiness
              </h2>
              <p className="text-sm text-slate-500">
                Submission requires exactly 100% total weightage.
              </p>
            </div>
            <span className="text-2xl font-semibold text-slate-950">
              {totalWeightage}%
            </span>
          </div>
          <div className="mt-5">
            <ProgressBar value={totalWeightage} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-slate-950">
            Workflow Summary
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Draft / Returned</span>
              <span className="font-medium text-slate-950">
                {editableGoals.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Completed</span>
              <span className="font-medium text-slate-950">
                {completedGoals.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shared Goals</span>
              <span className="font-medium text-slate-950">
                {data.filter((goal) => goal.is_shared).length}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default EmployeeDashboard
