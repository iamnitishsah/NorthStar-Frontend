import type { AuditLogEntry, HierarchyNode } from "@/types/goal"

export type ChartDatum = {
  name: string
  value: number
}

export function flattenHierarchy(nodes: HierarchyNode[]): HierarchyNode[] {
  return nodes.flatMap((node) => [
    node,
    ...flattenHierarchy(node.children),
  ])
}

export function getDepartmentCounts(nodes: HierarchyNode[]): ChartDatum[] {
  const counts = flattenHierarchy(nodes).reduce<Record<string, number>>(
    (acc, node) => {
      acc[node.department] = (acc[node.department] ?? 0) + 1
      return acc
    },
    {}
  )

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }))
}

export function getActionCounts(logs: AuditLogEntry[]): ChartDatum[] {
  const counts = logs.reduce<Record<string, number>>((acc, log) => {
    acc[log.action] = (acc[log.action] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }))
}

export function getGoalLifecycleCounts(logs: AuditLogEntry[]): ChartDatum[] {
  const locked = logs.filter((log) => log.action === "APPROVE_GOAL").length
  const returned = logs.filter((log) => log.action === "RETURN_GOAL").length
  const unlocked = logs.filter((log) => log.action === "UNLOCK_GOAL").length
  const active = Math.max(
    logs.filter((log) => log.action === "CREATE_GOAL").length - locked,
    0
  )

  return [
    { name: "Active", value: active },
    { name: "Locked", value: locked },
    { name: "Returned", value: returned },
    { name: "Unlocked", value: unlocked },
  ]
}

export function getQuarterlyTrend(logs: AuditLogEntry[]): ChartDatum[] {
  const counts = {
    Q1: 0,
    Q2: 0,
    Q3: 0,
    Q4: 0,
  }

  logs
    .filter((log) => log.action === "QUARTERLY_CHECKIN")
    .forEach((log) => {
      const quarter = log.details.quarter

      if (typeof quarter === "number" && quarter >= 1 && quarter <= 4) {
        counts[`Q${quarter}` as keyof typeof counts] += 1
        return
      }

      if (typeof quarter === "string" && quarter in counts) {
        counts[quarter as keyof typeof counts] += 1
      }
    })

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }))
}

export function getGoalIdFromLog(log: AuditLogEntry) {
  const goalId = log.details.goal_id

  return typeof goalId === "string" ? goalId : null
}

export function getLockedGoalCandidates(logs: AuditLogEntry[]) {
  const unlocked = new Set(
    logs
      .filter((log) => log.action === "UNLOCK_GOAL")
      .map(getGoalIdFromLog)
      .filter((goalId): goalId is string => Boolean(goalId))
  )

  return logs
    .filter((log) => log.action === "APPROVE_GOAL")
    .map(getGoalIdFromLog)
    .filter((goalId): goalId is string => Boolean(goalId))
    .filter((goalId, index, goalIds) => goalIds.indexOf(goalId) === index)
    .filter((goalId) => !unlocked.has(goalId))
}

export function getAdminMetrics(
  hierarchy: HierarchyNode[],
  logs: AuditLogEntry[]
) {
  const employees = flattenHierarchy(hierarchy)
  const totalGoals = logs.filter((log) => log.action === "CREATE_GOAL").length
  const lockedGoals = logs.filter((log) => log.action === "APPROVE_GOAL").length
  const quarterlyCheckins = logs.filter(
    (log) => log.action === "QUARTERLY_CHECKIN"
  ).length
  const quarterlyCompletion = totalGoals
    ? Math.round((quarterlyCheckins / totalGoals) * 100)
    : 0

  return {
    totalEmployees: employees.length,
    totalGoals,
    lockedGoals,
    quarterlyCompletion,
  }
}
