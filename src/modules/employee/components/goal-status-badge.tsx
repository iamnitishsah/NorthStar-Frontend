import type { GoalStatus } from "@/types/goal"

type Props = {
  status: GoalStatus
}

const colors: Partial<Record<GoalStatus, string>> = {
  DRAFT:
    "bg-slate-100 text-slate-700 ring-slate-200",

  SUBMITTED:
    "bg-blue-50 text-[#1565C0] ring-blue-100",

  LOCKED:
    "bg-[#0D47A1]/10 text-[#0D47A1] ring-[#0D47A1]/15",

  RETURNED:
    "bg-orange-50 text-[#EF6C00] ring-orange-100",

  ADMIN_UNLOCKED:
    "bg-green-50 text-[#2E7D32] ring-green-100",
}

function GoalStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`
        shrink-0 rounded-md px-2.5 py-1 font-mono text-xs font-semibold ring-1
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
