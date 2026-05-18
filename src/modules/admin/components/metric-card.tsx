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
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 truncate font-mono text-3xl font-semibold text-slate-950 dark:text-white">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0D47A1]/10 text-[#0D47A1] dark:bg-blue-400/15 dark:text-blue-200">
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

export default MetricCard
