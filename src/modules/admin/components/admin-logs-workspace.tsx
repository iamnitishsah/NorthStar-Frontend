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
  const { data = [], isLoading, isError } = useAuditLogs(filters)

  if (isLoading) {
    return <LoadingSkeleton rows={4} />
  }

  if (isError) {
    return (
      <ErrorState message="Unable to load audit logs." />
    )
  }

  return (
    <AuditLogTable
      actionFilter={actionFilter}
      logs={data}
      onActionFilterChange={setActionFilter}
      onUserFilterChange={setUserFilter}
      userFilter={userFilter}
    />
  )
}

export default AdminLogsWorkspace
