import { ChevronDown, ChevronRight } from "lucide-react"
import { memo, useState } from "react"

import type { HierarchyNode } from "@/types/goal"

type Props = {
  node: HierarchyNode
  depth?: number
}

function OrgTreeNode({
  node,
  depth = 0,
}: Props) {
  const [isOpen, setIsOpen] = useState(depth < 2)
  const hasChildren = node.children.length > 0

  return (
    <div>
      <div
        className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
        style={{ marginLeft: depth * 20 }}
      >
        <button
          className="mt-1 rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
          disabled={!hasChildren}
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {hasChildren && isOpen ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-950">
              {node.name}
            </h3>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
              {node.role}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-600">
            {node.designation}
          </p>
          <p className="text-xs text-slate-500">
            {node.department} · {node.employee_id}
          </p>
        </div>
      </div>

      {isOpen && hasChildren && (
        <div className="mt-2 space-y-2 border-l border-slate-200 pl-3">
          {node.children.map((child) => (
            <OrgTreeNode
              depth={depth + 1}
              key={child.employee_id}
              node={child}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default memo(OrgTreeNode)
