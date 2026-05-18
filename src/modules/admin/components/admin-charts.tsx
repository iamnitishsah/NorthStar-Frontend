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
  "#0f172a",
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
]

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500">
      {label}
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-950">
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
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartCard title="Department Headcount">
        {departmentCounts.length === 0 ? (
          <EmptyChart label="No department data available." />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
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
                <Tooltip />
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
              <LineChart data={quarterlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
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
              <BarChart data={uomCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
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
                <Tooltip />
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
              <BarChart data={actionCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>
    </div>
  )
}

export default AdminCharts
