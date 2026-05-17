import { Users } from "lucide-react"

import EmptyState from "@/components/ui/empty-state"
import type { HierarchyNode } from "@/types/goal"

import OrgTreeNode from "./org-tree-node"

type Props = {
  hierarchy: HierarchyNode[]
  title?: string
  description?: string
  showHeader?: boolean
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

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      {showHeader && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            {title}
          </h2>
          <p className="text-sm text-slate-500">
            {description}
          </p>
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        {hierarchy.map((node) => (
          <div
            className="mb-8 flex min-w-[320px] justify-center last:mb-0"
            key={node.employee_id}
          >
            <OrgTreeNode node={node} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default OrganizationTree
