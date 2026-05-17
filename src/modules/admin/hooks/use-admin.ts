import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  fetchAuditLogs,
  fetchOrganizationHierarchy,
  unlockGoal,
} from "../api/admin-api"
import type { AuditLogFilters } from "../api/admin-api"

export const organizationHierarchyQueryKey = ["organization-hierarchy"] as const
export const auditLogsQueryKey = ["admin-audit-logs"] as const

export function useOrganizationHierarchy() {
  return useQuery({
    queryKey: organizationHierarchyQueryKey,
    queryFn: fetchOrganizationHierarchy,
  })
}

export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: [auditLogsQueryKey, filters],
    queryFn: () => fetchAuditLogs(filters),
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
    },
  })
}
