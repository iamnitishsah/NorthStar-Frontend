import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  IdCard,
  Network,
  Users,
} from "lucide-react"
import { memo, useState } from "react"

import type { HierarchyNode } from "@/types/goal"
import { cn } from "@/lib/utils"

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
  const directReports = node.children.length

  return (
    <div className="flex min-w-max flex-col items-center">
      <article
        className={cn(
          "relative w-72 rounded-lg border bg-white p-4 text-left shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900",
          depth === 0
            ? "border-[#0D47A1]/30 ring-2 ring-[#0D47A1]/10"
            : "border-slate-200"
        )}
      >
        <div className="absolute right-3 top-3">
          <button
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-label={
              hasChildren
                ? `${isOpen ? "Collapse" : "Expand"} ${node.name}'s reports`
                : `${node.name} has no reports`
            }
            className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
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

        <div className="flex items-start gap-3 pr-9">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0D47A1]/10 text-[#0D47A1] dark:bg-[#0D47A1]/20 dark:text-blue-200">
            <Network size={20} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-base font-semibold text-slate-950 dark:text-white">
                {node.name}
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {node.role}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              {node.designation}
            </p>
          </div>
        </div>

        <dl className="mt-4 grid gap-2 text-xs">
          <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <BriefcaseBusiness size={14} />
            <dt className="sr-only">Department</dt>
            <dd className="truncate font-medium">{node.department}</dd>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Users size={14} />
              <dt className="sr-only">Direct reports</dt>
              <dd className="font-mono font-semibold">
                {directReports} report{directReports === 1 ? "" : "s"}
              </dd>
            </div>

            <div className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <IdCard size={14} />
              <dt className="sr-only">Employee ID</dt>
              <dd className="truncate font-mono font-semibold">
                {node.employee_id}
              </dd>
            </div>
          </div>
        </dl>
      </article>

      {isOpen && hasChildren && (
        <div className="flex min-w-max flex-col items-center">
          <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />
          <div className="relative flex min-w-max justify-center">
            <div className="absolute left-36 right-36 top-0 h-px bg-slate-300 dark:bg-slate-700" />
            {node.children.map((child) => (
              <div
                className="relative flex min-w-[18rem] flex-col items-center px-5 pt-6"
                key={child.employee_id}
              >
                <div className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-slate-300 dark:bg-slate-700" />
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
