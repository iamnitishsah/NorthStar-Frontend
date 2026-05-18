import type { LucideIcon } from "lucide-react"

type Props = {
  label: string
  value: string | number
  icon: LucideIcon
  helper?: string
}

function StatCard({
  label,
  value,
  icon: Icon,
  helper,
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold text-slate-950">
            {value}
          </p>
          {helper && (
            <p className="mt-2 text-sm text-slate-500">
              {helper}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0D47A1]/10 text-[#0D47A1]">
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

export default StatCard
