import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  approveUnlockRequest,
  exportAchievementReport,
  fetchAuditLogs,
  fetchCompletionDashboard,
  fetchGoalDistributionAnalytics,
  fetchQoqAnalytics,
  fetchUnlockRequests,
  rejectUnlockRequest,
  unlockGoal,
} from "../api/admin-api"
import type { AuditLogFilters, UnlockRequestFilters } from "../api/admin-api"
export {
  organizationHierarchyQueryKey,
  useOrganizationHierarchy,
} from "@/modules/organization/hooks/use-organization-hierarchy"

export const auditLogsQueryKey = ["admin-audit-logs"] as const
export const unlockRequestsQueryKey = ["admin-unlock-requests"] as const
export const completionDashboardQueryKey = ["admin-completion-dashboard"] as const
export const qoqAnalyticsQueryKey = ["admin-qoq-analytics"] as const
export const goalDistributionQueryKey = ["admin-goal-distribution"] as const

export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: [...auditLogsQueryKey, filters],
    queryFn: () => fetchAuditLogs(filters),
  })
}

export function useUnlockRequests(filters: UnlockRequestFilters = {}) {
  return useQuery({
    queryKey: [...unlockRequestsQueryKey, filters],
    queryFn: () => fetchUnlockRequests(filters),
  })
}

export function useCompletionDashboard() {
  return useQuery({
    queryKey: completionDashboardQueryKey,
    queryFn: fetchCompletionDashboard,
  })
}

export function useQoqAnalytics() {
  return useQuery({
    queryKey: qoqAnalyticsQueryKey,
    queryFn: fetchQoqAnalytics,
  })
}

export function useGoalDistributionAnalytics() {
  return useQuery({
    queryKey: goalDistributionQueryKey,
    queryFn: fetchGoalDistributionAnalytics,
  })
}

export function useExportAchievementReport() {
  return useMutation({
    mutationFn: exportAchievementReport,
  })
}

export function useUnlockGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unlockGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: auditLogsQueryKey,
      })
      queryClient.invalidateQueries({
        queryKey: unlockRequestsQueryKey,
      })
      queryClient.invalidateQueries({
        queryKey: completionDashboardQueryKey,
      })
    },
  })
}

export function useApproveUnlockRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveUnlockRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: auditLogsQueryKey,
      })
      queryClient.invalidateQueries({
        queryKey: unlockRequestsQueryKey,
      })
      queryClient.invalidateQueries({
        queryKey: completionDashboardQueryKey,
      })
    },
  })
}

export function useRejectUnlockRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectUnlockRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: auditLogsQueryKey,
      })
      queryClient.invalidateQueries({
        queryKey: unlockRequestsQueryKey,
      })
      queryClient.invalidateQueries({
        queryKey: completionDashboardQueryKey,
      })
    },
  })
}
