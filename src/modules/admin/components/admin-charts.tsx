import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { ChartDatum } from "../utils/admin-analytics"

type Props = {
  departmentCounts: ChartDatum[]
  distributionCounts: ChartDatum[]
  actionCounts: ChartDatum[]
  lifecycleCounts: ChartDatum[]
  quarterlyTrend: ChartDatum[]
  uomCounts: ChartDatum[]
}

const chartColors = [
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#475569",
]

const chartAxisColor = "var(--ns-muted)"
const chartGridColor = "var(--ns-border)"

function compactLabel(label: string) {
  return label.length > 16 ? `${label.slice(0, 15)}...` : label
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
      {label}
    </div>
  )
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; payload?: ChartDatum }>
  label?: string
}) {
  if (!active || !payload?.length) return null

  const item = payload[0]
  const name = label || item.payload?.name || item.name || "Value"

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900">
      <p className="max-w-56 break-words font-medium text-slate-950 dark:text-white">
        {name}
      </p>
      <p className="mt-1 font-mono text-slate-600 dark:text-slate-300">
        {item.value ?? 0}
      </p>
    </div>
  )
}

function ChartCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
      <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-white sm:text-lg">
        {title}
      </h2>
      {children}
    </section>
  )
}

function AdminCharts({
  departmentCounts,
  distributionCounts,
  actionCounts,
  lifecycleCounts,
  quarterlyTrend,
  uomCounts,
}: Props) {
  return (
    <div className="grid min-w-0 gap-5 2xl:grid-cols-2">
      <ChartCard title="Department Headcount">
        {departmentCounts.length === 0 ? (
          <EmptyChart label="No department data available." />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentCounts} margin={{ bottom: 8, left: -12, right: 8, top: 8 }}>
                <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" interval={0} tick={{ fill: chartAxisColor, fontSize: 12 }} tickFormatter={compactLabel} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: chartAxisColor, fontSize: 12 }} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <ChartCard title="Goal Distribution by Thrust Area">
        {distributionCounts.length === 0 ? (
          <EmptyChart label="No goal distribution data available." />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionCounts}
                  dataKey="value"
                  innerRadius={56}
                  nameKey="name"
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {distributionCounts.map((entry, index) => (
                    <Cell
                      fill={chartColors[index % chartColors.length]}
                      key={entry.name}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <ChartCard title="Team QoQ Average Progress">
        {quarterlyTrend.every((item) => item.value === 0) ? (
          <EmptyChart label="No QoQ analytics available." />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quarterlyTrend} margin={{ bottom: 8, left: -12, right: 16, top: 8 }}>
                <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: chartAxisColor, fontSize: 12 }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: chartAxisColor, fontSize: 12 }} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  dot={{ fill: "#059669", r: 4, strokeWidth: 0 }}
                  dataKey="value"
                  stroke="#059669"
                  strokeWidth={3}
                  type="monotone"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <ChartCard title="Goal Distribution by UoM">
        {uomCounts.length === 0 ? (
          <EmptyChart label="No UoM distribution data available." />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uomCounts} margin={{ bottom: 8, left: -12, right: 8, top: 8 }}>
                <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" interval={0} tick={{ fill: chartAxisColor, fontSize: 12 }} tickFormatter={compactLabel} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: chartAxisColor, fontSize: 12 }} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
                <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <ChartCard title="Goal Lifecycle Signals">
        {lifecycleCounts.every((item) => item.value === 0) ? (
          <EmptyChart label="No goal lifecycle data available." />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lifecycleCounts}
                  dataKey="value"
                  innerRadius={56}
                  nameKey="name"
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {lifecycleCounts.map((entry, index) => (
                    <Cell
                      fill={chartColors[index % chartColors.length]}
                      key={entry.name}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <ChartCard title="Audit Action Distribution">
        {actionCounts.length === 0 ? (
          <EmptyChart label="No audit logs available." />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actionCounts} margin={{ bottom: 8, left: -12, right: 8, top: 8 }}>
                <CartesianGrid stroke={chartGridColor} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis allowDecimals={false} tick={{ fill: chartAxisColor, fontSize: 12 }} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
                <Bar dataKey="value" fill="#0891b2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>
    </div>
  )
}

export default AdminCharts
