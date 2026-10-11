import { memo } from "react"
import { clampProgress, getProgressBarClassName } from "../utils/quarterly"

type Props = {
  value?: number | null
}

function ProgressBar({ value }: Props) {
  const width = clampProgress(value)
  const fillClassName = getProgressBarClassName(value)

  return (
    <div
      aria-label="Goal progress"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(width)}
      className="h-2.5 w-full overflow-hidden rounded-full border border-border/60 bg-muted"
      role="progressbar"
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ease-out ${fillClassName}`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

export default memo(ProgressBar)
