import { useMemo, useState } from "react"

import type { AuditLogEntry } from "@/types/goal"

type Props = {
  logs: AuditLogEntry[]
  actionFilter: string
  onActionFilterChange: (action: string) => void
  userFilter: string
  onUserFilterChange: (userId: string) => void
}

function formatDetails(details: Record<string, unknown>) {
  return JSON.stringify(details, null, 2)
}

function AuditLogTable({
  logs,
  actionFilter,
  onActionFilterChange,
  userFilter,
  onUserFilterChange,
}: Props) {
  const [search, setSearch] = useState("")
  const actions = useMemo(
    () =>
      Array.from(new Set(logs.map((log) => log.action))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [logs]
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
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    })
  }, [logs, search])

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 p-5 dark:border-slate-700">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#EF6C00]">
            Operational Audit
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
            Audit Logs
          </h1>
          <p className="mt-1 text-slate-500">
            Search and filter governance events across goal workflows.
          </p>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <input
            className="min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search logs"
            value={search}
          />

          <select
            className="min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            onChange={(event) => onActionFilterChange(event.target.value)}
            value={actionFilter}
          >
            <option value="">All actions</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>

          <input
            className="min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            onChange={(event) => onUserFilterChange(event.target.value)}
            placeholder="Filter user ID"
            value={userFilter}
          />
        </div>
      </div>

      {visibleLogs.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">
          No audit logs found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[980px] divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="sticky top-0 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {visibleLogs.map((log) => (
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/70" key={log._id}>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="rounded-md bg-[#0D47A1]/10 px-2 py-1 font-mono text-xs font-semibold text-[#0D47A1]">
                      {log.action}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono font-medium text-slate-900 dark:text-slate-100">
                    {log.user_id}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="max-w-xl px-5 py-4">
                    <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-words rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                      {formatDetails(log.details)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default AuditLogTable
