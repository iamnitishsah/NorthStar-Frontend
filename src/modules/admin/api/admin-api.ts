import { api } from "@/services/api"
import { endpoints } from "@/services/endpoints"
import type {
  ApiMessageResponse,
  AuditLogEntry,
} from "@/types/goal"

export type AuditLogFilters = {
  action?: string
  user_id?: string
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

export async function unlockGoal(goalId: string) {
  const response = await api.patch<ApiMessageResponse>(
    endpoints.adminGoals.unlock(goalId)
  )

  return response.data
}
