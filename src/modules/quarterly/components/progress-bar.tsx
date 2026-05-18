import {
  clampProgress,
} from "../utils/quarterly"
import { memo } from "react"

type Props = {
  value?: number | null
}

function ProgressBar({ value }: Props) {
  const width = clampProgress(value)
  const accentClassName =
    value === null || value === undefined
      ? "accent-slate-300"
      : value >= 100
        ? "accent-emerald-500"
        : value >= 50
          ? "accent-sky-500"
          : "accent-amber-500"

  return (
    <progress
      aria-label="Goal progress"
      className={`h-2 w-full overflow-hidden rounded-full bg-muted ${accentClassName}`}
      max={100}
      value={width}
    />
  )
}

export default memo(ProgressBar)
