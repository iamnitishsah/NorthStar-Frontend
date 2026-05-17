type Props = {
  status: string
}

const colors: Record<
  string,
  string
> = {
  DRAFT:
    "bg-slate-200 text-slate-700",

  SUBMITTED:
    "bg-yellow-100 text-yellow-700",

  LOCKED:
    "bg-green-100 text-green-700",

  RETURNED:
    "bg-red-100 text-red-700",
}

function GoalStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-medium
        ${
          colors[status] ||
          "bg-slate-100"
        }
      `}
    >
      {status}
    </span>
  )
}

export default GoalStatusBadge