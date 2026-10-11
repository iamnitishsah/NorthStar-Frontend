import type { ReactNode } from "react"

type Props = {
  title: string
  description?: string
  actions?: ReactNode
  badge?: string
}

function PageHeader({
  title,
  description,
  actions,
  badge,
}: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {badge && (
          <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            {badge}
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  )
}

export default PageHeader
