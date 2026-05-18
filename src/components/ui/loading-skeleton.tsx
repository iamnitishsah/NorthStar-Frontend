type Props = {
  rows?: number
}

function LoadingSkeleton({ rows = 3 }: Props) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          className="dashboard-surface animate-pulse rounded-lg p-5"
          key={index}
        >
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="mt-4 h-3 w-full rounded bg-muted" />
          <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
