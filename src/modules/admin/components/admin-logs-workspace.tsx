import { useMemo, useState } from "react"

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
    return <div className="text-slate-600">Loading audit logs...</div>
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Unable to load audit logs.
      </div>
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
