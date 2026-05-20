import { useMemo, useState } from "react"

import EmptyState from "@/components/ui/empty-state"
import { Input, Select } from "@/components/ui/form"
import { Panel } from "@/components/ui/surface"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  formatDateTimeFieldsIST,
  formatDateTimeIST,
  formatRelativeTimeIST,
} from "@/lib/datetime"
import type { AuditLogEntry } from "@/types/goal"
import { FileSearch } from "lucide-react"

type Props = {
  allLogs: AuditLogEntry[]
  logs: AuditLogEntry[]
  actionFilter: string
  onActionFilterChange: (action: string) => void
  userFilter: string
  onUserFilterChange: (userId: string) => void
}

function formatDetails(details: Record<string, unknown>) {
  return JSON.stringify(formatDateTimeFieldsIST(details), null, 2)
}

function AuditLogTable({
  allLogs,
  logs,
  actionFilter,
  onActionFilterChange,
  userFilter,
  onUserFilterChange,
}: Props) {
  const [search, setSearch] = useState("")
  const actions = useMemo(
    () =>
      Array.from(new Set(allLogs.map((log) => log.action))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [allLogs]
  )
  const visibleLogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return logs.filter((log) => {
      if (!normalizedSearch) return true

      return [
        log.action,
        log.user_id,
        formatDetails(log.details),
        log.timestamp,
        formatDateTimeIST(log.timestamp),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    })
  }, [logs, search])

  return (
    <Panel className="min-w-0 overflow-hidden p-0">
      <div className="border-b border-border p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-warning">
            Operational Audit
          </p>
          <h1 className="mt-1 text-2xl font-bold text-card-foreground sm:text-3xl">
            Audit Logs
          </h1>
          <p className="mt-1 text-muted-foreground">
            Search and filter governance events across goal workflows.
          </p>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <Input
            className="min-w-0"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search logs"
            value={search}
          />

          <Select
            className="min-w-0"
            onChange={(event) => onActionFilterChange(event.target.value)}
            value={actionFilter}
          >
            <option value="">All actions</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </Select>

          <Input
            className="min-w-0"
            onChange={(event) => onUserFilterChange(event.target.value)}
            placeholder="Filter user ID"
            value={userFilter}
          />
        </div>
      </div>

      {visibleLogs.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={FileSearch}
            title="No audit logs found"
            description="Try adjusting the action, user, or search filters."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[980px] divide-y divide-border text-sm">
            <thead className="sticky top-0 bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleLogs.map((log) => (
                <tr className="theme-transition hover:bg-hover" key={log._id}>
                  <td className="whitespace-nowrap px-5 py-4">
                    <StatusBadge className="font-mono" tone="info">
                      {log.action}
                    </StatusBadge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono font-medium text-card-foreground">
                    {log.user_id}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                    <time dateTime={log.timestamp} title={formatDateTimeIST(log.timestamp)}>
                      {formatDateTimeIST(log.timestamp)}
                    </time>
                    <span className="block text-xs">
                      {formatRelativeTimeIST(log.timestamp)}
                    </span>
                  </td>
                  <td className="max-w-xl px-5 py-4">
                    <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-surface p-3 text-xs text-surface-foreground">
                      {formatDetails(log.details)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}

export default AuditLogTable
