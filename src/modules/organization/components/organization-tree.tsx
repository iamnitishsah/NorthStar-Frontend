import { Building2, Network, Users } from "lucide-react"

import EmptyState from "@/components/ui/empty-state"
import { MetricTile, Panel } from "@/components/ui/surface"
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
    <Panel className="overflow-hidden p-0">
      {showHeader && (
        <div className="border-b border-border p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Reporting Structure
              </p>
              <h2 className="mt-1 text-xl font-semibold text-card-foreground">
                {title}
              </h2>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <MetricTile>
                <p className="text-xs text-muted-foreground">People</p>
                <p className="font-mono text-lg font-semibold text-surface-foreground">
                  {stats.people}
                </p>
              </MetricTile>
              <MetricTile>
                <p className="text-xs text-muted-foreground">Departments</p>
                <p className="font-mono text-lg font-semibold text-surface-foreground">
                  {stats.departments}
                </p>
              </MetricTile>
              <MetricTile>
                <p className="text-xs text-muted-foreground">Levels</p>
                <p className="font-mono text-lg font-semibold text-surface-foreground">
                  {stats.levels}
                </p>
              </MetricTile>
              <MetricTile>
                <p className="text-xs text-muted-foreground">Roots</p>
                <p className="font-mono text-lg font-semibold text-surface-foreground">
                  {stats.roots}
                </p>
              </MetricTile>
            </div>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 border-b border-border bg-surface px-5 py-3 text-sm text-muted-foreground">
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

      <div className="overflow-x-auto bg-background p-4 [scrollbar-gutter:stable] sm:p-6">
        <div className="inline-flex min-w-full justify-start gap-12 py-4 xl:justify-center">
          {hierarchy.map((node) => (
            <OrgTreeNode
              key={node.employee_id}
              node={node}
            />
          ))}
        </div>
      </div>
    </Panel>
  )
}

export default OrganizationTree
