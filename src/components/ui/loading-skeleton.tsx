type Props = {
  rows?: number
}

function LoadingSkeleton({ rows = 3 }: Props) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          className="animate-pulse rounded-lg border border-slate-200 bg-white p-5"
          key={index}
        >
          <div className="h-4 w-1/3 rounded bg-slate-200" />
          <div className="mt-4 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
