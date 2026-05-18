import { StatusBadge } from "@/components/ui/status-badge"
import type { GoalStatus } from "@/types/goal"

type Props = {
  status: GoalStatus
}

const tones: Partial<Record<GoalStatus, Parameters<typeof StatusBadge>[0]["tone"]>> = {
  DRAFT: "default",
  SUBMITTED: "info",
  LOCKED: "accent",
  RETURNED: "warning",
  ADMIN_UNLOCKED: "success",
}

function GoalStatusBadge({
  status,
}: Props) {
  return (
    <StatusBadge className="shrink-0 font-mono" tone={tones[status] ?? "default"}>
      {status}
    </StatusBadge>
  )
}

export default GoalStatusBadge
