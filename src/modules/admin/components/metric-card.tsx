import type { LucideIcon } from "lucide-react"

import InfoTooltip from "@/components/ui/info-tooltip"
import { Panel } from "@/components/ui/surface"
import type { GoalHelpContent } from "@/lib/goal-help"

type Props = {
  label: string
  value: string | number
  icon: LucideIcon
  tooltip?: GoalHelpContent
}

function MetricCard({
  label,
  value,
  icon: Icon,
  tooltip,
}: Props) {
  return (
    <Panel>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            {tooltip && <InfoTooltip content={tooltip} />}
          </div>
          <p className="mt-2 truncate font-mono text-3xl font-semibold text-card-foreground">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon size={20} />
        </div>
      </div>
    </Panel>
  )
}

export default MetricCard
