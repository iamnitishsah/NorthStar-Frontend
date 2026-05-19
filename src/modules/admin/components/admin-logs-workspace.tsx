import { useMemo, useState } from "react"

import ErrorState from "@/components/ui/error-state"
import LoadingSkeleton from "@/components/ui/loading-skeleton"

import { useAuditLogs } from "../hooks/use-admin"
import AuditLogTable from "./audit-log-table"

function AdminLogsWorkspace() {
  const [actionFilter, setActionFilter] = useState("")
  const [userFilter, setUserFilter] = useState("")
  const filters = useMemo(
    () => ({
      action: actionFilter || undefined,
      user_id: userFilter.trim() || undefined,
    }),
    [actionFilter, userFilter]
  )
  const allLogsQuery = useAuditLogs()
  const filteredLogsQuery = useAuditLogs(filters)

  if (allLogsQuery.isLoading || filteredLogsQuery.isLoading) {
    return <LoadingSkeleton rows={4} />
  }

  if (allLogsQuery.isError || filteredLogsQuery.isError) {
    return (
      <ErrorState message="Unable to load audit logs." />
    )
  }

  return (
    <AuditLogTable
      actionFilter={actionFilter}
      allLogs={allLogsQuery.data ?? []}
      logs={filteredLogsQuery.data ?? []}
      onActionFilterChange={setActionFilter}
      onUserFilterChange={setUserFilter}
      userFilter={userFilter}
    />
  )
}

export default AdminLogsWorkspace
