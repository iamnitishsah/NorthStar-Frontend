import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { fetchAuditLogs, unlockGoal } from "../api/admin-api"
import type { AuditLogFilters } from "../api/admin-api"
export {
  organizationHierarchyQueryKey,
  useOrganizationHierarchy,
} from "@/modules/organization/hooks/use-organization-hierarchy"

export const auditLogsQueryKey = ["admin-audit-logs"] as const

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
