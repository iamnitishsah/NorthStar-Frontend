import { Share2 } from "lucide-react"

import InfoTooltip from "@/components/ui/info-tooltip"
import { MetricTile, Panel, SectionCard } from "@/components/ui/surface"
import { StatusBadge } from "@/components/ui/status-badge"
import { formatDateIST } from "@/lib/datetime"
import {
  GOAL_HELP,
  getGoalTargetHelp,
  getMeasurementHelp,
  getUomHelp,
} from "@/lib/goal-help"
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
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-muted-foreground">
                {goal.thrust_area}
              </p>
              <InfoTooltip content={GOAL_HELP.thrustArea} />
            </div>
            {goal.is_shared && (
              <div className="flex items-center gap-1.5">
                <StatusBadge tone="info" icon={<Share2 size={13} />}>
                  Shared
                </StatusBadge>
                <InfoTooltip content={GOAL_HELP.sharedGoalBadge} />
              </div>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <h3 className="break-words text-lg font-semibold text-card-foreground">
              {goal.title}
            </h3>
            <InfoTooltip content={GOAL_HELP.title} />
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {goal.description || "No description provided."}
          </p>
        </div>

        <SectionCard className="w-full lg:w-72">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span>Progress</span>
              <InfoTooltip
                content={getMeasurementHelp(goal.measurement_type, goal.uom_type)}
              />
            </span>
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
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs text-muted-foreground">Target & UoM</p>
                <InfoTooltip content={getGoalTargetHelp(goal)} />
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-1 font-mono text-xs font-medium text-surface-foreground">
                <span className="truncate">
                  {goal.target_value} {goal.uom_type}
                </span>
                <InfoTooltip content={getUomHelp(goal.uom_type)} />
              </div>
            </MetricTile>
            <MetricTile className="p-2">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs text-muted-foreground">Measure</p>
                <InfoTooltip
                  content={getMeasurementHelp(goal.measurement_type, goal.uom_type)}
                />
              </div>
              <p className="mt-0.5 truncate font-mono text-xs font-medium text-surface-foreground">
                {goal.measurement_type} ({goal.measurement_type === "MIN" ? "Higher" : "Lower"})
              </p>
            </MetricTile>
            <MetricTile className="p-2">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs text-muted-foreground">Weightage</p>
                <InfoTooltip content={GOAL_HELP.weightage} />
              </div>
              <p className="mt-0.5 truncate font-mono text-xs font-medium text-surface-foreground">
                {goal.weightage}%
              </p>
            </MetricTile>
            {goal.target_date && (
              <MetricTile className="p-2">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs text-muted-foreground">Target Date</p>
                  <InfoTooltip content={GOAL_HELP.targetDate} />
                </div>
                <p className="mt-0.5 truncate font-mono text-xs font-medium text-surface-foreground">
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
