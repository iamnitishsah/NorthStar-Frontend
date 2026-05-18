import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type Props = {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="dashboard-surface theme-transition rounded-lg border-dashed p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon size={22} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-card-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  )
}

export default EmptyState
