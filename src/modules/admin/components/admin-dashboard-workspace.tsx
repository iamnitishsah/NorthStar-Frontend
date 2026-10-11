import {
  CheckCircle2,
  Download,
  Lock,
  Target,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import Button from "@/components/ui/button"
import ErrorState from "@/components/ui/error-state"
import LoadingSkeleton from "@/components/ui/loading-skeleton"
import PageHeader from "@/components/ui/page-header"
import { GOAL_HELP, getGoalStatusHelp } from "@/lib/goal-help"
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
    return <LoadingSkeleton rows={4} />
  }

  if (
    hierarchyQuery.isError ||
    logsQuery.isError ||
    completionQuery.isError ||
    qoqQuery.isError ||
    distributionQuery.isError
  ) {
    return (
      <ErrorState message="Unable to load admin dashboard." />
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
    <div className="min-w-0 space-y-6">
      <PageHeader
        badge="Admin Governance"
        title="Admin Control Center"
        description="Organization visibility, governance controls, and performance analytics."
        actions={
          <Button
            disabled={exportMutation.isPending}
            icon={<Download size={16} />}
            onClick={handleExport}
          >
            {exportMutation.isPending ? "Exporting..." : "Export CSV"}
          </Button>
        }
      />

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Total Employees"
          value={metrics.totalEmployees}
        />
        <MetricCard
          icon={Target}
          label="Total Goals"
          tooltip={GOAL_HELP.goalDefinition}
          value={metrics.totalGoals}
        />
        <MetricCard
          icon={Lock}
          label="Locked Goals"
          tooltip={getGoalStatusHelp("LOCKED")}
          value={metrics.lockedGoals}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Quarterly Completion"
          tooltip={GOAL_HELP.quarterlyProgressSection}
          value={`${metrics.quarterlyCompletion}%`}
        />
      </div>

      <div className="grid min-w-0 gap-4 2xl:grid-cols-2">
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
