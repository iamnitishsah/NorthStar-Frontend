import type { GoalStatus } from "@/types/goal"

type Props = {
  status: GoalStatus
}

const statusClassName: Record<GoalStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-amber-100 text-amber-800",
  LOCKED: "bg-emerald-100 text-emerald-800",
  RETURNED: "bg-red-100 text-red-800",
}

function ReviewStatusBadge({ status }: Props) {
  return (
    <span
      className={`shrink-0 rounded px-2.5 py-1 text-xs font-medium ${statusClassName[status]}`}
    >
      {status}
    </span>
  )
}

export default ReviewStatusBadge
