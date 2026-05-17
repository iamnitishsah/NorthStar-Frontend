import {
  CheckCircle2,
  Lock,
  Target,
  Users,
} from "lucide-react"

import { useAuditLogs, useOrganizationHierarchy } from "../hooks/use-admin"
import {
  getActionCounts,
  getAdminMetrics,
  getDepartmentCounts,
  getGoalLifecycleCounts,
  getLockedGoalCandidates,
  getQuarterlyTrend,
} from "../utils/admin-analytics"
import AdminCharts from "./admin-charts"
import MetricCard from "./metric-card"
import OrganizationTree from "@/modules/organization/components/organization-tree"
import UnlockGoalPanel from "./unlock-goal-panel"
import UnlockRequestsPanel from "./unlock-requests-panel"

function AdminDashboardWorkspace() {
  const hierarchyQuery = useOrganizationHierarchy()
  const logsQuery = useAuditLogs()

  if (hierarchyQuery.isLoading || logsQuery.isLoading) {
    return <div className="text-slate-600">Loading admin dashboard...</div>
  }

  if (hierarchyQuery.isError || logsQuery.isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Unable to load admin dashboard.
      </div>
    )
  }

  const hierarchy = hierarchyQuery.data ?? []
  const logs = logsQuery.data ?? []
  const metrics = getAdminMetrics(hierarchy, logs)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">
          Admin Control Center
        </h1>
        <p className="mt-1 text-slate-500">
          Organization visibility, governance controls, and performance analytics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Total Employees"
          value={metrics.totalEmployees}
        />
        <MetricCard
          icon={Target}
          label="Total Goals"
          value={metrics.totalGoals}
        />
        <MetricCard
          icon={Lock}
          label="Locked Goals"
          value={metrics.lockedGoals}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Quarterly Completion"
          value={`${metrics.quarterlyCompletion}%`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <UnlockRequestsPanel />
        <UnlockGoalPanel lockedGoalCandidates={getLockedGoalCandidates(logs)} />
      </div>

      <AdminCharts
        actionCounts={getActionCounts(logs)}
        departmentCounts={getDepartmentCounts(hierarchy)}
        lifecycleCounts={getGoalLifecycleCounts(logs)}
        quarterlyTrend={getQuarterlyTrend(logs)}
      />

      <OrganizationTree hierarchy={hierarchy} />
    </div>
  )
}

export default AdminDashboardWorkspace
