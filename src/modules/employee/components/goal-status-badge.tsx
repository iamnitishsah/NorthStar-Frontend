import type { GoalStatus } from "@/types/goal"

type Props = {
  status: GoalStatus
}

const colors: Partial<Record<GoalStatus, string>> = {
  DRAFT:
    "bg-slate-200 text-slate-700",

  SUBMITTED:
    "bg-yellow-100 text-yellow-700",

  LOCKED:
    "bg-green-100 text-green-700",

  RETURNED:
    "bg-red-100 text-red-700",

  ADMIN_UNLOCKED:
    "bg-blue-100 text-blue-700",
}

function GoalStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`
        shrink-0 rounded px-2.5 py-1 text-xs font-medium
        ${
          colors[status] ||
          "bg-slate-100 text-slate-700"
        }
      `}
    >
      {status}
    </span>
  )
}

export default GoalStatusBadge
