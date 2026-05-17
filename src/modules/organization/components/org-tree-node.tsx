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
  const [isOpen, setIsOpen] = useState(depth < 1)
  const hasChildren = node.children.length > 0

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-xs rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="absolute right-2 top-2">
          <button
            className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
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
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-950">
              {node.name}
            </h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {node.role}
            </span>
          </div>

          <div className="text-sm text-slate-600">
            {node.designation}
          </div>
          <div className="text-xs text-slate-500">
            {node.department}
          </div>
        </div>
      </div>

      {isOpen && hasChildren && (
        <div className="flex w-full flex-col items-center">
          <div className="h-5 w-px bg-slate-300" />
          <div className="h-px w-full max-w-5xl bg-slate-300" />
          <div className="flex w-full flex-wrap justify-center gap-6 pt-5">
            {node.children.map((child) => (
              <div
                className="relative flex flex-col items-center"
                key={child.employee_id}
              >
                <div className="absolute -top-5 left-1/2 h-5 w-px -translate-x-1/2 bg-slate-300" />
                <OrgTreeNode
                  depth={depth + 1}
                  node={child}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(OrgTreeNode)
