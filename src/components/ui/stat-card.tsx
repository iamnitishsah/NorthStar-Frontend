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
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {value}
          </p>
          {helper && (
            <p className="mt-2 text-sm text-slate-500">
              {helper}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

export default StatCard
