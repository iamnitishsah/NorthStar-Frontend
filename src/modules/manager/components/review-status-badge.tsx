import { StatusBadge } from "@/components/ui/status-badge"
import type { GoalStatus } from "@/types/goal"

type Props = {
  status: GoalStatus
}

const statusTone: Record<GoalStatus, Parameters<typeof StatusBadge>[0]["tone"]> = {
  DRAFT: "default",
  SUBMITTED: "warning",
  LOCKED: "success",
  RETURNED: "danger",
  ADMIN_UNLOCKED: "info",
}

function ReviewStatusBadge({ status }: Props) {
  return (
    <StatusBadge className="shrink-0 font-medium" tone={statusTone[status]}>
      {status}
    </StatusBadge>
  )
}

export default ReviewStatusBadge
