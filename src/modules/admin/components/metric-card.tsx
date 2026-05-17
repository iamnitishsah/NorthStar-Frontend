import type { LucideIcon } from "lucide-react"

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
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

export default MetricCard
