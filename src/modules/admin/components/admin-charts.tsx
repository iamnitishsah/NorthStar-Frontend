import { BarChart3 } from "lucide-react"
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

import EmptyState from "@/components/ui/empty-state"
import { Panel } from "@/components/ui/surface"
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
  "var(--primary)",
  "var(--accent)",
  "var(--warning)",
  "var(--destructive)",
  "var(--info)",
  "var(--success)",
  "var(--muted-foreground)",
]

const chartAxisColor = "var(--ns-muted)"
const chartGridColor = "var(--ns-border)"

function compactLabel(label: string) {
  return label.length > 16 ? `${label.slice(0, 15)}...` : label
}

function EmptyChart({ label }: { label: string }) {
  return (
    <EmptyState
      icon={BarChart3}
      title="No chart data"
      description={label}
    />
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
    <div className="rounded-md border border-border bg-card px-3 py-2 text-sm shadow-enterprise-md">
      <p className="max-w-56 break-words font-medium text-card-foreground">
        {name}
      </p>
      <p className="mt-1 font-mono text-muted-foreground">
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
    <Panel className="min-w-0 p-4 sm:p-5">
      <h2 className="mb-4 text-base font-semibold text-card-foreground sm:text-lg">
        {title}
      </h2>
      {children}
    </Panel>
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
                <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
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
                  dot={{ fill: "var(--accent)", r: 4, strokeWidth: 0 }}
                  dataKey="value"
                  stroke="var(--accent)"
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
                <Bar dataKey="value" fill="var(--info)" radius={[4, 4, 0, 0]} />
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
                <Bar dataKey="value" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>
    </div>
  )
}

export default AdminCharts
