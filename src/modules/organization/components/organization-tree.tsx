import { Building2, Network, Users } from "lucide-react"

import EmptyState from "@/components/ui/empty-state"
import type { HierarchyNode } from "@/types/goal"

import OrgTreeNode from "./org-tree-node"

type Props = {
  hierarchy: HierarchyNode[]
  title?: string
  description?: string
  showHeader?: boolean
}

function getHierarchyStats(hierarchy: HierarchyNode[]) {
  let people = 0
  const departments = new Set<string>()
  let maxDepth = 0

  function walk(nodes: HierarchyNode[], depth: number) {
    maxDepth = Math.max(maxDepth, depth)

    nodes.forEach((node) => {
      people += 1
      departments.add(node.department)
      walk(node.children, depth + 1)
    })
  }

  walk(hierarchy, 1)

  return {
    people,
    departments: departments.size,
    levels: maxDepth,
    roots: hierarchy.length,
  }
}

function OrganizationTree({
  hierarchy,
  title = "Organization Hierarchy",
  description = "Expand teams to inspect reporting structure.",
  showHeader = true,
}: Props) {
  if (hierarchy.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No organization data yet"
        description="Once the hierarchy is configured, it will appear here for the entire company."
      />
    )
  }

  const stats = getHierarchyStats(hierarchy)

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900">
      {showHeader && (
        <div className="border-b border-slate-200 p-5 dark:border-slate-700">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0D47A1] dark:text-blue-300">
                Reporting Structure
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
                {title}
              </h2>
              <p className="mt-1 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">People</p>
                <p className="font-mono text-lg font-semibold text-slate-950 dark:text-white">
                  {stats.people}
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">Departments</p>
                <p className="font-mono text-lg font-semibold text-slate-950 dark:text-white">
                  {stats.departments}
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">Levels</p>
                <p className="font-mono text-lg font-semibold text-slate-950 dark:text-white">
                  {stats.levels}
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">Roots</p>
                <p className="font-mono text-lg font-semibold text-slate-950 dark:text-white">
                  {stats.roots}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="inline-flex items-center gap-2">
            <Network size={16} />
            Drag or scroll horizontally to inspect wide teams.
          </span>
          <span className="inline-flex items-center gap-2">
            <Building2 size={16} />
            Cards show role, designation, department, reports, and employee ID.
          </span>
        </div>
      </div>

      <div className="overflow-x-auto bg-slate-50 p-4 dark:bg-slate-950 sm:p-6">
        <div className="inline-flex min-w-full justify-center gap-12 py-4">
          {hierarchy.map((node) => (
            <OrgTreeNode
              key={node.employee_id}
              node={node}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default OrganizationTree
