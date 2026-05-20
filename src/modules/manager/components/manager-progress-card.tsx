import { Share2 } from "lucide-react"

import { MetricTile, Panel, SectionCard } from "@/components/ui/surface"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatDateIST } from "@/lib/datetime"
import type { Goal } from "@/types/goal"
import QuarterlyTimeline from "@/modules/quarterly/components/quarterly-timeline"
import ProgressBar from "@/modules/quarterly/components/progress-bar"

type Props = {
  goal: Goal
  onComment: (goal: Goal, quarter: number) => void
}

function ManagerProgressCard({
  goal,
  onComment,
}: Props) {
  return (
    <Panel>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {goal.thrust_area}
            </p>
            {goal.is_shared && (
              <StatusBadge tone="info" icon={<Share2 size={13} />}>
                Shared
              </StatusBadge>
            )}
          </div>
          <h3 className="mt-1 break-words text-lg font-semibold text-card-foreground">
            {goal.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {goal.description || "No description provided."}
          </p>
        </div>

        <SectionCard className="w-full lg:w-64">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-surface-foreground">
              {goal.progress_percentage === null ||
              goal.progress_percentage === undefined
                ? "-"
                : `${Math.round(goal.progress_percentage)}%`}
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar value={goal.progress_percentage} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <MetricTile className="p-2">
              <p className="text-muted-foreground">Target</p>
              <p className="truncate font-medium text-surface-foreground">
                {goal.target_value}
              </p>
            </MetricTile>
            <MetricTile className="p-2">
              <p className="text-muted-foreground">Weightage</p>
              <p className="truncate font-medium text-surface-foreground">
                {goal.weightage}%
              </p>
            </MetricTile>
            {goal.target_date && (
              <MetricTile className="p-2">
                <p className="text-muted-foreground">Target Date</p>
                <p className="truncate font-medium text-surface-foreground">
                  {formatDateIST(goal.target_date)}
                </p>
              </MetricTile>
            )}
          </div>
        </SectionCard>
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <QuarterlyTimeline
          goal={goal}
          onComment={onComment}
        />
      </div>
    </Panel>
  )
}

export default ManagerProgressCard
