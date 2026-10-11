import { MessageSquare, Share2 } from "lucide-react"
import { memo } from "react"

import InfoTooltip from "@/components/ui/info-tooltip"
import { MetricTile } from "@/components/ui/surface"
import { ProgressBadge, StatusBadge } from "@/components/ui/status-badge"
import { formatDateIST } from "@/lib/datetime"
import {
  GOAL_HELP,
  getCheckinAchievementHelp,
  getMeasurementHelp,
  getProgressStatusBadgeHelp,
} from "@/lib/goal-help"
import type { Goal } from "@/types/goal"

import ProgressBar from "./progress-bar"
import {
  getQuarterAchievement,
  getQuarterProgress,
  getQuarterLabel,
  quarterKeys,
} from "../utils/quarterly"

type Props = {
  goal: Goal
  compact?: boolean
  onComment?: (goal: Goal, quarter: number) => void
}

function getProgressTone(status?: string) {
  if (status === "COMPLETED") return "success"
  if (status === "ON_TRACK") return "info"
  if (status === "AT_RISK" || status === "DELAYED") return "warning"
  return "default"
}

function formatAchievement(goal: Goal, achievement: number | string | null | undefined) {
  if (achievement === null || achievement === undefined) return "-"

  return goal.uom_type === "TIMELINE" && typeof achievement === "string"
    ? formatDateIST(achievement)
    : achievement
}

function QuarterlyTimeline({
  goal,
  compact = false,
  onComment,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <h4 className="text-sm font-semibold text-card-foreground">
            Quarterly Progress
          </h4>
          <InfoTooltip content={GOAL_HELP.quarterlyProgressSection} />
        </div>

        {goal.is_shared && (
          <div className="flex items-center gap-1.5">
            <StatusBadge tone="info" icon={<Share2 size={13} />}>
              Synced shared goal
            </StatusBadge>
            <InfoTooltip content={GOAL_HELP.sharedGoalBadge} />
          </div>
        )}
      </div>

      <div className={compact ? "grid gap-3" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-4"}>
        {quarterKeys.map((quarter) => {
          const checkin = goal.quarter?.[quarter]
          const progress = getQuarterProgress(goal, quarter)
          const achievement = getQuarterAchievement(goal, quarter)
          const quarterNumber = Number(quarter)

          return (
            <MetricTile key={quarter}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-surface-foreground">
                    {getQuarterLabel(quarter)}
                  </span>
                  <InfoTooltip content={GOAL_HELP.quarterSequence} />
                </div>
                <div className="flex items-center gap-1">
                  <ProgressBadge tone={getProgressTone(checkin?.progress_status)}>
                    {checkin?.progress_status ?? "PENDING"}
                  </ProgressBadge>
                  <InfoTooltip
                    content={getProgressStatusBadgeHelp(checkin?.progress_status)}
                  />
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <span>Achievement</span>
                    <InfoTooltip content={getCheckinAchievementHelp(goal)} />
                  </span>
                  <span className="font-medium text-surface-foreground">
                    {formatAchievement(goal, achievement)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <span>Progress</span>
                    <InfoTooltip
                      content={getMeasurementHelp(
                        goal.measurement_type,
                        goal.uom_type
                      )}
                    />
                  </span>
                  <span className="font-medium text-surface-foreground">
                    {progress === null || progress === undefined
                      ? "-"
                      : `${Math.round(progress)}%`}
                  </span>
                </div>

                <ProgressBar value={progress} />
              </div>

              {checkin?.manager_note && (
                <div className="mt-3 rounded-md border border-border bg-card p-2">
                  <div className="mb-1 flex items-center gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Manager Note
                    </span>
                    <InfoTooltip content={GOAL_HELP.managerQuarterlyComment} />
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {checkin.manager_note}
                  </p>
                </div>
              )}

              {onComment && checkin && (
                <button
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => onComment(goal, quarterNumber)}
                  type="button"
                >
                  <MessageSquare size={14} />
                  Comment
                </button>
              )}
            </MetricTile>
          )
        })}
      </div>
    </div>
  )
}

export default memo(QuarterlyTimeline)
