import type { ReactNode } from "react"

type Props = {
  title: string
  description?: string
  actions?: ReactNode
}

function PageHeader({
  title,
  description,
  actions,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-3xl font-bold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  )
}

export default PageHeader
