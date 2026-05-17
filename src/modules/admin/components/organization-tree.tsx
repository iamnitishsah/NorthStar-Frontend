import type { HierarchyNode } from "@/types/goal"

import OrgTreeNode from "./org-tree-node"

type Props = {
  hierarchy: HierarchyNode[]
}

function OrganizationTree({ hierarchy }: Props) {
  if (hierarchy.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        No organization hierarchy found.
      </div>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">
          Organization Hierarchy
        </h2>
        <p className="text-sm text-slate-500">
          Expand teams to inspect reporting structure.
        </p>
      </div>

      <div className="space-y-3">
        {hierarchy.map((node) => (
          <OrgTreeNode
            key={node.employee_id}
            node={node}
          />
        ))}
      </div>
    </section>
  )
}

export default OrganizationTree
