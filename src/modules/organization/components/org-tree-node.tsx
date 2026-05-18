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
import { MetricTile } from "@/components/ui/surface"
import { StatusBadge } from "@/components/ui/status-badge"

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
          "dashboard-surface theme-transition relative w-72 rounded-lg p-4 text-left",
          depth === 0
            ? "border-primary/30 ring-2 ring-primary/10"
            : undefined
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
            className="theme-transition rounded-md border border-border p-1.5 text-muted-foreground hover:bg-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
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
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Network size={20} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-base font-semibold text-card-foreground">
                {node.name}
              </h3>
              <StatusBadge className="uppercase tracking-wide" tone={depth === 0 ? "info" : "default"}>
                {node.role}
              </StatusBadge>
            </div>

            <p className="mt-1 text-sm font-medium text-surface-foreground">
              {node.designation}
            </p>
          </div>
        </div>

        <dl className="mt-4 grid gap-2 text-xs">
          <MetricTile className="flex items-center gap-2 px-3 py-2 text-xs">
            <BriefcaseBusiness size={14} />
            <dt className="sr-only">Department</dt>
            <dd className="truncate font-medium">{node.department}</dd>
          </MetricTile>

          <div className="grid grid-cols-2 gap-2">
            <MetricTile className="flex items-center gap-2 px-3 py-2 text-xs">
              <Users size={14} />
              <dt className="sr-only">Direct reports</dt>
              <dd className="font-mono font-semibold">
                {directReports} report{directReports === 1 ? "" : "s"}
              </dd>
            </MetricTile>

            <MetricTile className="flex items-center gap-2 px-3 py-2 text-xs">
              <IdCard size={14} />
              <dt className="sr-only">Employee ID</dt>
              <dd className="truncate font-mono font-semibold">
                {node.employee_id}
              </dd>
            </MetricTile>
          </div>
        </dl>
      </article>

      {isOpen && hasChildren && (
        <div className="flex min-w-max flex-col items-center">
          <div className="h-6 w-px bg-border" />
          <div className="relative flex min-w-max justify-center">
            <div className="absolute left-36 right-36 top-0 h-px bg-border" />
            {node.children.map((child) => (
              <div
                className="relative flex min-w-[18rem] flex-col items-center px-4 pt-6"
                key={child.employee_id}
              >
                <div className="absolute left-1/2 top-0 h-6 w-px -translate-x-1/2 bg-border" />
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
