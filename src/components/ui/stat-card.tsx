import type { LucideIcon } from "lucide-react"

import type { GoalHelpContent } from "@/lib/goal-help"
import InfoTooltip from "./info-tooltip"
import { Panel } from "./surface"

type Props = {
  label: string
  value: string | number
  icon: LucideIcon
  helper?: string
  tooltip?: GoalHelpContent
}

function StatCard({
  label,
  value,
  icon: Icon,
  helper,
  tooltip,
}: Props) {
  return (
    <Panel className="group relative overflow-hidden hover:border-primary/35 hover:shadow-enterprise-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            {tooltip && <InfoTooltip content={tooltip} />}
          </div>
          <p className="mt-2.5 truncate font-mono text-3xl font-bold tracking-tight text-card-foreground">
            {value}
          </p>
          {helper && (
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {helper}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform group-hover:scale-105">
          <Icon size={20} />
        </div>
      </div>
    </Panel>
  )
}

export default StatCard
