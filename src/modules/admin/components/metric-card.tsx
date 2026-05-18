import type { LucideIcon } from "lucide-react"

import { Panel } from "@/components/ui/surface"

type Props = {
  label: string
  value: string | number
  icon: LucideIcon
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: Props) {
  return (
    <Panel>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
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
