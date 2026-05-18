import {
  CheckCircle2,
  Download,
  Lock,
  Target,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import Button from "@/components/ui/button"
import { getApiErrorMessage } from "@/services/api-error"
import {
  useAuditLogs,
  useCompletionDashboard,
  useExportAchievementReport,
  useGoalDistributionAnalytics,
  useOrganizationHierarchy,
  useQoqAnalytics,
} from "../hooks/use-admin"
import {
  getActionCounts,
  getAdminMetrics,
  getDepartmentCounts,
  getDistributionChartData,
  getGoalLifecycleCounts,
  getLockedGoalCandidates,
  getQoqTeamTrend,
  getUomDistributionChartData,
} from "../utils/admin-analytics"
import AdminCharts from "./admin-charts"
import MetricCard from "./metric-card"
import OrganizationTree from "@/modules/organization/components/organization-tree"
import UnlockGoalPanel from "./unlock-goal-panel"
import UnlockRequestsPanel from "./unlock-requests-panel"

function AdminDashboardWorkspace() {
  const hierarchyQuery = useOrganizationHierarchy()
  const logsQuery = useAuditLogs()
  const completionQuery = useCompletionDashboard()
  const qoqQuery = useQoqAnalytics()
  const distributionQuery = useGoalDistributionAnalytics()
  const exportMutation = useExportAchievementReport()

  if (
    hierarchyQuery.isLoading ||
    logsQuery.isLoading ||
    completionQuery.isLoading ||
    qoqQuery.isLoading ||
    distributionQuery.isLoading
  ) {
    return <div className="text-slate-600">Loading admin dashboard...</div>
  }

  if (
    hierarchyQuery.isError ||
    logsQuery.isError ||
    completionQuery.isError ||
    qoqQuery.isError ||
    distributionQuery.isError
  ) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Unable to load admin dashboard.
      </div>
    )
  }

  const hierarchy = hierarchyQuery.data ?? []
  const logs = logsQuery.data ?? []
  const completionRows = completionQuery.data ?? []
  const distribution = distributionQuery.data
  const metrics = getAdminMetrics(hierarchy, logs, completionRows)

  function handleExport() {
    exportMutation.mutate(undefined, {
      onSuccess: () => toast.success("Achievement report exported"),
      onError: (error) =>
        toast.error(getApiErrorMessage(error, "Export failed")),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Admin Control Center
          </h1>
          <p className="mt-1 text-slate-500">
            Organization visibility, governance controls, and performance analytics.
          </p>
        </div>

        <Button
          disabled={exportMutation.isPending}
          icon={<Download size={16} />}
          onClick={handleExport}
        >
          {exportMutation.isPending ? "Exporting..." : "Export CSV"}
        </Button>
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
        distributionCounts={getDistributionChartData(distribution)}
        lifecycleCounts={getGoalLifecycleCounts(logs)}
        quarterlyTrend={getQoqTeamTrend(qoqQuery.data)}
        uomCounts={getUomDistributionChartData(distribution)}
      />

      <OrganizationTree hierarchy={hierarchy} />
    </div>
  )
}

export default AdminDashboardWorkspace
