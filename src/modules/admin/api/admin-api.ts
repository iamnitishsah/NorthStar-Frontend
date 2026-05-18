import { api } from "@/services/api"
import { endpoints } from "@/services/endpoints"
import type {
  ApiMessageResponse,
  AuditLogEntry,
  CompletionDashboardRow,
  GoalDistributionAnalyticsResponse,
  QoqAnalyticsResponse,
  UnlockRequest,
  UnlockRequestStatus,
} from "@/types/goal"

export type AuditLogFilters = {
  action?: string
  user_id?: string
}

export type UnlockRequestFilters = {
  status?: UnlockRequestStatus
}

export async function fetchAuditLogs(filters: AuditLogFilters = {}) {
  const response = await api.get<AuditLogEntry[]>(
    endpoints.adminGoals.logs,
    {
      params: filters,
    }
  )

  return response.data
}

export async function fetchCompletionDashboard() {
  const response = await api.get<CompletionDashboardRow[]>(
    endpoints.adminGoals.completionDashboard
  )

  return response.data
}

export async function fetchQoqAnalytics() {
  const response = await api.get<QoqAnalyticsResponse>(
    endpoints.adminAnalytics.qoq
  )

  return response.data
}

export async function fetchGoalDistributionAnalytics() {
  const response = await api.get<GoalDistributionAnalyticsResponse>(
    endpoints.adminAnalytics.distribution
  )

  return response.data
}

export async function exportAchievementReport() {
  const response = await api.get<Blob>(
    endpoints.adminGoals.export,
    {
      responseType: "blob",
    }
  )

  const url = window.URL.createObjectURL(response.data)
  const link = document.createElement("a")
  link.href = url
  link.download = "achievement_report.csv"
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export async function unlockGoal(goalId: string) {
  const response = await api.patch<ApiMessageResponse>(
    endpoints.adminGoals.unlock(goalId)
  )

  return response.data
}

export async function fetchUnlockRequests(
  filters: UnlockRequestFilters = {}
) {
  const response = await api.get<UnlockRequest[]>(
    endpoints.adminGoals.unlockRequests,
    {
      params: filters,
    }
  )

  return response.data
}

export async function approveUnlockRequest(requestId: string) {
  const response = await api.patch<ApiMessageResponse>(
    endpoints.adminGoals.approveUnlockRequest(requestId)
  )

  return response.data
}

export async function rejectUnlockRequest({
  requestId,
  reason,
}: {
  requestId: string
  reason?: string
}) {
  const response = await api.patch<ApiMessageResponse>(
    endpoints.adminGoals.rejectUnlockRequest(requestId),
    {
      reason: reason?.trim() || undefined,
    }
  )

  return response.data
}
